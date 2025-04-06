import { Game } from "@shared/schema";
import axios from "axios";
import * as cheerio from 'cheerio';
import { macSchools } from "../data/macSchools";
import { macSports } from "../data/macSports";

/**
 * Wrapper function to fetch all MAC events across sports
 * @param sportId Optional sport ID to filter events by
 * @returns Promise containing all fetched game objects
 */
export async function fetchAllMacEvents(sportId: string = 'all'): Promise<Game[]> {
  try {
    // Main URL for MAC schedule feeds
    const feedUrl = 'https://getsomemaction.com/calendar.aspx';
    
    return await fetchMacSchedule(sportId, feedUrl);
  } catch (error) {
    console.error("Error fetching all MAC events:", error);
    return [];
  }
}

/**
 * Fetches and parses MAC schedule feeds
 * @param sportId Optional sport ID to filter by
 * @param feedUrl The URL of the schedule feed
 * @returns Promise containing game items
 */
export async function fetchMacSchedule(sportId: string = 'all', feedUrl: string): Promise<Game[]> {
  try {
    console.log(`Fetching MAC schedule for sport: ${sportId} from ${feedUrl}`);
    
    // Make sure we're using https
    if (feedUrl.startsWith('http:')) {
      feedUrl = feedUrl.replace('http:', 'https:');
    }
    
    // Use our server proxy to avoid CORS issues
    const response = await axios.get(`/api/fetch-schedule?url=${encodeURIComponent(feedUrl)}`, {
      // Set a longer timeout for slower connections
      timeout: 10000,
      validateStatus: (status) => {
        // Accept only 200-299 status codes
        return status >= 200 && status < 300;
      }
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch schedule feed, status: ${response.status}`);
    }

    // Verify the received content
    const content = response.data;
    
    // Check if response is valid XML or HTML
    if (typeof content === 'string' && 
        (content.includes('<!DOCTYPE html>') || content.includes('<html'))) {
      console.warn('Received HTML instead of XML feed, cannot parse schedule data');
      return [];
    }
    
    // Parse the feed content
    return await parseScheduleFeed(content, sportId);
  } catch (error) {
    console.error(`Error fetching schedule feed:`, error);
    if (error instanceof Error) {
      console.error('Details:', error.message);
    }
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
      
      // Find all events/items in the feed
      const items = $('item');
      console.log(`Found ${items.length} events in the feed`);
      
      if (items.length === 0) {
        console.warn("No events found in feed");
        return [];
      }
      
      const games: Game[] = [];
      
      // Process each event
      items.each((i, item) => {
        try {
          const $item = $(item);
          
          const title = $item.find('title').text().trim();
          const description = $item.find('description').text().trim();
          const link = $item.find('link').text().trim();
          const pubDate = $item.find('pubDate').text().trim();
          const eventDate = pubDate ? new Date(pubDate) : new Date();
          
          // Extract team names from title 
          // Common format: "Team1 vs. Team2 • Sport (Location)"
          let eventHomeTeam = "";
          let eventAwayTeam = "";
          let eventSport = "";
          
          // Parse title to extract teams
          const vsMatch = title.match(/(.*?)\s+(?:vs\.?|at|@)\s+(.*?)(?:\s+[\•\-\|]\s+|$)/i);
          if (vsMatch && vsMatch.length >= 3) {
            if (title.includes(" at ") || title.includes(" @ ")) {
              // Format is "Away at Home"
              eventAwayTeam = vsMatch[1].trim();
              eventHomeTeam = vsMatch[2].trim();
            } else {
              // Format is "Home vs Away"
              eventHomeTeam = vsMatch[1].trim();
              eventAwayTeam = vsMatch[2].trim();
            }
          }
          
          // Extract sport type from title
          const sportMatch = title.match(/[\•\-\|]\s+(.+?)(?:\s+\(|$)/i);
          if (sportMatch && sportMatch.length >= 2) {
            eventSport = sportMatch[1].trim();
          }
          
          // Map to our internal IDs
          const homeTeamId = findSchoolId(eventHomeTeam);
          const awayTeamId = findSchoolId(eventAwayTeam);
          const mappedSportId = findSportId(eventSport) || 'other';
          
          // Filter by sport if requested
          if (sportId !== 'all' && mappedSportId !== sportId && mappedSportId !== 'other') {
            return; // Skip this item
          }
          
          // Create a unique ID for the game
          const gameId = `game-${Buffer.from(title + eventDate.toISOString()).toString('base64').substring(0, 12)}`;
          
          // Create the game object
          const game: Game = {
            id: gameId,
            sportId: mappedSportId,
            homeTeamId: homeTeamId || 'unknown',
            awayTeamId: awayTeamId || 'unknown',
            startTime: eventDate.toISOString(),
            scheduledTime: eventDate.toISOString(),
            status: isPastEvent(eventDate) ? 'final' : 'scheduled',
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
  
  // Special handling for TBD or Unknown opponents
  if (schoolName.toLowerCase() === 'tbd' || 
      schoolName.toLowerCase() === 'to be determined' ||
      schoolName.toLowerCase() === 'tba' ||
      schoolName.toLowerCase() === 'opponent tbd') {
    return 'ncaa'; // Use NCAA as a placeholder for TBD opponents
  }
  
  // Special handling for NCAA events
  if (schoolName.toLowerCase().includes('ncaa') || 
      schoolName.toLowerCase().includes('national collegiate') ||
      schoolName.toLowerCase().includes('regional') ||
      schoolName.toLowerCase().includes('nationals')) {
    return 'ncaa'; // Return NCAA ID for NCAA events
  }
  
  // Special handling for MAC Championship/Tournament games
  if (schoolName.toLowerCase().includes('mac championship') || 
      schoolName.toLowerCase().includes('mid-american conference championship') ||
      schoolName.toLowerCase().includes('mac tournament')) {
    return 'mac'; // Return special ID for MAC Championship games
  }
  
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
    'minutemen': 'umass',
    'mac': 'mac',  // MAC identifier for championship/tournament games
    'ncaa': 'ncaa'  // NCAA identifier for NCAA events
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
  // Return NCAA logo for unrecognized opponents rather than null
  return 'ncaa';
}

/**
 * Maps sport names from feed to our internal sport IDs
 */
function findSportId(sportName: string): string | null {
  if (!sportName) return null;
  
  // Normalize the name
  const normalizedName = sportName.toLowerCase().trim();
  
  // Determine if women's sport from the name
  const isWomensSport = normalizedName.includes("women") || normalizedName.includes("woman");
  
  // Direct matching against common sport name variations
  const sportMappings: Record<string, string> = {
    'football': 'football',
    'basketball': isWomensSport ? 'wbball' : 'mbball',
    'men\'s basketball': 'mbball',
    'men\'s hoops': 'mbball',
    'men basketball': 'mbball',
    'women\'s basketball': 'wbball',
    'women\'s hoops': 'wbball',
    'women basketball': 'wbball',
    'baseball': 'baseball',
    'softball': 'softball',
    'volleyball': 'wvball',
    'soccer': isWomensSport ? 'wsoc' : 'msoc',
    'men\'s soccer': 'msoc',
    'women\'s soccer': 'wsoc',
    'field hockey': 'fhockey',
    'track': isWomensSport ? 'wtrack' : 'mtrack',
    'cross country': isWomensSport ? 'wxc' : 'mxc',
    'tennis': isWomensSport ? 'wten' : 'mten',
    'swimming': isWomensSport ? 'wswim' : 'mswim',
    'wrestling': 'wrestling',
    'golf': isWomensSport ? 'wgolf' : 'mgolf',
    'gymnastics': 'gym',
    'lacrosse': 'wlax'
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