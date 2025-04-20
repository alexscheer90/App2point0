import axios from 'axios';
import * as cheerio from 'cheerio';
import { Game } from '@shared/schema';
import { dataImporter } from './dataImporter';

/**
 * MAC Service
 * Dedicated service for retrieving and parsing MAC calendar and score data
 */
export class MacService {
  private dataImporter = dataImporter;
  
  /**
   * Fetches the MAC games calendar with all events including lacrosse, tennis, etc.
   * with final scores for completed games
   */
  async fetchMacEvents(date?: string): Promise<Partial<Game>[]> {
    try {
      // First, get the basic calendar data from our existing MAC feed importer
      const macCalendarUrl = "https://getsomemaction.com/services/responsive-calendar-subscription.ashx/calendar.rss?sport_id=0&school_id=0&schedule_id=0";
      const calendarGames = await this.dataImporter.importMacCalendar(macCalendarUrl);
      
      // For each game marked as 'final', try to fetch the actual score from the MAC website
      // This ensures we get the most up-to-date scores for all completed games
      const enhancedGames = await this.enrichWithFinalScores(calendarGames);
      
      // For today's date or the specified date, additionally fetch the scores page
      // to ensure we don't miss any games not in the calendar feed
      if (date) {
        const additionalGames = await this.fetchMacScoresByDate(date);
        
        // Merge additional games with our calendar games
        // We'll use the game ID to avoid duplicates
        const gameMap = new Map<string, Partial<Game>>();
        
        // First add all calendar games
        enhancedGames.forEach(game => {
          // Create a unique key based on teams and date
          const gameDate = new Date(game.startTime || '');
          const dateStr = gameDate.toISOString().split('T')[0];
          const key = `${dateStr}_${game.homeTeamId || game.homeTeamName}_${game.awayTeamId || game.awayTeamName}`;
          gameMap.set(key, game);
        });
        
        // Then add additional games (will overwrite existing ones with same key)
        additionalGames.forEach(game => {
          // Create a unique key based on teams and date
          const gameDate = new Date(game.startTime || '');
          const dateStr = gameDate.toISOString().split('T')[0];
          const key = `${dateStr}_${game.homeTeamId || game.homeTeamName}_${game.awayTeamId || game.awayTeamName}`;
          
          // If we already have this game from the calendar, merge the data
          // prioritizing score data from the scores page
          if (gameMap.has(key)) {
            const existingGame = gameMap.get(key)!;
            gameMap.set(key, {
              ...existingGame,
              homeTeamScore: game.homeTeamScore || existingGame.homeTeamScore,
              awayTeamScore: game.awayTeamScore || existingGame.awayTeamScore,
              status: game.status || existingGame.status,
              // Always use score page links if available
              links: {
                ...existingGame.links,
                ...game.links
              }
            });
          } else {
            // This is a new game not in the calendar
            gameMap.set(key, game);
          }
        });
        
        // Convert the map back to an array
        return Array.from(gameMap.values());
      }
      
      return enhancedGames;
    } catch (error) {
      console.error('Error fetching MAC events:', error);
      return [];
    }
  }
  
  /**
   * Takes games from the MAC calendar and adds final scores by checking the MAC website
   */
  private async enrichWithFinalScores(games: Partial<Game>[]): Promise<Partial<Game>[]> {
    const result: Partial<Game>[] = [];
    
    for (const game of games) {
      // Only process 'final' games
      if (game.status === 'final') {
        try {
          // Generate a MAC box score URL based on the game details
          const gameDate = new Date(game.startTime || '');
          const dateStr = gameDate.toISOString().split('T')[0].replace(/-/g, '');
          
          // Try to find the box score on the MAC website
          const sportId = this.normalizeMacSportId(game.sportId || '');
          const boxScoreUrl = `https://getsomemaction.com/boxscore.aspx?path=${sportId}&game=${dateStr}_${game.homeTeamId}_${game.awayTeamId}`;
          
          // Query the box score page
          const scores = await this.fetchScoreFromBoxScore(boxScoreUrl);
          
          if (scores) {
            // Update with the actual final score
            result.push({
              ...game,
              homeTeamScore: scores.homeScore,
              awayTeamScore: scores.awayScore,
              links: {
                ...game.links,
                s_boxscore: boxScoreUrl
              }
            });
            continue; // Skip to next game
          }
        } catch (err) {
          console.warn(`Error fetching score for game ${game.homeTeamName} vs ${game.awayTeamName}:`, err);
          // Continue with original game data
        }
      }
      
      // If we didn't update the game with scores, add it as-is
      result.push(game);
    }
    
    return result;
  }
  
  /**
   * Fetches scores for a specific date from the MAC website's scores page
   */
  private async fetchMacScoresByDate(dateStr: string): Promise<Partial<Game>[]> {
    try {
      // Parse the date
      const date = new Date(dateStr);
      const formattedDate = date.toISOString().split('T')[0];
      
      // Format for MAC website URL (MM/DD/YYYY)
      const macDateFormat = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      
      // Fetch the scores page for this date
      const url = `https://getsomemaction.com/calendar.aspx?day=${macDateFormat}`;
      
      console.log(`Fetching MAC scores for ${formattedDate} from ${url}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mobile-MACtion-App/1.0'
        }
      });
      
      const $ = cheerio.load(response.data);
      const games: Partial<Game>[] = [];
      
      // Find all game containers on the page
      $('.event-container').each((_, eventContainer) => {
        try {
          // Extract sport
          const sportText = $(eventContainer).find('.sport-description').text().trim();
          const sportId = this.normalizeMacSportId(sportText);
          
          // Extract teams and score
          const homeTeamName = $(eventContainer).find('.team-name.home').text().trim();
          const awayTeamName = $(eventContainer).find('.team-name.away').text().trim();
          
          const homeTeamScore = parseInt($(eventContainer).find('.team-score.home').text().trim()) || 0;
          const awayTeamScore = parseInt($(eventContainer).find('.team-score.away').text().trim()) || 0;
          
          // Extract game status
          let status: 'scheduled' | 'live' | 'final' = 'scheduled';
          const statusText = $(eventContainer).find('.game-status').text().trim().toLowerCase();
          
          if (statusText.includes('final')) {
            status = 'final';
          } else if (statusText.includes('live') || statusText.includes('in progress')) {
            status = 'live';
          }
          
          // Extract location
          const locationText = $(eventContainer).find('.game-location').text().trim();
          
          // Extract links
          let boxScoreUrl = '';
          const linkElements = $(eventContainer).find('a');
          linkElements.each((_, link) => {
            const href = $(link).attr('href') || '';
            const text = $(link).text().trim().toLowerCase();
            
            if (text.includes('box score') || href.includes('boxscore')) {
              boxScoreUrl = href.startsWith('http') ? href : `https://getsomemaction.com${href}`;
            }
          });
          
          // Convert team names to IDs based on our known schools
          const homeTeamId = this.dataImporter.getSchoolIdFromName(homeTeamName);
          const awayTeamId = this.dataImporter.getSchoolIdFromName(awayTeamName);
          
          games.push({
            id: `mac-scores-${Date.now()}-${games.length}`,
            sportId,
            homeTeamId,
            awayTeamId,
            homeTeamName,
            awayTeamName,
            homeTeamScore,
            awayTeamScore,
            status,
            venue: locationText,
            location: locationText,
            startTime: date.toISOString(),
            scheduledTime: date.toISOString(),
            links: {
              s_boxscore: boxScoreUrl
            }
          });
        } catch (err) {
          console.warn('Error parsing MAC score event:', err);
        }
      });
      
      console.log(`Found ${games.length} games from MAC scores page for ${formattedDate}`);
      return games;
    } catch (error) {
      console.error('Error fetching MAC scores by date:', error);
      return [];
    }
  }
  
  /**
   * Fetches the score from a MAC box score page
   */
  private async fetchScoreFromBoxScore(url: string): Promise<{ homeScore: number, awayScore: number } | null> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mobile-MACtion-App/1.0'
        }
      });
      
      const $ = cheerio.load(response.data);
      
      // Look for the score banner
      const homeScore = parseInt($('.team-score.home').text().trim()) || 0;
      const awayScore = parseInt($('.team-score.away').text().trim()) || 0;
      
      if (homeScore > 0 || awayScore > 0) {
        return { homeScore, awayScore };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching box score:', error);
      return null;
    }
  }
  
  /**
   * Normalizes a sport ID for use in MAC URLs
   */
  private normalizeMacSportId(sportId: string): string {
    // Convert sport names to paths used in MAC URLs
    const sportMap: Record<string, string> = {
      'football': 'football',
      'basketball': 'mbball',
      "men's basketball": 'mbball',
      "women's basketball": 'wbball',
      'baseball': 'baseball',
      'softball': 'softball',
      'volleyball': 'wvball',
      'soccer': 'msoc',
      "men's soccer": 'msoc',
      "women's soccer": 'wsoc',
      'wrestling': 'wrestling',
      'tennis': 'mten',
      "men's tennis": 'mten',
      "women's tennis": 'wten',
      'mtennis': 'mten',
      'wtennis': 'wten',
      'lacrosse': 'wlax',
      "women's lacrosse": 'wlax',
      'wlax': 'wlax'
    };
    
    // Normalize input
    const normalizedInput = sportId.toLowerCase().trim();
    
    // Return mapped value or default to the input
    return sportMap[normalizedInput] || normalizedInput;
  }
}

export const macService = new MacService();