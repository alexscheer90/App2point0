import axios from 'axios';
import { School, Sport, Game } from '@shared/schema';

// Constants for ESPN API endpoints
const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports';

// Interface for ESPN API game stats response
interface ESPNGameStats {
  boxscore?: {
    teams: {
      team: {
        id: string;
        abbreviation: string;
        displayName: string;
      };
      statistics: {
        name: string;
        displayValue: string;
        label: string;
      }[];
    }[];
    players?: {
      team: {
        id: string;
      };
      statistics: {
        name: string;
        leaders: {
          displayValue: string;
          athlete: {
            displayName: string;
          };
        }[];
      }[];
    }[];
  };
  leaders?: any[];
  plays?: any[];
  scoringPlays?: any[];
  header?: {
    competitions: {
      competitors: {
        id: string;
        team: {
          abbreviation: string;
        };
        score: string;
        linescores?: {
          value: number;
        }[];
      }[];
    }[];
  };
}

// Service for fetching data from the ESPN API
export const espnApiService = {
  // Map MAC school IDs to ESPN team IDs
  schoolToESPNId: {
    'akron': '2006', // Akron Zips
    'ballstate': '2050', // Ball State Cardinals
    'bowlinggreen': '189', // Bowling Green Falcons 
    'buffalo': '2084', // Buffalo Bulls
    'centralmichigan': '2117', // Central Michigan Chippewas
    'easternmichigan': '2199', // Eastern Michigan Eagles
    'kentstate': '2309', // Kent State Golden Flashes
    'massachusetts': '113', // UMass Minutemen
    'miamioh': '193', // Miami (OH) RedHawks
    'northernillinois': '2459', // Northern Illinois Huskies
    'ohio': '195', // Ohio Bobcats
    'toledo': '2649', // Toledo Rockets
    'westernmichigan': '2711', // Western Michigan Broncos
  },

  // Map sports to their ESPN API identifiers
  sportToESPNIdentifier: {
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
  },

  /**
   * Fetch game stats from ESPN API
   * @param schoolId The school ID
   * @param sportId The sport ID
   * @param gameId The ESPN game ID
   */
  async fetchGameStats(
    school: School,
    sport: Sport,
    espnGameId: string
  ): Promise<{
    boxScore: {
      homePoints: number[];
      awayPoints: number[];
      totalHome: number;
      totalAway: number;
    };
    leaders: {
      home: {
        points?: { name: string; value: number };
        rebounds?: { name: string; value: number };
        assists?: { name: string; value: number };
      };
      away: {
        points?: { name: string; value: number };
        rebounds?: { name: string; value: number };
        assists?: { name: string; value: number };
      };
    };
    teamStats: {
      home: Record<string, number>;
      away: Record<string, number>;
    };
  } | null> {
    try {
      // ESPN expects a standard format for the game ID
      const sportEndpoint = this.sportToESPNIdentifier[sport.id as keyof typeof this.sportToESPNIdentifier];
      
      if (!sportEndpoint) {
        console.error(`Sport ID ${sport.id} not supported for ESPN API`);
        return null;
      }

      // Make the API request to ESPN
      const url = `${ESPN_API_BASE}/${sportEndpoint}/summary?event=${espnGameId}`;
      console.log(`Fetching ESPN game stats from: ${url}`);
      
      const response = await axios.get<{ gameInfo?: any, gamepackageJSON?: ESPNGameStats }>(url);
      const data = response.data.gamepackageJSON;
      
      if (!data || !data.boxscore || !data.header) {
        console.error('No game data returned from ESPN API');
        return null;
      }

      // Extract data for our format
      const homeTeam = data.header.competitions[0].competitors.find(c => c.id === this.schoolToESPNId[school.id as keyof typeof this.schoolToESPNId]);
      const awayTeam = data.header.competitions[0].competitors.find(c => c.id !== this.schoolToESPNId[school.id as keyof typeof this.schoolToESPNId]);
      
      if (!homeTeam || !awayTeam) {
        console.error('Could not identify home or away team');
        return null;
      }

      // Extract linescores (points by period)
      const homePoints = homeTeam.linescores ? homeTeam.linescores.map(ls => ls.value) : [];
      const awayPoints = awayTeam.linescores ? awayTeam.linescores.map(ls => ls.value) : [];

      // Extract team stats
      const teamStats = {
        home: {} as Record<string, number>,
        away: {} as Record<string, number>
      };

      // Map ESPN teams to our home/away format
      const homeTeamAbbr = homeTeam.team.abbreviation;
      const awayTeamAbbr = awayTeam.team.abbreviation;

      data.boxscore.teams.forEach(team => {
        const isHome = team.team.abbreviation === homeTeamAbbr;
        team.statistics.forEach(stat => {
          if (isHome) {
            teamStats.home[stat.name] = parseFloat(stat.displayValue) || 0;
          } else {
            teamStats.away[stat.name] = parseFloat(stat.displayValue) || 0;
          }
        });
      });

      // Extract leaders based on sport
      const leaders = {
        home: {} as Record<string, { name: string; value: number }>,
        away: {} as Record<string, { name: string; value: number }>
      };

      // Player leaders data varies by sport
      if (data.boxscore.players) {
        const homePlayers = data.boxscore.players.find(p => p.team.id === this.schoolToESPNId[school.id as keyof typeof this.schoolToESPNId]);
        const awayPlayers = data.boxscore.players.find(p => p.team.id !== this.schoolToESPNId[school.id as keyof typeof this.schoolToESPNId]);

        // Depending on sport, get appropriate stats
        if (homePlayers && awayPlayers) {
          // For baseball/softball
          if (sport.id === 'baseball' || sport.id === 'softball') {
            // Find RBIs, Hits, and Stolen Bases leaders
            homePlayers.statistics.forEach(stat => {
              if (stat.name === 'RBI' && stat.leaders?.[0]) {
                leaders.home.points = { 
                  name: stat.leaders[0].athlete.displayName,
                  value: parseInt(stat.leaders[0].displayValue) || 0
                };
              } else if (stat.name === 'H' && stat.leaders?.[0]) {  // Hits
                leaders.home.rebounds = { 
                  name: stat.leaders[0].athlete.displayName,
                  value: parseInt(stat.leaders[0].displayValue) || 0
                };
              } else if (stat.name === 'SB' && stat.leaders?.[0]) {  // Stolen Bases
                leaders.home.assists = { 
                  name: stat.leaders[0].athlete.displayName,
                  value: parseInt(stat.leaders[0].displayValue) || 0
                };
              }
            });
            
            awayPlayers.statistics.forEach(stat => {
              if (stat.name === 'RBI' && stat.leaders?.[0]) {
                leaders.away.points = { 
                  name: stat.leaders[0].athlete.displayName,
                  value: parseInt(stat.leaders[0].displayValue) || 0
                };
              } else if (stat.name === 'H' && stat.leaders?.[0]) {  // Hits
                leaders.away.rebounds = { 
                  name: stat.leaders[0].athlete.displayName,
                  value: parseInt(stat.leaders[0].displayValue) || 0
                };
              } else if (stat.name === 'SB' && stat.leaders?.[0]) {  // Stolen Bases
                leaders.away.assists = { 
                  name: stat.leaders[0].athlete.displayName,
                  value: parseInt(stat.leaders[0].displayValue) || 0
                };
              }
            });
          } else {
            // For basketball, use points, rebounds, assists
            homePlayers.statistics.forEach(stat => {
              if (stat.name === 'points' && stat.leaders?.[0]) {
                leaders.home.points = { 
                  name: stat.leaders[0].athlete.displayName,
                  value: parseInt(stat.leaders[0].displayValue) || 0
                };
              } else if (stat.name === 'rebounds' && stat.leaders?.[0]) {
                leaders.home.rebounds = { 
                  name: stat.leaders[0].athlete.displayName,
                  value: parseInt(stat.leaders[0].displayValue) || 0
                };
              } else if (stat.name === 'assists' && stat.leaders?.[0]) {
                leaders.home.assists = { 
                  name: stat.leaders[0].athlete.displayName,
                  value: parseInt(stat.leaders[0].displayValue) || 0
                };
              }
            });
            
            awayPlayers.statistics.forEach(stat => {
              if (stat.name === 'points' && stat.leaders?.[0]) {
                leaders.away.points = { 
                  name: stat.leaders[0].athlete.displayName,
                  value: parseInt(stat.leaders[0].displayValue) || 0
                };
              } else if (stat.name === 'rebounds' && stat.leaders?.[0]) {
                leaders.away.rebounds = { 
                  name: stat.leaders[0].athlete.displayName,
                  value: parseInt(stat.leaders[0].displayValue) || 0
                };
              } else if (stat.name === 'assists' && stat.leaders?.[0]) {
                leaders.away.assists = { 
                  name: stat.leaders[0].athlete.displayName,
                  value: parseInt(stat.leaders[0].displayValue) || 0
                };
              }
            });
          }
        }
      }

      // For fallback, if linescores aren't available
      if (homePoints.length === 0 || awayPoints.length === 0) {
        if (sport.id === 'baseball' || sport.id === 'softball') {
          const innings = sport.id === 'baseball' ? 9 : 7;
          return {
            boxScore: {
              homePoints: new Array(innings).fill(0),
              awayPoints: new Array(innings).fill(0),
              totalHome: parseInt(homeTeam.score) || 0,
              totalAway: parseInt(awayTeam.score) || 0
            },
            leaders: {
              home: leaders.home,
              away: leaders.away
            },
            teamStats
          };
        } else {
          // Basketball or other sports
          return {
            boxScore: {
              homePoints: [0, 0],
              awayPoints: [0, 0],
              totalHome: parseInt(homeTeam.score) || 0,
              totalAway: parseInt(awayTeam.score) || 0
            },
            leaders: {
              home: leaders.home,
              away: leaders.away
            },
            teamStats
          };
        }
      }

      // Return properly formatted data
      return {
        boxScore: {
          homePoints,
          awayPoints,
          totalHome: parseInt(homeTeam.score) || 0,
          totalAway: parseInt(awayTeam.score) || 0
        },
        leaders: {
          home: leaders.home,
          away: leaders.away
        },
        teamStats
      };
    } catch (error) {
      console.error('Error fetching game stats from ESPN API:', error);
      return null;
    }
  },

  /**
   * Extract ESPN game ID from a game URL or direct ID
   */
  getESPNGameId(gameUrl: string | undefined): string | null {
    if (!gameUrl) return null;
    
    try {
      if (gameUrl.includes('espn.com')) {
        // Extract ID from URL like https://espn.com/watch/player/_/id/abc123
        const match = gameUrl.match(/\/id\/([^\/]+)/);
        return match?.[1] || null;
      } else if (/^\d+$/.test(gameUrl)) {
        // If it's already just a numeric ID
        return gameUrl;
      }
    } catch (e) {
      console.error('Failed to parse ESPN game ID', e);
    }
    return null;
  },

  /**
   * Fetch a list of games for a team
   */
  async fetchTeamSchedule(schoolId: string, sportId: string): Promise<Game[]> {
    try {
      const espnTeamId = this.schoolToESPNId[schoolId as keyof typeof this.schoolToESPNId];
      const sportEndpoint = this.sportToESPNIdentifier[sportId as keyof typeof this.sportToESPNIdentifier];
      
      if (!espnTeamId || !sportEndpoint) {
        console.error(`Team ID ${schoolId} or sport ID ${sportId} not supported for ESPN API`);
        return [];
      }

      const url = `${ESPN_API_BASE}/${sportEndpoint}/teams/${espnTeamId}/schedule`;
      const response = await axios.get(url);
      
      // Transform ESPN data to our Game format
      return []; // Would transform response.data.events here
    } catch (error) {
      console.error('Error fetching team schedule:', error);
      return [];
    }
  },

  /**
   * Fetch MAC conference standings for a sport
   */
  async fetchMACStandings(sportId: string): Promise<any[]> {
    try {
      const sportEndpoint = this.sportToESPNIdentifier[sportId as keyof typeof this.sportToESPNIdentifier];
      
      if (!sportEndpoint) {
        console.error(`Sport ID ${sportId} not supported for ESPN API`);
        return [];
      }

      // MAC conference ID in ESPN is 15
      const url = `${ESPN_API_BASE}/${sportEndpoint}/standings?group=15`;
      const response = await axios.get(url);
      
      // Transform ESPN data to our standings format
      return []; // Would transform response.data.standings here
    } catch (error) {
      console.error('Error fetching MAC standings:', error);
      return [];
    }
  },

  /**
   * Fetch news for a specific MAC school
   */
  async fetchSchoolNews(schoolId: string): Promise<any[]> {
    try {
      const espnTeamId = this.schoolToESPNId[schoolId as keyof typeof this.schoolToESPNId];
      
      if (!espnTeamId) {
        console.error(`Team ID ${schoolId} not supported for ESPN API`);
        return [];
      }

      const url = `${ESPN_API_BASE}/news?team=${espnTeamId}`;
      const response = await axios.get(url);
      
      // Transform ESPN data to our news format
      return []; // Would transform response.data.articles here
    } catch (error) {
      console.error('Error fetching school news:', error);
      return [];
    }
  }
};

export default espnApiService;