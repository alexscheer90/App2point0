import axios from 'axios';
import { log } from '../vite';
import * as cheerio from 'cheerio';
import { Game, GameStatus } from '@shared/schema';

// Map of MAC schools to their SIDEARM stats base URLs
const SIDEARM_SCHOOLS: Record<string, string> = {
  'akron': 'https://gozips.com/sidearmstats',
  'ball-state': 'https://ballstatesports.com/sidearmstats',
  'bowling-green': 'https://bgsufalcons.com/sidearmstats',
  'buffalo': 'https://ubbulls.com/sidearmstats',
  'central-michigan': 'https://cmuchippewas.com/sidearmstats',
  'eastern-michigan': 'https://emueagles.com/sidearmstats',
  'kent-state': 'https://kentstatesports.com/sidearmstats',
  'miami': 'https://miamiredhawks.com/sidearmstats',
  'northern-illinois': 'https://niuhuskies.com/sidearmstats',
  'ohio': 'https://ohiobobcats.com/sidearmstats',
  'toledo': 'https://utrockets.com/sidearmstats',
  'western-michigan': 'https://wmubroncos.com/sidearmstats',
};

// Sport-specific paths for SIDEARM
const SIDEARM_SPORT_PATHS: Record<string, string> = {
  'baseball': 'baseball/summary',
  'mens-basketball': 'mbball/summary',
  'womens-basketball': 'wbball/summary',
  'football': 'football/summary',
  'softball': 'softball/summary',
  // Add more sports as needed
};

/**
 * Check if SIDEARM stats are available for a given school and sport
 */
export async function checkSidearmAvailability(
  schoolId: string,
  sportId: string
): Promise<boolean> {
  try {
    const schoolKey = schoolId.toLowerCase();
    const sportKey = mapSportIdToSidearmKey(sportId);
    
    if (!SIDEARM_SCHOOLS[schoolKey] || !SIDEARM_SPORT_PATHS[sportKey]) {
      return false;
    }
    
    const statsUrl = `${SIDEARM_SCHOOLS[schoolKey]}/${SIDEARM_SPORT_PATHS[sportKey]}`;
    
    // Just check if the URL responds with 200 OK
    const response = await axios.head(statsUrl, { timeout: 3000 });
    return response.status === 200;
  } catch (error) {
    log(`SIDEARM availability check failed for ${schoolId}/${sportId}: ${error}`, 'sidearm');
    return false;
  }
}

/**
 * Map our internal sport IDs to SIDEARM sport keys
 */
function mapSportIdToSidearmKey(sportId: string): string {
  // This is a simplified mapping, you may need to enhance this
  const mapping: Record<string, string> = {
    'baseball': 'baseball',
    'mens-basketball': 'mens-basketball',
    'womens-basketball': 'womens-basketball',
    'football': 'football',
    'softball': 'softball',
  };
  
  return mapping[sportId] || '';
}

/**
 * Extract data from a SIDEARM statistics page
 */
export async function fetchSidearmGameData(
  schoolId: string,
  sportId: string,
  gameId?: string
): Promise<any> {
  try {
    const schoolKey = schoolId.toLowerCase();
    const sportKey = mapSportIdToSidearmKey(sportId);
    
    if (!SIDEARM_SCHOOLS[schoolKey] || !SIDEARM_SPORT_PATHS[sportKey]) {
      throw new Error('School or sport not supported by SIDEARM');
    }
    
    const statsUrl = `${SIDEARM_SCHOOLS[schoolKey]}/${SIDEARM_SPORT_PATHS[sportKey]}`;
    
    log(`Fetching SIDEARM data from ${statsUrl}`, 'sidearm');
    
    // Fetch the HTML page
    const response = await axios.get(statsUrl, { timeout: 5000 });
    const html = response.data;
    
    // Use cheerio to parse the HTML and extract the data
    const $ = cheerio.load(html);
    
    // Extract GameTracker data source URLs (typically embedded in JavaScript)
    const dataSourceUrls = findDataSourceUrls($);
    
    if (dataSourceUrls.length === 0) {
      log('No GameTracker data sources found in HTML', 'sidearm');
      return null;
    }
    
    // Fetch the first data source URL (usually JSON or XML)
    const dataResponse = await axios.get(dataSourceUrls[0], { timeout: 5000 });
    const gameData = dataResponse.data;
    
    return transformSidearmData(gameData, schoolId, sportId);
  } catch (error) {
    log(`SIDEARM data fetch failed for ${schoolId}/${sportId}: ${error}`, 'sidearm');
    return null;
  }
}

/**
 * Look for GameTracker data source URLs in the HTML
 */
function findDataSourceUrls($: cheerio.CheerioAPI): string[] {
  const urls: string[] = [];
  
  // Look for JavaScript that contains URLs to data sources
  $('script').each((index: number, script: any) => {
    const content = $(script).html() || '';
    
    // Common patterns for data source URLs in SIDEARM
    const urlPatterns = [
      /gameTrackerUrl\s*=\s*["']([^"']+)["']/i,
      /dataUrl\s*:\s*["']([^"']+)["']/i,
      /["']([^"']+GameService\.svc[^"']+)["']/i,
      /["']([^"']+\.json[^"']*)["']/i,
      /["']([^"']+\.xml[^"']*)["']/i,
    ];
    
    for (const pattern of urlPatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        urls.push(match[1]);
      }
    }
  });
  
  return urls;
}

/**
 * Transform SIDEARM data to our common format
 */
function transformSidearmData(data: any, schoolId: string, sportId: string): Partial<Game> | null {
  // This is where we'd transform the SIDEARM data to match our Game schema
  // The implementation will depend on the exact format of the SIDEARM data
  
  try {
    // We'll need to implement sport-specific transformations
    // This is a placeholder for now
    return {
      id: `sidearm-${Date.now()}`, // We'd use a more stable ID in production
      sportId,
      homeTeamId: schoolId,
      homeTeamScore: extractScore(data, 'home'),
      awayTeamScore: extractScore(data, 'away'),
      status: extractGameStatus(data),
      period: extractPeriod(data),
      clock: extractClock(data),
      situation: extractSituation(data),
      // Additional fields would be populated based on the SIDEARM data
    };
  } catch (error) {
    log(`Error transforming SIDEARM data: ${error}`, 'sidearm');
    return null;
  }
}

// Helper functions to extract specific data points from SIDEARM data
// These would need to be implemented based on the actual data format

function extractScore(data: any, team: 'home' | 'away'): number {
  // Implementation would depend on the actual data format
  return 0;
}

function extractGameStatus(data: any): GameStatus {
  // Implementation would depend on the actual data format
  return 'scheduled';
}

function extractPeriod(data: any): number | undefined {
  // Implementation would depend on the actual data format
  return undefined;
}

function extractClock(data: any): string | undefined {
  // Implementation would depend on the actual data format
  return undefined;
}

function extractSituation(data: any): string | undefined {
  // Implementation would depend on the actual data format
  return undefined;
}