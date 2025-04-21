import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Service to scrape and parse Toledo baseball live stats from their SideArm system
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
 * Scrapes the Toledo SideArm stats page for baseball games
 */
export async function scrapeToledoBaseballStats(gameId?: string): Promise<ToledoBaseballStats | null> {
  try {
    console.log('Scraping Toledo baseball stats from SideArm platform');
    
    // Use the provided URL for live stats
    const url = 'https://utrockets.com/sidearmstats/baseball/summary';
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mobile-MACtion-App/1.0'
      }
    });
    
    if (response.status !== 200) {
      console.error(`Failed to fetch Toledo stats, status: ${response.status}`);
      return null;
    }
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract game information
    const gameInfo = parseGameInfo($);
    
    // Extract batting stats
    const battingStats = parseBattingStats($);
    
    // Extract pitching stats
    const pitchingStats = parsePitchingStats($);
    
    // Extract score by inning
    const scoreByInning = parseScoreByInning($);
    
    // Extract play-by-play if available
    const plays = parsePlayByPlay($);
    
    return {
      gameInfo,
      battingStats,
      pitchingStats,
      scoreByInning,
      plays
    };
    
  } catch (error) {
    console.error('Error scraping Toledo baseball stats:', error);
    return null;
  }
}

/**
 * Parse game information from the HTML
 */
function parseGameInfo($: cheerio.CheerioAPI): GameInfo {
  // Default values
  const gameInfo: GameInfo = {
    homeTeam: 'Toledo',
    awayTeam: '',
    homeScore: 0,
    awayScore: 0,
    gameStatus: 'Unknown',
    inning: '',
    location: '',
    date: ''
  };
  
  try {
    // Try to extract teams and score from the scoreboard
    const scoreboardTitle = $('.contest-info').text().trim();
    const teamsRegex = /(.*?) vs\. (.*?)(?: at|$)/;
    const teamsMatch = scoreboardTitle.match(teamsRegex);
    
    if (teamsMatch) {
      gameInfo.awayTeam = teamsMatch[1].trim();
      gameInfo.homeTeam = teamsMatch[2].trim();
    }
    
    // Extract location and date
    $('.contest-info-item').each((i, el) => {
      const text = $(el).text().trim();
      
      if (text.includes('Location:')) {
        gameInfo.location = text.replace('Location:', '').trim();
      } else if (text.includes('Date:')) {
        gameInfo.date = text.replace('Date:', '').trim();
      } else if (text.includes('Attendance:')) {
        const attendance = text.replace('Attendance:', '').trim();
        gameInfo.attendance = parseInt(attendance.replace(/,/g, ''));
      } else if (text.includes('Weather:')) {
        gameInfo.weather = text.replace('Weather:', '').trim();
      }
    });
    
    // Extract current score
    const scoreElements = $('.team-score');
    if (scoreElements.length >= 2) {
      gameInfo.awayScore = parseInt($(scoreElements[0]).text().trim()) || 0;
      gameInfo.homeScore = parseInt($(scoreElements[1]).text().trim()) || 0;
    }
    
    // Extract game status and inning
    const gameStatusText = $('.period').text().trim();
    if (gameStatusText) {
      if (gameStatusText.toLowerCase().includes('final')) {
        gameInfo.gameStatus = 'Final';
      } else if (gameStatusText.toLowerCase().includes('top')) {
        gameInfo.gameStatus = 'In Progress';
        gameInfo.inning = gameStatusText;
      } else if (gameStatusText.toLowerCase().includes('bottom')) {
        gameInfo.gameStatus = 'In Progress';
        gameInfo.inning = gameStatusText;
      } else if (gameStatusText.toLowerCase().includes('mid')) {
        gameInfo.gameStatus = 'In Progress';
        gameInfo.inning = gameStatusText;
      } else if (gameStatusText.toLowerCase().includes('end')) {
        gameInfo.gameStatus = 'In Progress';
        gameInfo.inning = gameStatusText;
      } else if (gameStatusText.toLowerCase().includes('delay')) {
        gameInfo.gameStatus = 'Delayed';
      } else {
        gameInfo.gameStatus = gameStatusText;
      }
    }
    
  } catch (error) {
    console.error('Error parsing game info:', error);
  }
  
  return gameInfo;
}

/**
 * Parse batting statistics from the HTML
 */
function parseBattingStats($: cheerio.CheerioAPI): BattingStats[] {
  const battingStats: BattingStats[] = [];
  
  try {
    $('.team-batting-stats').each((teamIndex, teamElement) => {
      const teamName = $(teamElement).find('.team-name').text().trim();
      
      const players: BattingPlayer[] = [];
      
      $(teamElement).find('tbody tr').each((i, row) => {
        if (!$(row).hasClass('team-total')) {
          const cols = $(row).find('td');
          
          if (cols.length >= 5) {
            const player: BattingPlayer = {
              name: $(cols[0]).text().trim(),
              position: $(cols[1]).text().trim(),
              atBats: parseInt($(cols[2]).text().trim()) || 0,
              runs: parseInt($(cols[3]).text().trim()) || 0,
              hits: parseInt($(cols[4]).text().trim()) || 0,
              rbi: parseInt($(cols[5]).text().trim()) || 0,
              avg: $(cols[cols.length - 1]).text().trim()
            };
            
            // Add optional stats if available
            if (cols.length > 6) {
              player.doubles = parseInt($(cols[6]).text().trim()) || 0;
            }
            if (cols.length > 7) {
              player.triples = parseInt($(cols[7]).text().trim()) || 0;
            }
            if (cols.length > 8) {
              player.homeRuns = parseInt($(cols[8]).text().trim()) || 0;
            }
            if (cols.length > 9) {
              player.walks = parseInt($(cols[9]).text().trim()) || 0;
            }
            if (cols.length > 10) {
              player.strikeouts = parseInt($(cols[10]).text().trim()) || 0;
            }
            
            players.push(player);
          }
        }
      });
      
      // Parse team totals
      const totalRow = $(teamElement).find('tr.team-total');
      const totalCols = totalRow.find('td');
      
      const teamTotals: TeamBattingTotals = {
        atBats: parseInt($(totalCols[1]).text().trim()) || 0,
        runs: parseInt($(totalCols[2]).text().trim()) || 0,
        hits: parseInt($(totalCols[3]).text().trim()) || 0,
        rbi: parseInt($(totalCols[4]).text().trim()) || 0
      };
      
      // Add optional team totals if available
      if (totalCols.length > 5) {
        teamTotals.doubles = parseInt($(totalCols[5]).text().trim()) || 0;
      }
      if (totalCols.length > 6) {
        teamTotals.triples = parseInt($(totalCols[6]).text().trim()) || 0;
      }
      if (totalCols.length > 7) {
        teamTotals.homeRuns = parseInt($(totalCols[7]).text().trim()) || 0;
      }
      if (totalCols.length > 8) {
        teamTotals.walks = parseInt($(totalCols[8]).text().trim()) || 0;
      }
      if (totalCols.length > 9) {
        teamTotals.strikeouts = parseInt($(totalCols[9]).text().trim()) || 0;
      }
      
      battingStats.push({
        teamName,
        players,
        teamTotals
      });
    });
    
  } catch (error) {
    console.error('Error parsing batting stats:', error);
  }
  
  return battingStats;
}

/**
 * Parse pitching statistics from the HTML
 */
function parsePitchingStats($: cheerio.CheerioAPI): PitchingStats[] {
  const pitchingStats: PitchingStats[] = [];
  
  try {
    $('.team-pitching-stats').each((teamIndex, teamElement) => {
      const teamName = $(teamElement).find('.team-name').text().trim();
      
      const players: PitchingPlayer[] = [];
      
      $(teamElement).find('tbody tr').each((i, row) => {
        const cols = $(row).find('td');
        
        if (cols.length >= 7) {
          const player: PitchingPlayer = {
            name: $(cols[0]).text().trim(),
            innings: $(cols[1]).text().trim(),
            hits: parseInt($(cols[2]).text().trim()) || 0,
            runs: parseInt($(cols[3]).text().trim()) || 0,
            earnedRuns: parseInt($(cols[4]).text().trim()) || 0,
            walks: parseInt($(cols[5]).text().trim()) || 0,
            strikeouts: parseInt($(cols[6]).text().trim()) || 0,
            era: $(cols[cols.length - 1]).text().trim(),
            win: $(row).text().includes('(W)'),
            loss: $(row).text().includes('(L)'),
            save: $(row).text().includes('(S)')
          };
          
          // Add pitch count if available
          if (cols.length > 7) {
            player.pitchCount = parseInt($(cols[7]).text().trim()) || 0;
          }
          
          players.push(player);
        }
      });
      
      pitchingStats.push({
        teamName,
        players
      });
    });
    
  } catch (error) {
    console.error('Error parsing pitching stats:', error);
  }
  
  return pitchingStats;
}

/**
 * Parse score by inning from the HTML
 */
function parseScoreByInning($: cheerio.CheerioAPI): ScoreByInning[] {
  const scoreByInning: ScoreByInning[] = [];
  
  try {
    $('.linescore-table tbody tr').each((i, row) => {
      const teamName = $(row).find('td:first-child').text().trim();
      const innings: number[] = [];
      
      // Get all inning scores except last 3 columns (R, H, E)
      $(row).find('td').slice(1, -3).each((j, col) => {
        innings.push(parseInt($(col).text().trim()) || 0);
      });
      
      // Get R, H, E totals from the last 3 columns
      const runs = parseInt($(row).find('td').eq(-3).text().trim()) || 0;
      const hits = parseInt($(row).find('td').eq(-2).text().trim()) || 0;
      const errors = parseInt($(row).find('td').eq(-1).text().trim()) || 0;
      
      scoreByInning.push({
        teamName,
        innings,
        runs,
        hits,
        errors
      });
    });
    
  } catch (error) {
    console.error('Error parsing score by inning:', error);
  }
  
  return scoreByInning;
}

/**
 * Parse play-by-play data from the HTML
 */
function parsePlayByPlay($: cheerio.CheerioAPI): GamePlay[] {
  const plays: GamePlay[] = [];
  
  try {
    $('.play-by-play-container .inning-container').each((i, inningElement) => {
      const inningHeader = $(inningElement).find('.inning-header').text().trim();
      
      $(inningElement).find('.play-item').each((j, playItem) => {
        const description = $(playItem).find('.play-description').text().trim();
        const scoreText = $(playItem).find('.play-score').text().trim();
        
        plays.push({
          inning: inningHeader,
          description,
          score: scoreText || undefined
        });
      });
    });
    
  } catch (error) {
    console.error('Error parsing play-by-play:', error);
  }
  
  return plays;
}

export default {
  scrapeToledoBaseballStats
};