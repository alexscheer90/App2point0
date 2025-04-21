import axios from 'axios';

/**
 * Service for fetching Toledo SideArm baseball statistics
 */

interface ToledoBaseballStats {
  gameInfo: GameInfo;
  battingStats: BattingStats[];
  pitchingStats: PitchingStats[];
  scoreByInning: ScoreByInning[];
  plays: GamePlay[];
}

interface GameInfo {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  gameStatus: string;
  inning: string;
  location: string;
  date: string;
  attendance?: number;
  weather?: string;
}

interface BattingStats {
  teamName: string;
  players: BattingPlayer[];
  teamTotals: TeamBattingTotals;
}

interface BattingPlayer {
  name: string;
  position: string;
  atBats: number;
  runs: number;
  hits: number;
  rbi: number;
  doubles?: number;
  triples?: number;
  homeRuns?: number;
  walks?: number;
  strikeouts?: number;
  avg: string;
  obp?: string;
  slg?: string;
}

interface TeamBattingTotals {
  atBats: number;
  runs: number;
  hits: number;
  rbi: number;
  doubles?: number;
  triples?: number;
  homeRuns?: number;
  walks?: number;
  strikeouts?: number;
}

interface PitchingStats {
  teamName: string;
  players: PitchingPlayer[];
}

interface PitchingPlayer {
  name: string;
  innings: string;
  hits: number;
  runs: number;
  earnedRuns: number;
  walks: number;
  strikeouts: number;
  pitchCount?: number;
  era: string;
  win?: boolean;
  loss?: boolean;
  save?: boolean;
}

interface ScoreByInning {
  teamName: string;
  innings: number[];
  runs: number;
  hits: number;
  errors: number;
}

interface GamePlay {
  inning: string;
  description: string;
  score?: string;
}

/**
 * Fetch Toledo baseball stats from our API
 */
const fetchToledoBaseballStats = async (gameId?: string): Promise<ToledoBaseballStats | null> => {
  try {
    console.log('Fetching Toledo baseball stats');
    const url = `/api/toledo/baseball/stats${gameId ? `?gameId=${gameId}` : ''}`;
    
    const response = await axios.get(url);
    
    if (response.status === 200 && response.data.success) {
      console.log('Successfully fetched Toledo baseball stats');
      return response.data.data;
    } else {
      console.error('Failed to fetch Toledo baseball stats:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching Toledo baseball stats:', error);
    return null;
  }
};

/**
 * Check if Toledo baseball stats are available
 */
const checkToledoBaseballStatsAvailability = async (): Promise<boolean> => {
  try {
    const response = await axios.get('/api/toledo/baseball/check');
    
    if (response.status === 200 && response.data.success) {
      return response.data.available;
    } 
    
    return false;
  } catch (error) {
    console.error('Error checking Toledo baseball stats availability:', error);
    return false;
  }
};

/**
 * Convert Toledo baseball stats to GameStats format for our app
 */
const convertToledoStatsToGameStats = (toledoStats: ToledoBaseballStats): any => {
  // Extract the score by inning for home and away teams
  const homeScoreByInning = toledoStats.scoreByInning.find(s => 
    s.teamName.toLowerCase().includes('toledo'))?.innings || [];
  
  const awayScoreByInning = toledoStats.scoreByInning.find(s => 
    !s.teamName.toLowerCase().includes('toledo'))?.innings || [];
  
  // Extract team totals for both teams
  const homeBattingStats = toledoStats.battingStats.find(s => 
    s.teamName.toLowerCase().includes('toledo'));
  
  const awayBattingStats = toledoStats.battingStats.find(s => 
    !s.teamName.toLowerCase().includes('toledo'));
  
  // Find the best hitters
  const findBestHitter = (stats?: BattingStats) => {
    if (!stats || !stats.players || stats.players.length === 0) {
      return { name: 'N/A', value: 0 };
    }
    
    // Sort by hits
    const sortedByHits = [...stats.players].sort((a, b) => b.hits - a.hits);
    return { 
      name: sortedByHits[0].name.split(' ').pop() || 'N/A', // Last name only
      value: sortedByHits[0].hits 
    };
  };
  
  // Find best RBI producer
  const findBestRBI = (stats?: BattingStats) => {
    if (!stats || !stats.players || stats.players.length === 0) {
      return { name: 'N/A', value: 0 };
    }
    
    // Sort by RBI
    const sortedByRBI = [...stats.players].sort((a, b) => b.rbi - a.rbi);
    return { 
      name: sortedByRBI[0].name.split(' ').pop() || 'N/A', // Last name only
      value: sortedByRBI[0].rbi 
    };
  };
  
  // Check for any stolen bases info (not always available)
  const findBaseStealer = (stats?: BattingStats) => {
    return { name: 'N/A', value: 0 }; // This data is not typically in the basic stats view
  };
  
  return {
    boxScore: {
      homePoints: homeScoreByInning,
      awayPoints: awayScoreByInning,
      totalHome: toledoStats.gameInfo.homeScore,
      totalAway: toledoStats.gameInfo.awayScore
    },
    leaders: {
      home: {
        points: findBestRBI(homeBattingStats), // RBIs
        rebounds: findBestHitter(homeBattingStats), // Hits
        assists: findBaseStealer(homeBattingStats) // Stolen bases
      },
      away: {
        points: findBestRBI(awayBattingStats), // RBIs
        rebounds: findBestHitter(awayBattingStats), // Hits
        assists: findBaseStealer(awayBattingStats) // Stolen bases
      }
    },
    teamStats: {
      home: {
        "Hits": homeBattingStats?.teamTotals.hits || 0,
        "Errors": toledoStats.scoreByInning.find(s => s.teamName.toLowerCase().includes('toledo'))?.errors || 0,
        "LOB": 0, // Not directly available in the scraped data
        "RBI": homeBattingStats?.teamTotals.rbi || 0,
        "2B": homeBattingStats?.teamTotals.doubles || 0,
        "3B": homeBattingStats?.teamTotals.triples || 0,
        "HR": homeBattingStats?.teamTotals.homeRuns || 0
      },
      away: {
        "Hits": awayBattingStats?.teamTotals.hits || 0,
        "Errors": toledoStats.scoreByInning.find(s => !s.teamName.toLowerCase().includes('toledo'))?.errors || 0,
        "LOB": 0, // Not directly available in the scraped data
        "RBI": awayBattingStats?.teamTotals.rbi || 0,
        "2B": awayBattingStats?.teamTotals.doubles || 0,
        "3B": awayBattingStats?.teamTotals.triples || 0,
        "HR": awayBattingStats?.teamTotals.homeRuns || 0
      }
    },
    // Add play-by-play data for optional display
    plays: toledoStats.plays
  };
};

export default {
  fetchToledoBaseballStats,
  checkToledoBaseballStatsAvailability,
  convertToledoStatsToGameStats
};