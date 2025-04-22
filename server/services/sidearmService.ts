/**
 * Service for fetching and processing SIDEARM live stats data
 */
import axios from 'axios';
import { Game } from '../../shared/schema';
import { getSidearmFeedUrl, mapSchoolNameToId } from '../config/schoolFeeds';

/**
 * Check if SIDEARM stats are available for a game
 */
export async function checkSidearmAvailability(
  game: Game, 
  sport: string
): Promise<{ available: boolean; feedUrl: string | null }> {
  try {
    // Use the dedicated school database to look up the feed URL
    const homeSchoolId = mapSchoolNameToId(game.homeTeamName || '');
    
    if (!homeSchoolId) {
      console.log(`Could not map home team name to ID: ${game.homeTeamName}`);
      return { available: false, feedUrl: null };
    }
    
    // Get the feed URL for this school and sport
    const feedUrl = getSidearmFeedUrl(homeSchoolId, sport);
    
    if (!feedUrl) {
      console.log(`No SIDEARM feed URL configured for ${homeSchoolId} and sport ${sport}`);
      return { available: false, feedUrl: null };
    }
    
    // Now check if the feed is actually available
    const response = await axios.head(feedUrl, {
      timeout: 3000,
      headers: {
        'Accept': 'application/json, text/plain, */*'
      }
    });
    
    return { 
      available: response.status === 200, 
      feedUrl 
    };
  } catch (error) {
    console.log(`Error checking SIDEARM availability for ${game.homeTeamName}:`, error);
    return { available: false, feedUrl: null };
  }
}

/**
 * Fetch live stats data from SIDEARM for a specific game
 */
export async function fetchSidearmGameData(
  gameId: string,
  feedUrl: string
): Promise<any> {
  try {
    const response = await axios.get(feedUrl, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json, text/plain, */*'
      }
    });
    
    if (response.status !== 200) {
      throw new Error(`SIDEARM API returned status ${response.status}`);
    }
    
    return {
      source: 'sidearm',
      data: response.data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching SIDEARM data for game ${gameId}:`, error);
    throw error;
  }
}

/**
 * Process SIDEARM game data into a unified format
 */
export function processSidearmData(rawData: any, game: Game): Partial<Game> {
  // This will need to be customized based on the actual SIDEARM data format
  try {
    // If we don't have actual data yet, just return game status update
    if (!rawData || !rawData.data) {
      return {
        status: game.status,
        statusDetail: 'SIDEARM data source ready',
        lastUpdated: new Date().toISOString()
      };
    }
    
    // Basic data extraction for score and period
    const data = rawData.data;
    
    // Extract home and away team scores if available
    let homeTeamScore = game.homeTeamScore;
    let awayTeamScore = game.awayTeamScore;
    let period = game.period;
    let clock = game.clock;
    let situation = game.situation;
    
    // This is where we'd parse the SIDEARM data format
    // For now, we'll just use placeholder logic that would be replaced with actual parsing
    if (data.home && data.home.score !== undefined) {
      homeTeamScore = parseInt(data.home.score);
    }
    
    if (data.away && data.away.score !== undefined) {
      awayTeamScore = parseInt(data.away.score);
    }
    
    if (data.status && data.status.period) {
      period = data.status.period;
    }
    
    if (data.status && data.status.clock) {
      clock = data.status.clock;
    }
    
    if (data.status && data.status.situation) {
      situation = data.status.situation;
    }
    
    return {
      status: 'live',
      homeTeamScore,
      awayTeamScore,
      period,
      clock,
      situation,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error processing SIDEARM data:', error);
    return {
      status: game.status,
      statusDetail: 'Error processing SIDEARM data',
      lastUpdated: new Date().toISOString()
    };
  }
}