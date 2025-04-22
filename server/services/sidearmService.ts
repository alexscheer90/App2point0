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
    console.log(`Fetching SIDEARM data from: ${feedUrl}`);
    
    // Check if this is a JSONP URL (contains callback parameter)
    const isJsonp = feedUrl.includes('callback=');
    
    const response = await axios.get(feedUrl, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json, text/plain, text/javascript, */*'
      },
      // Don't transform the response for JSONP
      transformResponse: isJsonp ? [(data) => data] : undefined
    });
    
    if (response.status !== 200) {
      throw new Error(`SIDEARM API returned status ${response.status}`);
    }
    
    let data = response.data;
    
    // If this is JSONP, extract the JSON from the JSONP wrapper
    if (isJsonp && typeof data === 'string') {
      console.log('Processing JSONP response for SIDEARM data');
      try {
        // For the Miami baseball specific callback
        if (feedUrl.includes('json_miamiohio_baseball_game')) {
          console.log('Processing Miami baseball JSONP callback');
          // Extract the JSON part from the JSONP response with the exact callback name
          const cleanedData = data
            .replace(/^jsonp_miamiohio_baseball_game\(/, '')
            .replace(/\);$/, '');
          
          console.log('JSONP data after cleanup (first 100 chars):', cleanedData.substring(0, 100));
          data = JSON.parse(cleanedData);
        } else {
          // Generic approach for other JSONP responses
          // Extract the JSON part from the JSONP response
          // Example format: callbackName({...json data...})
          const jsonStart = data.indexOf('(') + 1;
          const jsonEnd = data.lastIndexOf(')');
          
          if (jsonStart > 0 && jsonEnd > jsonStart) {
            const jsonStr = data.substring(jsonStart, jsonEnd);
            console.log('JSONP data after generic extraction (first 100 chars):', jsonStr.substring(0, 100));
            data = JSON.parse(jsonStr);
          } else {
            console.error('Could not extract JSON from JSONP response');
          }
        }
        
        console.log('Successfully parsed JSONP data, keys:', Object.keys(data));
      } catch (jsonError) {
        console.error('Error parsing JSONP data:', jsonError);
        console.log('JSONP response starts with:', data.substring(0, 100));
        // Continue with the raw data
      }
    }
    
    return {
      source: 'sidearm',
      data: data,
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
  try {
    // If we don't have actual data, return a basic status update
    if (!rawData) {
      return {
        status: game.status,
        statusDetail: 'SIDEARM data source ready',
        lastUpdated: new Date().toISOString()
      };
    }
    
    // Handle both formats: 
    // 1. When rawData contains a data property (from fetchSidearmGameData)
    // 2. When rawData is the data itself (direct from test endpoint)
    const data = rawData.data ? rawData.data : rawData;
    
    console.log('Processing SIDEARM data format, keys:', Object.keys(data));
    
    // Extract home and away team scores if available
    let homeTeamScore = game.homeTeamScore;
    let awayTeamScore = game.awayTeamScore;
    let period = game.period;
    let clock = game.clock;
    let situation = game.situation;
    
    // Try to detect the data format - could be standard format or S3/JSONP format
    
    // Standard format
    if (data.home && data.home.score !== undefined) {
      homeTeamScore = parseInt(data.home.score);
    }
    
    if (data.away && data.away.score !== undefined) {
      awayTeamScore = parseInt(data.away.score);
    }
    
    // S3 SIDEARM format - typically different structure
    if (data.homeScore !== undefined) {
      homeTeamScore = typeof data.homeScore === 'string' ? 
        parseInt(data.homeScore) : Number(data.homeScore);
    }
    
    if (data.visitorScore !== undefined) {
      awayTeamScore = typeof data.visitorScore === 'string' ? 
        parseInt(data.visitorScore) : Number(data.visitorScore);
    }
    
    // Try home/visitor structure (common in Miami baseball feed)
    if (data.home && data.home.score !== undefined) {
      homeTeamScore = typeof data.home.score === 'string' ?
        parseInt(data.home.score) : Number(data.home.score);
    }
    
    if (data.visitor && data.visitor.score !== undefined) {
      awayTeamScore = typeof data.visitor.score === 'string' ?
        parseInt(data.visitor.score) : Number(data.visitor.score);
    }
    
    // Miami baseball specific format (based on test endpoint)
    if (data.HomeTeam && data.HomeTeam.Score !== undefined) {
      homeTeamScore = typeof data.HomeTeam.Score === 'string' ?
        parseInt(data.HomeTeam.Score) : Number(data.HomeTeam.Score);
      console.log(`Found HomeTeam.Score: ${homeTeamScore}`);
    }
    
    if (data.VisitingTeam && data.VisitingTeam.Score !== undefined) {
      awayTeamScore = typeof data.VisitingTeam.Score === 'string' ?
        parseInt(data.VisitingTeam.Score) : Number(data.VisitingTeam.Score);
      console.log(`Found VisitingTeam.Score: ${awayTeamScore}`);
    }
    
    // Add the scores to the return object and log findings
    const statusDetail = `Miami baseball format - Home: ${homeTeamScore}, Away: ${awayTeamScore}`;
    console.log(statusDetail);
    
    // Also handle game status - if HasStarted is true and IsComplete is false, it's live
    let gameStatus = game.status;
    if (data.HasStarted === true && data.IsComplete === false) {
      console.log('Detected LIVE game from Miami feed');
      gameStatus = 'live';
    } else if (data.IsComplete === true) {
      console.log('Detected FINAL game from Miami feed');
      gameStatus = 'final';
    }
    console.log(`Game status from data: ${gameStatus}`);
    
    // Try to get period/inning/quarter information
    if (data.status && data.status.period) {
      period = data.status.period;
    } else if (data.periodNumber) {
      period = data.periodNumber;
    } else if (data.period) {
      period = data.period;
    } else if (data.inning) {
      // Baseball specific
      period = String(data.inning) + (data.inningHalf === 'top' ? 'T' : 'B');
    } else if (data.currentInning) {
      // Another baseball format
      const inningHalf = data.currentInningHalf === 0 ? 'T' : 'B';
      period = String(data.currentInning) + inningHalf;
    } 
    // Miami baseball specific format
    else if (data.Period !== undefined) {
      if (typeof data.Period === 'string') {
        // For example, "T4" for top of the 4th inning
        period = data.Period;
      } else if (typeof data.Period === 'number') {
        // Convert numeric period to a string with the appropriate format
        // For baseball, add 'T' (top) or 'B' (bottom) prefix based on context
        const half = data.Context && data.Context.toLowerCase().includes('top') ? 'T' : 'B';
        period = `${half}${data.Period}`;
      }
      console.log(`Found Period directly from Miami data: ${period}`);
    }
    
    // Try to get clock information
    if (data.status && data.status.clock) {
      clock = data.status.clock;
    } else if (data.gameClock) {
      clock = data.gameClock;
    } else if (data.timeRemaining) {
      clock = data.timeRemaining;
    }
    
    // Try to get situation information (like down & distance for football, or runners on base for baseball)
    if (data.status && data.status.situation) {
      situation = data.status.situation;
    } else if (data.situationText) {
      situation = data.situationText;
    } else if (data.down && data.distance) {
      // Football specific
      situation = `${data.down} & ${data.distance} at ${data.yardLine}`;
    } else if (data.balls !== undefined && data.strikes !== undefined) {
      // Baseball specific
      situation = `${data.balls}-${data.strikes}`;
      
      // Add outs if available
      if (data.outs !== undefined) {
        situation += `, ${data.outs} out${data.outs !== 1 ? 's' : ''}`;
      }
      
      // Add runners if available
      const bases = [];
      if (data.runnerOnFirst) bases.push('1st');
      if (data.runnerOnSecond) bases.push('2nd');
      if (data.runnerOnThird) bases.push('3rd');
      
      if (bases.length > 0) {
        situation += `, runner${bases.length > 1 ? 's' : ''} on ${bases.join(', ')}`;
      }
    }
    // Miami baseball specific format
    else if (data.Situation) {
      if (typeof data.Situation === 'object') {
        // Build a situation string from the available information
        const situationParts = [];
        
        if (data.Situation.Balls !== undefined && data.Situation.Strikes !== undefined) {
          situationParts.push(`${data.Situation.Balls}-${data.Situation.Strikes} count`);
        }
        
        if (data.Situation.Outs !== undefined) {
          situationParts.push(`${data.Situation.Outs} out${data.Situation.Outs !== 1 ? 's' : ''}`);
        }
        
        // Check for runners on base
        const bases = [];
        if (data.Situation.RunnerOnFirst) bases.push('1st');
        if (data.Situation.RunnerOnSecond) bases.push('2nd');
        if (data.Situation.RunnerOnThird) bases.push('3rd');
        
        if (bases.length > 0) {
          situationParts.push(`runner${bases.length > 1 ? 's' : ''} on ${bases.join(', ')}`);
        }
        
        situation = situationParts.join(', ');
        console.log(`Built situation from Miami data object: ${situation}`);
      } else if (typeof data.Situation === 'string') {
        situation = data.Situation;
        console.log(`Found situation directly from Miami data: ${situation}`);
      }
    }
    
    // Log what we found for debugging
    console.log(`Processed SIDEARM data: Home ${homeTeamScore}, Away ${awayTeamScore}, Period: ${period}, Clock: ${clock}, Situation: ${situation}`);
    
    return {
      status: gameStatus,
      statusDetail: 'SIDEARM data retrieved successfully',
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