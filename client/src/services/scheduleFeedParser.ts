import axios from 'axios';
import * as cheerio from 'cheerio';
import { Game } from '@shared/schema';
import { macSchools } from '../data/macSchools';
import { macSports } from '../data/macSports';

/**
 * Fetches and parses MAC schedule feeds
 * @param sportId Optional sport ID to filter by
 * @param feedUrl The URL of the schedule feed
 * @returns Promise containing game items
 */
export async function fetchMacSchedule(sportId: string = 'all', feedUrl: string): Promise<Game[]> {
  try {
    console.log(`Fetching MAC schedule for sport: ${sportId} from ${feedUrl}`);
    
    // Use our server proxy to avoid CORS issues
    const response = await axios.get(`/api/fetch-schedule?url=${encodeURIComponent(feedUrl)}`);
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch schedule feed, status: ${response.status}`);
    }

    const xml = response.data;
    return await parseScheduleFeed(xml, sportId);
  } catch (error) {
    console.error(`Error fetching schedule feed:`, error);
    return [];
  }
}

/**
 * Parses XML content into structured Game objects
 */
async function parseScheduleFeed(xml: string, sportId: string): Promise<Game[]> {
  try {
    console.log("Parsing XML schedule feed");
    
    // Handle cases where the response isn't valid XML
    try {
      // Check if the feed is actually HTML instead of XML
      if (xml.includes('<!DOCTYPE html>') || xml.includes('<html')) {
        console.warn("Received HTML instead of XML feed.");
        return [];
      }
      
      // Load the XML content with proper options
      const $ = cheerio.load(xml, { 
        xmlMode: true 
      });
      
      const games: Game[] = [];
      
      // Debug the XML structure
      console.log("Number of event elements:", $('item, event').length);
      
      // Find all events/games in the feed
      $('item, event').each((i, element) => {
        try {
          const el = $(element);
          
          // Extract title/summary and clean it up
          const title = el.find('title, summary').text().trim();
          if (!title) {
            console.warn("Found event without title, skipping");
            return; // Skip events without title
          }
          
          // Parse the title to extract teams and sport
          // Expected formats like "Toledo vs. Bowling Green (Football)" or "Men's Basketball: Toledo at Kent State"
          let eventHomeTeam = '';
          let eventAwayTeam = '';
          let eventSport = '';
          
          // Parse title to extract teams and sport
          const sportMatch = title.match(/\(([^)]+)\)$/);
          if (sportMatch) {
            eventSport = sportMatch[1].toLowerCase().trim();
          }
          
          // Check for standard "vs." or "at" format
          if (title.includes(' vs. ')) {
            const parts = title.split(' vs. ');
            eventHomeTeam = parts[0].trim();
            const awayPart = parts[1].split(/\s*\(/)[0].trim();
            eventAwayTeam = awayPart;
          } else if (title.includes(' at ')) {
            const parts = title.split(' at ');
            eventAwayTeam = parts[0].trim().replace(/^[^:]+:\s*/, ''); // Remove any "Sport:" prefix
            eventHomeTeam = parts[1].split(/\s*\(/)[0].trim();
          } else if (title.includes(' vs ')) {
            const parts = title.split(' vs ');
            eventHomeTeam = parts[0].trim();
            const awayPart = parts[1].split(/\s*\(/)[0].trim();
            eventAwayTeam = awayPart;
          }
          
          // Get date/time
          let startTimeStr = el.find('pubDate, published, eventDate, date').text().trim();
          if (!startTimeStr) {
            // Look for other date formats
            startTimeStr = el.find('startDate, start, eventStartDate').text().trim();
          }
          
          // Parse the start time string to a Date object
          let startTime = new Date();
          try {
            if (startTimeStr) {
              startTime = new Date(startTimeStr);
            }
          } catch (dateError) {
            console.error("Error parsing event date:", dateError);
          }
          
          // Get location/venue
          let venue = el.find('location, venue').text().trim();
          
          // Get description for additional details
          let description = el.find('description, content').text().trim();
          
          // Get link for tickets/more info
          let link = el.find('link').text().trim();
          if (!link) {
            // Try for link with href attribute
            const linkWithAttr = el.find('link[href]').attr('href');
            if (linkWithAttr) {
              link = linkWithAttr;
            }
          }
          
          // Find the actual school IDs from our data
          const homeTeamId = findSchoolId(eventHomeTeam);
          const awayTeamId = findSchoolId(eventAwayTeam);
          
          // Find the sport ID from our data
          const mappedSportId = findSportId(eventSport);
          
          // Skip if this isn't the sport we're looking for
          if (sportId !== 'all' && mappedSportId !== sportId) {
            return;
          }
          
          // Create a unique ID for the game
          const gameId = `game-${Buffer.from(title + startTime.toISOString()).toString('base64').substring(0, 12)}`;
          
          // Create the game object
          const game: Game = {
            id: gameId,
            sportId: mappedSportId || 'other',
            homeTeamId: homeTeamId || 'unknown',
            awayTeamId: awayTeamId || 'unknown',
            startTime: startTime.toISOString(),
            scheduledTime: startTime.toISOString(), // Required field for Game schema
            status: isPastEvent(startTime) ? 'final' : 'scheduled',
            venue: title, // Use the full title as venue to preserve all information
          };
          
          // Store original team names for display purposes when there's no matching MAC school
          let situationText = '';

          if (!homeTeamId) {
            situationText = `Home: ${eventHomeTeam}`;
          }
          
          if (!awayTeamId) {
            situationText = situationText 
              ? `${situationText} | Away: ${eventAwayTeam}` 
              : `Away: ${eventAwayTeam}`;
          }
          
          // Add optional fields if available
          if (link) {
            game.ticketUrl = link;
          }
          
          // If we have the original team names, use them in situation
          if (situationText) {
            game.situation = situationText;
          }
          // Otherwise, if we have description, use that
          else if (description) {
            game.situation = description.substring(0, 100);
          }
          
          // Add all games regardless of whether they are MAC schools or not
          // This ensures we display non-conference games as well
          games.push(game);
          console.log(`Successfully parsed game: ${eventHomeTeam} vs ${eventAwayTeam}`);
        } catch (itemError) {
          console.error("Error parsing individual schedule event:", itemError);
        }
      });
      
      console.log(`Successfully parsed ${games.length} games from feed`);
      return games;
    } catch (parseError) {
      console.error("Error during XML parsing:", parseError);
      return [];
    }
  } catch (error) {
    console.error('Error in parseScheduleFeed function:', error);
    return [];
  }
}

/**
 * Maps school names from feed to our internal school IDs
 */
function findSchoolId(schoolName: string): string | null {
  if (!schoolName) return null;
  
  // Normalize the name: convert to lowercase, remove common prefixes
  const normalizedName = schoolName.toLowerCase()
    .replace(/^(men's|women's|male|female)\s+/i, '')
    .replace(/\s+(basketball|football|baseball|soccer|volleyball|tennis)\s*:?\s*/i, '')
    .trim();
  
  // Direct matching against common school name variations
  const schoolMappings: Record<string, string> = {
    'toledo': 'toledo',
    'rockets': 'toledo',
    'ut': 'toledo',
    'bowling green': 'bowlinggreen',
    'falcons': 'bowlinggreen',
    'bgsu': 'bowlinggreen',
    'miami': 'miamioh',
    'miami (oh)': 'miamioh',
    'redhawks': 'miamioh',
    'ohio': 'ohio',
    'bobcats': 'ohio',
    'kent state': 'kentstate',
    'golden flashes': 'kentstate',
    'ksu': 'kentstate',
    'akron': 'akron',
    'zips': 'akron',
    'ball state': 'ballstate',
    'cardinals': 'ballstate',
    'bsu': 'ballstate',
    'buffalo': 'buffalo',
    'bulls': 'buffalo',
    'ub': 'buffalo',
    'central michigan': 'centralmichigan',
    'chippewas': 'centralmichigan',
    'cmu': 'centralmichigan',
    'eastern michigan': 'easternmichigan',
    'eagles': 'easternmichigan',
    'emu': 'easternmichigan',
    'western michigan': 'westernmichigan',
    'broncos': 'westernmichigan',
    'wmu': 'westernmichigan',
    'northern illinois': 'northernillinois',
    'huskies': 'northernillinois',
    'niu': 'northernillinois',
    'massachusetts': 'umass',
    'umass': 'umass',
    'minutemen': 'umass'
  };
  
  // Check for direct match first
  if (schoolMappings[normalizedName]) {
    return schoolMappings[normalizedName];
  }
  
  // If no direct match, try to find a partial match
  for (const [key, id] of Object.entries(schoolMappings)) {
    if (normalizedName.includes(key)) {
      return id;
    }
  }
  
  // If no matches found, try matching against our school data
  for (const school of macSchools) {
    if (normalizedName.includes(school.name.toLowerCase()) || 
        normalizedName.includes(school.shortName.toLowerCase()) ||
        (school.mascot && normalizedName.includes(school.mascot.toLowerCase()))) {
      return school.id;
    }
  }
  
  console.warn(`Could not find school ID for: ${schoolName}`);
  return null;
}

/**
 * Maps sport names from feed to our internal sport IDs
 */
function findSportId(sportName: string): string | null {
  if (!sportName) return null;
  
  // Normalize the name
  const normalizedName = sportName.toLowerCase().trim();
  
  // Direct matching against common sport name variations
  const sportMappings: Record<string, string> = {
    'football': 'football',
    'basketball': 'basketball',
    'men\'s basketball': 'basketball',
    'men\'s hoops': 'basketball',
    'men basketball': 'basketball',
    'women\'s basketball': 'wbasketball',
    'women\'s hoops': 'wbasketball',
    'women basketball': 'wbasketball',
    'baseball': 'baseball',
    'softball': 'softball',
    'volleyball': 'volleyball',
    'soccer': 'soccer',
    'men\'s soccer': 'soccer',
    'women\'s soccer': 'wsoccer',
    'field hockey': 'fieldhockey',
    'track': 'track',
    'cross country': 'crosscountry',
    'tennis': 'tennis',
    'swimming': 'swimming',
    'wrestling': 'wrestling',
    'golf': 'golf'
  };
  
  // Check for direct match first
  if (sportMappings[normalizedName]) {
    return sportMappings[normalizedName];
  }
  
  // If no direct match, try to find a partial match
  for (const [key, id] of Object.entries(sportMappings)) {
    if (normalizedName.includes(key)) {
      return id;
    }
  }
  
  // If no matches found, try matching against our sport data
  for (const sport of macSports) {
    if (normalizedName.includes(sport.name.toLowerCase())) {
      return sport.id;
    }
  }
  
  console.warn(`Could not find sport ID for: ${sportName}`);
  return 'other';
}

/**
 * Determines if an event is in the past
 */
function isPastEvent(eventDate: Date): boolean {
  const now = new Date();
  return eventDate < now;
}

/**
 * Schedule feed URLs for different MAC sports
 */
export const scheduleFeedUrls: Record<string, string> = {
  'general': 'https://getsomemaction.com/services/responsive-calendar-subscription.ashx/calendar.rss?sport_id=0&school_id=0&schedule_id=0',
  'football': 'https://getsomemaction.com/services/responsive-calendar-subscription.ashx/calendar.rss?sport_id=1&school_id=0&schedule_id=0',
  'basketball': 'https://getsomemaction.com/services/responsive-calendar-subscription.ashx/calendar.rss?sport_id=2&school_id=0&schedule_id=0',
  'baseball': 'https://getsomemaction.com/services/responsive-calendar-subscription.ashx/calendar.rss?sport_id=3&school_id=0&schedule_id=0'
  // Can add more sport-specific feeds as they become available
};

/**
 * Fetches all available MAC events
 */
export async function fetchAllMacEvents(sportId: string = 'all'): Promise<Game[]> {
  const feedUrl = sportId !== 'all' && scheduleFeedUrls[sportId] 
    ? scheduleFeedUrls[sportId] 
    : scheduleFeedUrls.general;
    
  return await fetchMacSchedule(sportId, feedUrl);
}