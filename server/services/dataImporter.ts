import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import * as cheerio from 'cheerio';
import { Game, NewsItem, StandingsEntry, Player, TeamStat } from '@shared/schema';
import { JSDOM } from 'jsdom';

/**
 * Data Importer Service
 * 
 * Provides functionality similar to Google Sheets/Excel's data import capabilities
 * to fetch, parse and structure data from external websites.
 */
export class DataImporter {
  /**
   * Fetches and parses an RSS feed from a given URL
   * 
   * @param url The URL of the RSS feed
   * @returns Array of structured news items
   */
  async importRssFeed(url: string): Promise<NewsItem[]> {
    try {
      console.log(`Fetching RSS feed from: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mobile-MACtion-App/1.0',
          'Accept': 'application/xml, text/xml, */*'
        }
      });
      
      const xmlData = response.data;
      console.log(`RSS response type: ${typeof xmlData}`);
      console.log(`RSS starts with: ${xmlData.substring(0, 100)}`);
      
      const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "_",
        parseAttributeValue: true
      };
      
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);
      
      if (!result || !result.rss || !result.rss.channel || !result.rss.channel.item) {
        console.warn('RSS feed format not recognized:', result);
        return [];
      }
      
      // Make sure items is an array even if there's only one item
      const items = Array.isArray(result.rss.channel.item) 
        ? result.rss.channel.item 
        : [result.rss.channel.item];
      
      console.log(`Number of items in RSS feed: ${items.length}`);
      
      return items.map((item: any, index: number): NewsItem => {
        // Extract the first image from the description if available
        let imageUrl = '';
        if (item.description) {
          const dom = new JSDOM(`<div>${item.description}</div>`);
          const imgElement = dom.window.document.querySelector('img');
          if (imgElement && imgElement.src) {
            imageUrl = imgElement.src;
          }
        }
        
        // Clean description - remove HTML tags
        let description = item.description || '';
        description = description.replace(/<[^>]*>/g, ' ').trim();
        description = description.replace(/\\s+/g, ' ');
        
        // Use pubDate if available
        const pubDate = item.pubDate || new Date().toISOString();
        const date = new Date(pubDate);
        
        return {
          id: `imported-${Date.now()}-${index}`,
          title: item.title || 'Untitled',
          summary: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
          content: description,
          publishedAt: date.toISOString(),
          imageUrl: imageUrl,
          url: item.link || '',
          schoolId: 'auto-detect', // Will be set by the caller
        };
      });
    } catch (error) {
      console.error('Error importing RSS feed:', error);
      return [];
    }
  }
  
  /**
   * Scrapes HTML tables from a webpage and converts them to structured data
   * 
   * @param url The URL of the webpage containing the table
   * @param tableSelector CSS selector to find the table
   * @param headerMapping Maps table headers to data fields
   * @returns Array of structured objects based on the table data
   */
  async importHtmlTable<T>(
    url: string, 
    tableSelector: string, 
    headerMapping: Record<string, keyof T>
  ): Promise<T[]> {
    try {
      console.log(`Fetching HTML table from: ${url} with selector: ${tableSelector}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mobile-MACtion-App/1.0'
        }
      });
      
      const $ = cheerio.load(response.data);
      const results: T[] = [];
      
      // Find the table
      const table = $(tableSelector);
      if (table.length === 0) {
        console.warn(`No table found at selector: ${tableSelector}`);
        return [];
      }
      
      // Extract headers
      const headers: string[] = [];
      table.find('tr:first-child th, tr:first-child td').each((_, el) => {
        headers.push($(el).text().trim());
      });
      
      console.log(`Table headers found: ${headers.join(', ')}`);
      
      // Process each row
      table.find('tr:not(:first-child)').each((_, row) => {
        const rowData: Record<string, any> = {};
        
        $(row).find('td').each((colIndex, cell) => {
          if (colIndex < headers.length) {
            const header = headers[colIndex];
            const mappedKey = headerMapping[header];
            
            if (mappedKey) {
              rowData[mappedKey as string] = $(cell).text().trim();
            }
          }
        });
        
        if (Object.keys(rowData).length > 0) {
          results.push(rowData as unknown as T);
        }
      });
      
      console.log(`Imported ${results.length} rows from table`);
      return results;
    } catch (error) {
      console.error('Error importing HTML table:', error);
      return [];
    }
  }
  
  /**
   * Imports standings data from a website
   * 
   * @param url The URL of the standings page
   * @param sportId The sport these standings are for
   * @returns Array of standings entries
   */
  async importStandings(url: string, sportId: string): Promise<StandingsEntry[]> {
    // We need to use a custom type that matches the HTML table columns
    // and then transform it to match the StandingsEntry schema
    type HtmlStandingsRow = {
      schoolId: string;
      teamName: string;
      wins: number;
      losses: number;
      conferenceWins: number;
      conferenceLosses: number;
      winPercentage: number;
      homeRecord: string;
      awayRecord: string;
      streak: string;
      pointsFor: number;
      pointsAgainst: number;
    };
    
    // Header mapping for HTML table columns to our intermediate type
    const headerMapping: Record<string, keyof HtmlStandingsRow> = {
      'School': 'schoolId',
      'Team': 'teamName',
      'W': 'wins',
      'L': 'losses',
      'Conf W': 'conferenceWins',
      'Conf L': 'conferenceLosses',
      'PCT': 'winPercentage',
      'Win %': 'winPercentage',
      'Home': 'homeRecord',
      'Away': 'awayRecord',
      'Streak': 'streak',
      'PF': 'pointsFor',
      'PA': 'pointsAgainst'
    };
    
    const results = await this.importHtmlTable<HtmlStandingsRow>(
      url,
      'table.standings, table.conference-standings, .table-standings', // Common CSS selectors for standings tables
      headerMapping
    );
    
    return results.map((entry, index) => {
      // Extract conference and overall records based on schema structure
      const conferenceWins = parseInt(String(entry.conferenceWins || 0));
      const conferenceLosses = parseInt(String(entry.conferenceLosses || 0));
      const overallWins = parseInt(String(entry.wins || 0));
      const overallLosses = parseInt(String(entry.losses || 0));
      
      return {
        id: `imported-${sportId}-${Date.now()}-${index}`,
        schoolId: entry.schoolId || 'unknown',
        sportId: sportId,
        conference: {
          wins: conferenceWins,
          losses: conferenceLosses,
          winningPercentage: conferenceWins + conferenceLosses > 0 
            ? conferenceWins / (conferenceWins + conferenceLosses) 
            : 0
        },
        overall: {
          wins: overallWins,
          losses: overallLosses,
          winningPercentage: overallWins + overallLosses > 0 
            ? overallWins / (overallWins + overallLosses) 
            : 0
        }
      };
    });
  }
  
  /**
   * Imports team statistics from a website
   * 
   * @param url The URL of the team stats page
   * @param schoolId The school ID these stats belong to
   * @param sportId The sport these stats are for
   * @returns Team statistics object
   */
  async importTeamStats(url: string, schoolId: string, sportId: string): Promise<Partial<TeamStat>> {
    try {
      console.log(`Fetching team stats from: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mobile-MACtion-App/1.0'
        }
      });
      
      const $ = cheerio.load(response.data);
      
      // This implementation is simplified - in a real app you would need
      // custom logic for each different team stats page format
      const statsText: Record<string, string> = {};
      const stats: Record<string, number> = {};
      
      // Look for stat tables
      $('.team-stats, .statistics-table, .stats-table').each((_, table) => {
        $(table).find('tr').each((_, row) => {
          const cells = $(row).find('td, th');
          if (cells.length >= 2) {
            const statName = $(cells[0]).text().trim();
            const statValue = $(cells[1]).text().trim();
            if (statName && statValue) {
              statsText[statName] = statValue;
              // Try to convert to number if possible
              const numValue = parseFloat(statValue.replace(/[^0-9.]/g, ''));
              if (!isNaN(numValue)) {
                stats[statName] = numValue;
              }
            }
          }
        });
      });
      
      // Look for individual stats in various layouts
      $('.stat-item, .team-stat, .stat-block').each((_, item) => {
        const label = $(item).find('.stat-label, .label').text().trim();
        const value = $(item).find('.stat-value, .value').text().trim();
        if (label && value) {
          statsText[label] = value;
          // Try to convert to number if possible
          const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
          if (!isNaN(numValue)) {
            stats[label] = numValue;
          }
        }
      });
      
      console.log(`Imported ${Object.keys(stats).length} team stats`);
      
      // Map the stats to our schema format
      // This is a simplified example - actual implementation depends on the specific stats we need
      const result: Partial<TeamStat> = {
        id: `imported-${schoolId}-${sportId}-${Date.now()}`,
        schoolId: schoolId,
        sportId: sportId,
        season: new Date().getFullYear().toString(),
        stats: stats
      };
      
      return result;
    } catch (error) {
      console.error('Error importing team stats:', error);
      return {
        id: `error-${schoolId}-${sportId}-${Date.now()}`,
        schoolId: schoolId,
        sportId: sportId,
        season: new Date().getFullYear().toString(),
        stats: {}
      };
    }
  }
  
  /**
   * Imports player data from a roster page
   * 
   * @param url The URL of the team roster page
   * @param schoolId The school ID these players belong to
   * @param sportId The sport these players play
   * @returns Array of player objects
   */
  async importRoster(url: string, schoolId: string, sportId: string): Promise<Partial<Player>[]> {
    // We need a custom type that matches HTML table structure
    type RosterTableRow = {
      name: string;
      number: string;
      position: string;
      year: string;
      height: string;
      weight: string;
      hometown: string;
      highSchool: string;
      lastSchool: string;
    };
    
    // Example header mapping for a typical roster table
    const headerMapping: Record<string, keyof RosterTableRow> = {
      'Name': 'name',
      'No.': 'number',
      'Number': 'number',
      '#': 'number',
      'Pos.': 'position',
      'Position': 'position',
      'Yr.': 'year',
      'Year': 'year',
      'Class': 'year',
      'Ht.': 'height',
      'Height': 'height',
      'Wt.': 'weight',
      'Weight': 'weight',
      'Hometown': 'hometown',
      'High School': 'highSchool',
      'Last School': 'lastSchool'
    };
    
    const results = await this.importHtmlTable<RosterTableRow>(
      url,
      'table.roster, .roster-table, .player-table', // Common CSS selectors for roster tables
      headerMapping
    );
    
    return results.map((player, index) => {
      // Process year to match the schema's enum
      let yearValue: 'FR' | 'SO' | 'JR' | 'SR' | 'GR' | undefined = undefined;
      if (player.year) {
        const yearStr = player.year.toString().trim().toUpperCase();
        if (['FR', 'SO', 'JR', 'SR', 'GR'].includes(yearStr)) {
          yearValue = yearStr as 'FR' | 'SO' | 'JR' | 'SR' | 'GR';
        } else if (yearStr.includes('FRESH')) yearValue = 'FR';
        else if (yearStr.includes('SOPH')) yearValue = 'SO';
        else if (yearStr.includes('JUNIOR')) yearValue = 'JR';
        else if (yearStr.includes('SENIOR')) yearValue = 'SR';
        else if (yearStr.includes('GRAD')) yearValue = 'GR';
      }
      
      const playerStats: Record<string, number> = {};
      
      return {
        id: `imported-${schoolId}-${sportId}-${Date.now()}-${index}`,
        name: player.name || 'Unknown Player',
        number: player.number?.toString() || '',
        position: player.position || '',
        year: yearValue,
        height: player.height || '',
        weight: player.weight?.toString() || '',
        hometown: player.hometown || '',
        bio: '',
        imageUrl: '', // Would need a more complex scraper to get player images
        schoolId: schoolId,
        sportId: sportId,
        stats: playerStats // Would need separate logic to import player stats
      };
    });
  }
  
  /**
   * Imports schedule/game data from a website
   * 
   * @param url The URL of the schedule page
   * @param schoolId The school ID for this schedule
   * @param sportId The sport these games are for
   * @returns Array of game objects
   */
  async importSchedule(url: string, schoolId: string, sportId: string): Promise<Partial<Game>[]> {
    try {
      console.log(`Fetching schedule from: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mobile-MACtion-App/1.0'
        }
      });
      
      const $ = cheerio.load(response.data);
      const games: Partial<Game>[] = [];
      
      // This is a simplified implementation - different sites will need different selectors
      $('.schedule-table tr, .event-row, .game-row').each((_, row) => {
        // Skip header rows
        if ($(row).find('th').length > 0) return;
        
        const date = $(row).find('.date, [data-field="date"]').text().trim();
        const opponent = $(row).find('.opponent, [data-field="opponent"]').text().trim();
        const location = $(row).find('.location, [data-field="location"]').text().trim();
        const result = $(row).find('.result, [data-field="result"]').text().trim();
        const time = $(row).find('.time, [data-field="time"]').text().trim();
        
        if (date) {
          // Parse the date (might need adjustments based on format)
          let gameDate: Date;
          try {
            gameDate = new Date(date);
            if (isNaN(gameDate.getTime())) {
              // Try different format if the first parse fails
              const currentYear = new Date().getFullYear();
              gameDate = new Date(`${date}, ${currentYear}`);
            }
          } catch (e) {
            console.warn(`Could not parse date: ${date}`);
            gameDate = new Date(); // Fallback to current date
          }
          
          // Determine if this is a home or away game
          const isHome = location.toLowerCase().includes('home') || 
                         !location.toLowerCase().includes('away');
          
          // Determine game status and score
          let status: 'scheduled' | 'live' | 'final' = 'scheduled';
          let homeScore = 0;
          let awayScore = 0;
          
          if (result) {
            status = 'final';
            // Try to parse score from result (W 72-65 or L 65-72 format)
            const scoreMatch = result.match(/([WL])\s*(\d+)[- ](\d+)/);
            if (scoreMatch) {
              const isWin = scoreMatch[1] === 'W';
              const score1 = parseInt(scoreMatch[2]);
              const score2 = parseInt(scoreMatch[3]);
              
              if (isWin) {
                homeScore = isHome ? score1 : score2;
                awayScore = isHome ? score2 : score1;
              } else {
                homeScore = isHome ? score2 : score1;
                awayScore = isHome ? score1 : score2;
              }
            }
          }
          
          // Parse opponent to get opponent school ID (simplified)
          let homeTeamId = isHome ? schoolId : 'opponent';
          let awayTeamId = isHome ? 'opponent' : schoolId;
          const opponents = opponent.toLowerCase().match(/(?:vs\.?\s+|@\s+)?([\w\s]+)/i);
          const opponentName = opponents ? opponents[1].trim() : opponent;
          
          // Add the game
          games.push({
            id: `imported-${schoolId}-${sportId}-${games.length}-${Date.now()}`,
            sportId: sportId,
            homeTeamId: homeTeamId,
            awayTeamId: awayTeamId,
            homeTeamScore: homeScore,
            awayTeamScore: awayScore,
            status: status,
            period: status === 'final' ? 4 : undefined, // For final games, assume 4 periods (for basketball/football)
            clock: '',
            venue: location,
            location: location,
            startTime: gameDate.toISOString(),
            scheduledTime: gameDate.toISOString(),
            situation: opponentName, // Use opponent name as situation
            isRivalryGame: false
          });
        }
      });
      
      console.log(`Imported ${games.length} games from schedule`);
      return games;
    } catch (error) {
      console.error('Error importing schedule:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const dataImporter = new DataImporter();