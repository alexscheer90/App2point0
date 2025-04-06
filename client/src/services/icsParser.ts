import { Game } from "@shared/schema";
import axios from "axios";
import { macSchools } from "../data/macSchools";
import { macSports } from "../data/macSports";

/**
 * Fetches and parses MAC schedule feeds using ICS format
 * @param sportId Optional sport ID to filter by
 * @param feedUrl The URL of the schedule feed in ICS format
 * @returns Promise containing game items
 */
export async function fetchMacCalendar(sportId: string = 'all'): Promise<Game[]> {
  try {
    // Use the official MAC calendar URL in ICS format
    // Use https instead of http for more reliable connections
    const icsUrl = `https://getsomemaction.com/calendar.ashx/calendar.ics?sport_id=${
      sportId === 'all' ? '0' : getMacSportId(sportId)
    }&school_id=0&schedule_id=0&_=${Date.now()}`;
    
    console.log(`Fetching MAC calendar for sport: ${sportId} from ${icsUrl}`);
    
    // Use our server proxy to avoid CORS issues
    const response = await axios.get(`/api/fetch-schedule?url=${encodeURIComponent(icsUrl)}`, {
      // Set a longer timeout for slower connections
      timeout: 10000,
      validateStatus: (status) => {
        // Accept only 200-299 status codes
        return status >= 200 && status < 300;
      }
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch calendar feed, status: ${response.status}`);
    }

    const icsContent = response.data;
    
    // Basic validation that we received a valid ICS format
    if (typeof icsContent !== 'string' || 
        (!icsContent.includes('BEGIN:VCALENDAR') && !icsContent.includes('BEGIN:VEVENT'))) {
      console.error('Invalid ICS calendar format received:', 
        typeof icsContent === 'string' ? icsContent.substring(0, 100) : typeof icsContent);
      throw new Error('Invalid calendar format received');
    }
    
    return parseCalendarEvents(icsContent, sportId);
  } catch (error) {
    console.error(`Error fetching calendar feed:`, error);
    // Return empty array but don't fail silently
    if (error instanceof Error) {
      console.error('Details:', error.message);
    }
    return [];
  }
}

/**
 * Maps our internal sport IDs to MAC website sport IDs
 */
function getMacSportId(sportId: string): string {
  const sportMap: Record<string, string> = {
    'football': '1',
    'mbball': '2',       // Men's basketball
    'wbball': '15',      // Women's basketball
    'baseball': '3',
    'softball': '10',
    'wvball': '8',       // Women's volleyball
    'msoc': '5',         // Men's soccer
    'wsoc': '16',        // Women's soccer
    'fhockey': '4',      // Field hockey
    'mtrack': '7',       // Men's track
    'wtrack': '7',       // Women's track
    'mxc': '13',         // Men's cross country
    'wxc': '13',         // Women's cross country
    'mten': '6',         // Men's tennis
    'wten': '6',         // Women's tennis
    'mswim': '11',       // Men's swimming
    'wswim': '11',       // Women's swimming
    'wrestling': '9',
    'mgolf': '12',       // Men's golf
    'wgolf': '12',       // Women's golf
    'gym': '14'          // Gymnastics
  };
  
  return sportMap[sportId] || '0';  // Default to 0 for all sports
}

/**
 * Parses ICS calendar content into structured Game objects
 */
function parseCalendarEvents(icsContent: string, sportId: string): Game[] {
  try {
    console.log("Parsing ICS calendar feed");
    
    // Split the content by the event delimiter
    const events = icsContent.split('BEGIN:VEVENT');
    
    // Skip the first segment (it's the header)
    const eventSegments = events.slice(1);
    
    console.log(`Found ${eventSegments.length} events in the calendar`);
    
    const games: Game[] = [];
    
    // Process each event
    eventSegments.forEach((eventText, index) => {
      try {
        // Find the end of the event
        const endIndex = eventText.indexOf('END:VEVENT');
        if (endIndex === -1) return;
        
        // Extract just the event part
        eventText = eventText.substring(0, endIndex);
        
        // Parse event properties
        const summary = extractProperty(eventText, 'SUMMARY');
        const description = extractProperty(eventText, 'DESCRIPTION');
        const location = extractProperty(eventText, 'LOCATION');
        const dtStart = extractProperty(eventText, 'DTSTART');
        const uid = extractProperty(eventText, 'UID');
        
        if (!summary || !dtStart) {
          console.warn(`Event ${index + 1} is missing required fields`);
          return;
        }
        
        // Parse date (format: YYYYMMDDTHHMMSSZ)
        const startTime = parseIcsDate(dtStart);
        if (!startTime) {
          console.warn(`Could not parse date: ${dtStart}`);
          return;
        }
        
        // Check if this event is within our date range (today through June 30, 2026)
        if (!isInDateRange(startTime)) {
          // Skip events outside our date range
          return;
        }
        
        // Log successful date parsing
        console.log(`Parsed date: ${startTime.toISOString()} from ${dtStart}`);
        
        // Extract teams from summary (usually in format "Team1 vs Team2")
        let homeTeam = '';
        let awayTeam = '';
        
        const vsMatch = summary.match(/(.*?)\s+(?:vs\.?|at|@)\s+(.*?)$/i);
        if (vsMatch && vsMatch.length >= 3) {
          if (summary.includes(" at ") || summary.includes(" @ ")) {
            // Format is "Away at Home"
            awayTeam = vsMatch[1].trim();
            homeTeam = vsMatch[2].trim();
          } else {
            // Format is "Home vs Away"
            homeTeam = vsMatch[1].trim();
            awayTeam = vsMatch[2].trim();
          }
        } else {
          // If we can't parse the teams, use the whole summary
          console.warn(`Could not parse teams from summary: ${summary}`);
          homeTeam = summary;
        }
        
        console.log(`Extracted teams: ${homeTeam} vs ${awayTeam}`);
        
        // Extract sport if present in description or summary
        let eventSport = '';
        
        if (description) {
          const sportMatch = description.match(/(?:sport|event):\s*([^\n\r]+)/i);
          if (sportMatch && sportMatch.length >= 2) {
            eventSport = sportMatch[1].trim();
          }
        }
        
        // If no sport in description, try to guess from the summary
        if (!eventSport) {
          for (const sport of macSports) {
            if (summary.toLowerCase().includes(sport.name.toLowerCase())) {
              eventSport = sport.name;
              break;
            }
          }
        }
        
        // Map to our internal IDs
        const homeTeamId = findSchoolId(homeTeam);
        const awayTeamId = findSchoolId(awayTeam);
        const mappedSportId = findSportId(eventSport, summary, description) || 'other';
        
        console.log(`Mapped IDs: Home=${homeTeamId}, Away=${awayTeamId}, Sport=${mappedSportId}`);
        
        // Filter by sport if requested
        if (sportId !== 'all' && sportId !== mappedSportId) {
          // Sport doesn't match, skip this item
          return;
        }
        
        // Use the UID as game ID if available, otherwise create one
        const gameId = uid || `game-${Buffer.from(summary + startTime.toISOString()).toString('base64').substring(0, 12)}`;
        
        // Create the game object
        const game: Game = {
          id: gameId,
          sportId: mappedSportId,
          homeTeamId: homeTeamId || 'unknown',
          awayTeamId: awayTeamId || 'unknown',
          startTime: startTime.toISOString(),
          scheduledTime: startTime.toISOString(),
          status: isPastEvent(startTime) ? 'final' : 'scheduled',
          venue: location || 'TBD',
        };
        
        // Store original team names for display purposes when there's no matching MAC school
        let situationText = '';
        
        if (!homeTeamId) {
          situationText = `Home: ${homeTeam}`;
        }
        
        if (!awayTeamId) {
          situationText = situationText 
            ? `${situationText} | Away: ${awayTeam}` 
            : `Away: ${awayTeam}`;
        }
        
        // Add the full description or use situation text
        if (situationText) {
          game.situation = situationText;
        } else if (description) {
          game.situation = description.substring(0, 200);
        }
        
        // Add all games regardless of MAC school status
        games.push(game);
        console.log(`Successfully parsed game: ${homeTeam} vs ${awayTeam}`);
        
      } catch (eventError) {
        console.error(`Error parsing event ${index + 1}:`, eventError);
      }
    });
    
    console.log(`Successfully parsed ${games.length} games from calendar feed`);
    return games;
    
  } catch (error) {
    console.error('Error in parseCalendarEvents function:', error);
    return [];
  }
}

/**
 * Helper to extract a property from ICS content
 */
function extractProperty(icsText: string, property: string): string {
  const regex = new RegExp(`${property}(?:;[^:]*)?:([^\r\n]+)`, 'i');
  const match = icsText.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * Convert ICS date format to JavaScript Date
 */
function parseIcsDate(icsDate: string): Date | null {
  try {
    // Handle different ICS date formats
    if (icsDate.includes('T')) {
      // Format with time (YYYYMMDDTHHMMSSZ)
      const dateStr = icsDate.replace(/[^\d]/g, '');
      const year = parseInt(dateStr.slice(0, 4));
      const month = parseInt(dateStr.slice(4, 6)) - 1; // JS months are 0-based
      const day = parseInt(dateStr.slice(6, 8));
      const hour = parseInt(dateStr.slice(8, 10));
      const minute = parseInt(dateStr.slice(10, 12));
      const second = dateStr.length >= 14 ? parseInt(dateStr.slice(12, 14)) : 0;
      
      return new Date(Date.UTC(year, month, day, hour, minute, second));
    } else {
      // Format without time (YYYYMMDD)
      const year = parseInt(icsDate.slice(0, 4));
      const month = parseInt(icsDate.slice(4, 6)) - 1;
      const day = parseInt(icsDate.slice(6, 8));
      
      return new Date(Date.UTC(year, month, day));
    }
  } catch (error) {
    console.error(`Error parsing ICS date ${icsDate}:`, error);
    return null;
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
 * Also handles detection of men's vs women's sports from summary text
 */
function findSportId(sportName: string, summary?: string, description?: string): string | null {
  if (!sportName) return null;
  
  // Normalize the name
  const normalizedName = sportName.toLowerCase().trim();
  
  // Check if we need to distinguish between men's and women's sports
  const isWomensSport = 
    (summary && summary.toLowerCase().includes('women')) || 
    (description && description.toLowerCase().includes('women'));
  
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

/**
 * Determines if an event is within our allowed date range (today through June 30, 2026)
 */
function isInDateRange(eventDate: Date): boolean {
  const now = new Date();
  const endDate = new Date(2026, 5, 30); // June 30, 2026
  return eventDate >= now && eventDate <= endDate;
}