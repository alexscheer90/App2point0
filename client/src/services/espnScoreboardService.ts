import axios from 'axios';
import { Game, GameStatus, School, Sport } from '@shared/schema';

// Constants
const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports';
const POLL_INTERVAL = 60000; // 1 minute in milliseconds

// Interface for ESPN API response
interface ESPNScoreboardResponse {
  events: {
    id: string;
    date: string;
    name: string;
    shortName: string;
    status: {
      type: {
        state: string;
        completed: boolean;
        description: string;
      }
    };
    competitions: {
      id: string;
      date: string;
      status: {
        type: {
          state: string;
          completed: boolean;
          description: string;
        },
        displayClock: string;
        period: number;
      };
      venue: {
        fullName: string;
      };
      competitors: {
        id: string;
        team: {
          id: string;
          location: string;
          name: string;
          abbreviation: string;
          displayName: string;
          shortDisplayName: string;
          logos?: { href: string }[];
          links?: { href: string }[];
        };
        score: string;
        homeAway: string;
        records?: {
          name: string;
          abbreviation: string;
          type: string;
          summary: string;
        }[];
      }[];
      notes?: {
        headline: string;
        description: string;
      }[];
      situation?: {
        lastPlay?: {
          text: string;
        };
        down?: number;
        yardLine?: number;
        distance?: number;
        possession?: string;
        isRedZone?: boolean;
      };
      broadcasts?: {
        market: string;
        names: string[];
      }[];
      leaders?: {
        name: string;
        displayName: string;
        leaders: {
          displayValue: string;
          athlete: {
            displayName: string;
            headshot?: string;
          };
          team: {
            abbreviation: string;
          };
        }[];
      }[];
      links?: {
        rel: string[];
        href: string;
        text: string;
        shortText: string;
        isExternal: boolean;
      }[];
    }[];
  }[];
  leagues?: {
    id: string;
    name: string;
    abbreviation: string;
    teams?: {
      team: {
        id: string;
        location: string;
        name: string;
        abbreviation: string;
        displayName: string;
      };
    }[];
  }[];
}

// Conference IDs for ESPN API
const CONFERENCE_ESPN_IDS: Record<string, string> = {
  'mid-american': '14',  // Mid-American Conference
  'america-east': '1',   // America East
  'acc': '2',            // Atlantic Coast
  'atlantic-10': '3',    // Atlantic 10
  'big-east': '4',       // Big East
  'big-sky': '5',        // Big Sky
  'big-south': '6',      // Big South
  'big-ten': '7',        // Big Ten
  'big-12': '8',         // Big 12
  'big-west': '9',       // Big West
  'coastal-athletic': '10', // Coastal Athletic (formerly Colonial)
  'conference-usa': '11',// Conference USA
  'ivy-league': '12',    // Ivy League
  'maac': '13',          // Metro Atlantic Athletic
  'meac': '16',          // Mid-Eastern Athletic
  'mvc': '18',           // Missouri Valley
  'northeast': '19',     // Northeast
  'ohio-valley': '20',   // Ohio Valley
  'patriot': '22',       // Patriot League
  'sec': '23',           // Southeastern
  'southern': '24',      // Southern
  'southland': '25',     // Southland
  'swac': '26',          // Southwestern Athletic
  'sun-belt': '27',      // Sun Belt
  'wcc': '29',           // West Coast
  'wac': '30',           // Western Athletic
  'mountain-west': '44', // Mountain West
  'horizon': '45',       // Horizon League
  'asun': '46',          // Atlantic Sun (ASUN)
  'summit': '49',        // Summit League
  'american': '62',      // American Athletic
};

// MAC Teams mapping (MAC ID to ESPN ID)
const MAC_TEAM_TO_ESPN_ID: Record<string, string> = {
  'akron': '2006', // Akron Zips
  'ballstate': '2050', // Ball State Cardinals
  'bowlinggreen': '189', // Bowling Green Falcons 
  'buffalo': '2084', // Buffalo Bulls
  'centralmichigan': '2117', // Central Michigan Chippewas
  'easternmichigan': '2199', // Eastern Michigan Eagles
  'kentstate': '2309', // Kent State Golden Flashes
  'massachusetts': '113', // UMass Minutemen (joining MAC in 2025)
  'miamioh': '193', // Miami (OH) RedHawks
  'northernillinois': '2459', // Northern Illinois Huskies
  'ohio': '195', // Ohio Bobcats
  'toledo': '2649', // Toledo Rockets
  'westernmichigan': '2711', // Western Michigan Broncos
};

// ESPN ID to MAC ID mapping (reverse of above)
const ESPN_ID_TO_MAC_TEAM: Record<string, string> = 
  Object.entries(MAC_TEAM_TO_ESPN_ID).reduce((acc, [macId, espnId]) => {
    acc[espnId] = macId;
    return acc;
  }, {} as Record<string, string>);

// Map sport IDs to ESPN format
const SPORT_TO_ESPN_PATH: Record<string, string> = {
  'football': 'football/college-football',
  'basketball': 'basketball/mens-college-basketball',
  'baseball': 'baseball/college-baseball',
  'softball': 'softball/college-softball',
  'volleyball': 'volleyball/mens-college-volleyball',
  'soccer': 'soccer/mens-college-soccer',
  'wrestling': 'mma/college-wrestling',
  'hockey': 'hockey/mens-college-hockey',
  'tennis': 'tennis/mens-college-tennis',
  'golf': 'golf/mens-college-golf',
  'track': 'track-and-field/mens-college-track-and-field'
};

// Map ESPN game status to our GameStatus
const ESPN_STATUS_TO_GAME_STATUS: Record<string, GameStatus> = {
  'pre': 'scheduled',
  'in': 'live',
  'post': 'final',
  'postponed': 'postponed',
  'canceled': 'cancelled'
};

/**
 * Service for fetching live scores from ESPN
 */
export const espnScoreboardService = {
  /**
   * Get games for today (or a specific date) for a sport
   * @param sportId The sport ID to get games for
   * @param date Optional date in YYYYMMDD format
   */
  async getLiveScores(sportId: string, date?: string): Promise<Game[]> {
    try {
      const sportPath = SPORT_TO_ESPN_PATH[sportId];
      if (!sportPath) {
        console.error(`Sport ID ${sportId} not supported for ESPN API`);
        return [];
      }

      // Build URL with date param if provided
      let url = `${ESPN_API_BASE}/${sportPath}/scoreboard`;
      if (date) {
        url += `?dates=${date}`;
      }

      console.log(`Fetching ESPN scoreboard from: ${url}`);
      const response = await axios.get<ESPNScoreboardResponse>(url);
      
      // Transform ESPN data to our Game format
      return this.transformESPNGames(response.data, sportId);
    } catch (error) {
      console.error('Error fetching ESPN scoreboard:', error);
      return [];
    }
  },

  /**
   * Get games for a specific MAC school
   * @param schoolId The MAC school ID
   * @param sportId The sport ID
   */
  async getSchoolGames(schoolId: string, sportId: string): Promise<Game[]> {
    try {
      const scores = await this.getLiveScores(sportId);
      // Filter for games involving the specified school
      return scores.filter(game => 
        game.homeTeamId === schoolId || game.awayTeamId === schoolId
      );
    } catch (error) {
      console.error(`Error fetching games for school ${schoolId}:`, error);
      return [];
    }
  },

  /**
   * Get game details for a specific game
   * @param espnGameId The ESPN game ID
   * @param sportId The sport ID
   */
  async getGameDetails(espnGameId: string, sportId: string): Promise<Game | null> {
    try {
      const sportPath = SPORT_TO_ESPN_PATH[sportId];
      if (!sportPath) {
        console.error(`Sport ID ${sportId} not supported for ESPN API`);
        return null;
      }

      const url = `${ESPN_API_BASE}/${sportPath}/summary?event=${espnGameId}`;
      const response = await axios.get(url);
      
      // TODO: Transform ESPN game summary to our Game format
      return null;
    } catch (error) {
      console.error(`Error fetching game details for ID ${espnGameId}:`, error);
      return null;
    }
  },

  /**
   * Transform ESPN API response to our Game format
   */
  transformESPNGames(data: ESPNScoreboardResponse, sportId: string): Game[] {
    if (!data.events || !Array.isArray(data.events)) {
      return [];
    }

    const macGames: Game[] = [];

    data.events.forEach(event => {
      if (!event.competitions || !event.competitions.length) return;

      const competition = event.competitions[0];
      const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
      const awayTeam = competition.competitors.find(c => c.homeAway === 'away');

      if (!homeTeam || !awayTeam) return;

      // Check if either team is a MAC team
      const homeTeamESPNId = homeTeam.team.id;
      const awayTeamESPNId = awayTeam.team.id;
      
      const homeTeamMACId = ESPN_ID_TO_MAC_TEAM[homeTeamESPNId];
      const awayTeamMACId = ESPN_ID_TO_MAC_TEAM[awayTeamESPNId];

      // Only include games that involve at least one MAC team
      if (!homeTeamMACId && !awayTeamMACId) return;

      // Map ESPN status to our GameStatus
      const espnStatus = event.status.type.state;
      const status = ESPN_STATUS_TO_GAME_STATUS[espnStatus] || 'scheduled';

      // Extract venue
      const venue = competition.venue?.fullName || '';

      // Create links object
      const links: Record<string, string> = {};
      
      // Add ESPN game URL
      if (competition.links && competition.links.length) {
        const gameLink = competition.links.find(link => 
          link.rel.includes('summary') || link.rel.includes('gamecast')
        );
        if (gameLink) {
          links.s_video = gameLink.href;
        }
      }

      // Create Game object
      const game: Game = {
        id: `espn-${event.id}`,
        sportId,
        homeTeamId: homeTeamMACId || 'non-mac',
        awayTeamId: awayTeamMACId || 'non-mac',
        homeTeamName: homeTeam.team.displayName,
        awayTeamName: awayTeam.team.displayName,
        homeTeamScore: parseInt(homeTeam.score) || 0,
        awayTeamScore: parseInt(awayTeam.score) || 0,
        startTime: new Date(event.date).toISOString(),
        scheduledTime: new Date(event.date).toISOString(),
        status,
        venue,
        location: venue, // Could be enhanced with city/state in the future
        links: Object.keys(links).length ? links : undefined,
        // Add any other relevant fields from the ESPN data
        period: competition.status?.period,
        clock: competition.status?.displayClock,
        situation: competition.situation?.lastPlay?.text || '',
      };

      macGames.push(game);
    });

    return macGames;
  },

  /**
   * Start a polling interval to fetch live scores
   * @param sportId The sport ID to get scores for
   * @param callback Function to call with updated scores
   * @returns A function to stop the polling
   */
  startLiveScoresPolling(
    sportId: string,
    callback: (games: Game[]) => void
  ): () => void {
    // Fetch immediately
    this.getLiveScores(sportId).then(callback);

    // Then start polling
    const intervalId = setInterval(async () => {
      try {
        const games = await this.getLiveScores(sportId);
        callback(games);
      } catch (error) {
        console.error('Error polling live scores:', error);
      }
    }, POLL_INTERVAL);

    // Return function to stop polling
    return () => clearInterval(intervalId);
  }
};

export default espnScoreboardService;