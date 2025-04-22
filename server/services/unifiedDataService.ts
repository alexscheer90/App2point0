/**
 * Service for providing unified data from multiple sources (SIDEARM, ESPN, MAC)
 */
import axios from 'axios';
import { Game, GameStatus } from '../../shared/schema';
import { checkSidearmAvailability, fetchSidearmGameData, processSidearmData } from './sidearmService';

interface DataSourceInfo {
  recommendedSource: 'sidearm' | 'espn' | 'mac';
  sidearmAvailable: boolean;
  espnAvailable: boolean;
  sidearmUrl?: string;
  espnUrl?: string;
}

/**
 * Check all available data sources for a game and recommend which to use
 */
export async function checkDataSources(game: Game, sport: string): Promise<DataSourceInfo> {
  const result: DataSourceInfo = {
    recommendedSource: 'mac', // Default to MAC data
    sidearmAvailable: false,
    espnAvailable: false
  };
  
  try {
    // Check SIDEARM availability first (preferred source)
    const sidearmCheck = await checkSidearmAvailability(game, sport);
    result.sidearmAvailable = sidearmCheck.available;
    
    if (sidearmCheck.feedUrl) {
      result.sidearmUrl = sidearmCheck.feedUrl;
    }
    
    // If SIDEARM is available, recommend it
    if (result.sidearmAvailable) {
      result.recommendedSource = 'sidearm';
      return result;
    }
    
    // Check ESPN availability (secondary source)
    // For now, we'll assume ESPN is available for all live games
    // In a full implementation, we would check if the ESPN API has data for this game
    const espnAvailable = game.links?.espn !== undefined;
    result.espnAvailable = espnAvailable;
    
    if (game.links?.espn) {
      result.espnUrl = game.links.espn;
    }
    
    if (result.espnAvailable) {
      result.recommendedSource = 'espn';
    }
    
    return result;
  } catch (error) {
    console.error('Error checking data sources:', error);
    // Default to MAC if there's an error
    return result;
  }
}

/**
 * Fetch live game data from the best available source
 */
export async function fetchLiveGameData(gameId: string, game: Game, sport: string): Promise<any> {
  try {
    // First check which data sources are available
    const sourceInfo = await checkDataSources(game, sport);
    
    // Try to fetch from the recommended source
    if (sourceInfo.recommendedSource === 'sidearm' && sourceInfo.sidearmUrl) {
      try {
        const sidearmData = await fetchSidearmGameData(gameId, sourceInfo.sidearmUrl);
        return {
          ...sidearmData,
          sourceInfo
        };
      } catch (sidearmError) {
        console.error('Error fetching SIDEARM data, falling back to ESPN:', sidearmError);
        // Fall back to ESPN if SIDEARM fails
        if (sourceInfo.espnAvailable && sourceInfo.espnUrl) {
          sourceInfo.recommendedSource = 'espn';
        } else {
          throw sidearmError;
        }
      }
    }
    
    // If SIDEARM wasn't available or failed, try ESPN
    if (sourceInfo.recommendedSource === 'espn' && sourceInfo.espnUrl) {
      try {
        const espnData = await fetchESPNGameData(gameId, sourceInfo.espnUrl);
        return {
          ...espnData,
          sourceInfo
        };
      } catch (espnError) {
        console.error('Error fetching ESPN data:', espnError);
        throw espnError;
      }
    }
    
    // If we get here, no live data sources were available
    return {
      source: 'mac',
      data: null,
      timestamp: new Date().toISOString(),
      sourceInfo,
      error: 'No live data sources available'
    };
  } catch (error) {
    console.error(`Error fetching live game data for game ${gameId}:`, error);
    throw error;
  }
}

/**
 * Fetch game data from ESPN
 */
async function fetchESPNGameData(gameId: string, url: string): Promise<any> {
  try {
    const response = await axios.get(url, {
      timeout: 5000
    });
    
    if (response.status !== 200) {
      throw new Error(`ESPN API returned status ${response.status}`);
    }
    
    return {
      source: 'espn',
      data: response.data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching ESPN data for game ${gameId}:`, error);
    throw error;
  }
}

/**
 * Process game data from any source into a unified format
 */
export function processGameData(rawData: any, game: Game): Partial<Game> {
  if (!rawData) {
    return game;
  }
  
  // Process based on the source
  if (rawData.source === 'sidearm') {
    return processSidearmData(rawData, game);
  } else if (rawData.source === 'espn') {
    return processESPNData(rawData, game);
  }
  
  // Default to returning the game unchanged
  return game;
}

/**
 * Process ESPN data into our format
 */
function processESPNData(rawData: any, game: Game): Partial<Game> {
  try {
    // If we don't have actual data yet, just return game status update
    if (!rawData || !rawData.data) {
      return {
        status: game.status,
        statusDetail: 'ESPN data source ready',
        lastUpdated: new Date().toISOString()
      };
    }
    
    // Basic data extraction for score and period
    const data = rawData.data;
    
    // This is a simplified implementation; would need to be customized
    // based on the actual ESPN API data format
    let homeTeamScore = game.homeTeamScore;
    let awayTeamScore = game.awayTeamScore;
    let period = game.period;
    let clock = game.clock;
    let status: GameStatus = game.status;
    let situation = game.situation;
    
    // ESPN data would be parsed here
    if (data.competitions && data.competitions.length > 0) {
      const competition = data.competitions[0];
      
      if (competition.status && competition.status.type) {
        if (competition.status.type.state === 'in') {
          status = 'live';
        } else if (competition.status.type.state === 'post') {
          status = 'final';
        }
        
        if (competition.status.period) {
          period = competition.status.period;
        }
        
        if (competition.status.displayClock) {
          clock = competition.status.displayClock;
        }
      }
      
      if (competition.competitors) {
        for (const competitor of competition.competitors) {
          if (competitor.homeAway === 'home' && competitor.score) {
            homeTeamScore = parseInt(competitor.score);
          } else if (competitor.homeAway === 'away' && competitor.score) {
            awayTeamScore = parseInt(competitor.score);
          }
        }
      }
      
      // Extract situation if available
      if (competition.situation) {
        situation = `${competition.situation.downDistanceText || ''} ${competition.situation.possession || ''}`.trim();
      }
    }
    
    return {
      status,
      homeTeamScore,
      awayTeamScore,
      period,
      clock,
      situation,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error processing ESPN data:', error);
    return {
      status: game.status,
      statusDetail: 'Error processing ESPN data',
      lastUpdated: new Date().toISOString()
    };
  }
}