import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import * as cheerio from 'cheerio';
import { Game, NewsItem, StandingsEntry, Player, TeamStat } from '@shared/schema';
import { JSDOM } from 'jsdom';
import RssParser from 'rss-parser';

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
      
      // Find all tables matching the selector
      const tables = $(tableSelector);
      if (tables.length === 0) {
        console.warn(`No table found at selector: ${tableSelector}`);
        return [];
      }
      
      console.log(`Found ${tables.length} tables matching selector`);
      
      // Process each table that matches our selector
      tables.each((tableIndex, tableElement) => {
        const table = $(tableElement);
        
        // For MAC website, we need to handle complex tables
        // First, let's check if we have a section header row (like CONFERENCE and OVERALL headers)
        const theadRows = table.find('thead tr');
        const sectionHeaderRow = theadRows.first();
        const hasTheadSections = theadRows.length > 1;
        
        // Determine columns and their meanings based on table structure
        let columnMapping: { [index: number]: keyof T } = {};
        
        if (hasTheadSections) {
          // Complex MAC-style table with multiple header rows
          console.log(`Processing complex table with multiple header rows`);
          
          // First, process the section headers (CONFERENCE, OVERALL)
          const sectionHeaders: { [index: number]: string } = {};
          let currentColIndex = 0;
          
          sectionHeaderRow.find('th').each((_, cell) => {
            const colspan = parseInt($(cell).attr('colspan') || '1');
            const sectionText = $(cell).text().trim().toUpperCase();
            
            // Map this section to multiple columns based on colspan
            for (let i = 0; i < colspan; i++) {
              sectionHeaders[currentColIndex + i] = sectionText;
            }
            
            currentColIndex += colspan;
          });
          
          // Now process the actual column headers from the next row
          const columnHeaderRow = theadRows.eq(1);
          currentColIndex = 0;
          
          columnHeaderRow.find('th').each((_, cell) => {
            const colspan = parseInt($(cell).attr('colspan') || '1');
            const headerText = $(cell).text().trim();
            const section = sectionHeaders[currentColIndex] || '';
            
            let mappedKey: keyof T | undefined;
            
            // Special handling for MAC website
            if (section === 'CONFERENCE' || section === 'CONF') {
              // These are conference columns
              if (headerText === 'W') {
                mappedKey = headerMapping['Conf W'];
              } else if (headerText === 'L') {
                mappedKey = headerMapping['Conf L'];
              } else if (headerText === 'PCT' || headerText === 'PCT.') {
                mappedKey = headerMapping['Win %'];
              } else {
                mappedKey = headerMapping[headerText];
              }
            } else if (section === 'OVERALL') {
              // These are overall columns
              if (headerText === 'W') {
                mappedKey = headerMapping['W'];
              } else if (headerText === 'L') {
                mappedKey = headerMapping['L'];
              } else if (headerText === 'PCT' || headerText === 'PCT.') {
                mappedKey = headerMapping['Win %'];
              } else {
                mappedKey = headerMapping[headerText];
              }
            } else {
              // Regular column header
              mappedKey = headerMapping[headerText];
            }
            
            if (mappedKey) {
              for (let i = 0; i < colspan; i++) {
                columnMapping[currentColIndex + i] = mappedKey;
              }
            }
            
            currentColIndex += colspan;
          });
        } else {
          // Simple table with a single header row
          console.log(`Processing simple table with single header row`);
          
          // Find all headers in the first row
          const headerRow = table.find('tr').first();
          const headers: string[] = [];
          
          headerRow.find('th').each((_, cell) => {
            headers.push($(cell).text().trim());
          });
          
          console.log(`Table headers found: ${headers.join(', ')}`);
          
          // Map each column to the appropriate property
          headers.forEach((header, index) => {
            const mappedKey = headerMapping[header];
            if (mappedKey) {
              columnMapping[index] = mappedKey;
            }
          });
        }
        
        // Find all data rows - skip header rows
        let dataRows = table.find('tbody tr');
        if (dataRows.length === 0) {
          // If no tbody, just get all rows except the header row(s)
          dataRows = table.find('tr').slice(theadRows.length || 1);
        }
        
        // Process each data row
        dataRows.each((_, row) => {
          const rowData = {} as any;
          
          // Special handling for MAC website - check for team name in a nested div
          const cells = $(row).find('td');
          const firstCell = cells.first();
          const teamNameElement = firstCell.find('.sidearm-table-team-name');
          
          if (teamNameElement.length > 0) {
            // Found a team name in a special element
            const teamName = teamNameElement.text().trim();
            const teamLogo = firstCell.find('img').attr('src');
            const schoolIdKey = columnMapping[0] as keyof T;
            
            if (schoolIdKey) {
              rowData[schoolIdKey] = teamName;
            }
          }
          
          // Process all cells in the row
          cells.each((colIndex, cell) => {
            // Skip the first cell if we already processed it for a team name
            if (colIndex === 0 && teamNameElement.length > 0) return;
            
            const mappedKey = columnMapping[colIndex];
            if (mappedKey) {
              rowData[mappedKey] = $(cell).text().trim();
            }
          });
          
          // Only add non-empty rows
          if (Object.keys(rowData).length > 0) {
            results.push(rowData as T);
          }
        });
      });
      
      console.log(`Imported ${results.length} total rows from all tables`);
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
      'TEAM': 'schoolId', // MAC website uses uppercase
      // Conference columns
      'W': 'conferenceWins', // In the Conference section this is conf wins
      'L': 'conferenceLosses', // In the Conference section this is conf losses
      'PCT': 'winPercentage',
      'Pct': 'winPercentage',
      'Win %': 'winPercentage',
      'Conf': 'conferenceWins', // Some tables use this for conference record
      'CONF': 'conferenceWins', // MAC website uses uppercase
      // Overall columns
      'Overall': 'wins', // Some tables use this for overall record
      'OVERALL': 'wins', // MAC website uses uppercase
      'Home': 'homeRecord',
      'Away': 'awayRecord',
      'Streak': 'streak',
      'PF': 'pointsFor',
      'PA': 'pointsAgainst'
    };
    
    const results = await this.importHtmlTable<HtmlStandingsRow>(
      url,
      'table.sidearm-standings-table, table.sidearm-table, table.standings, table.conference-standings, .table-standings', // Updated MAC website selectors
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
  
  /**
   * Imports the MAC sports calendar from the official RSS feed
   * 
   * @param url The URL of the MAC calendar RSS feed
   * @param filterSportId Optional ID to filter games for a specific sport
   * @param filterSchoolId Optional ID to filter games for a specific school
   * @returns Array of game objects
   */
  async importMacCalendar(
    url: string = "https://getsomemaction.com/services/responsive-calendar-subscription.ashx/calendar.rss?sport_id=0&school_id=0&schedule_id=0",
    filterSportId?: string,
    filterSchoolId?: string
  ): Promise<Partial<Game>[]> {
    try {
      console.log(`Fetching MAC calendar from: ${url}`);
      
      // Add or modify sport_id and school_id parameters in the URL if provided
      const urlObj = new URL(url);
      if (filterSportId) {
        urlObj.searchParams.set('sport_id', filterSportId);
      }
      if (filterSchoolId) {
        urlObj.searchParams.set('school_id', filterSchoolId);
      }
      
      const response = await axios.get(urlObj.toString(), {
        headers: {
          'User-Agent': 'Mobile-MACtion-App/1.0'
        }
      });
      
      const parser = new (RssParser as any)({
        customFields: {
          item: [
            ['ev:location', 'evLocation'],
            ['ev:startdate', 'evStartDate'],
            ['ev:enddate', 'evEndDate'],
            ['s:localstartdate', 'localStartDate'],
            ['s:localenddate', 'localEndDate'],
            ['s:teamlogo', 'teamLogo'],
            ['s:opponentlogo', 'opponentLogo'],
            ['s:gameid', 'gameId'],
            ['s:links', 'links'],
            ['s:links.s:livestats', 'liveStatsUrl']
          ]
        }
      });
      
      const result = await parser.parseString(response.data);
      if (!result.items || result.items.length === 0) {
        console.warn('No items found in MAC calendar RSS feed');
        return [];
      }
      
      console.log(`Found ${result.items.length} events in MAC calendar RSS feed`);
      
      const games: Partial<Game>[] = [];
      
      for (const item of result.items) {
        try {
          // Parse the title to extract date, time, sport, and teams
          // Format: "4/17 3:00 PM Baseball Bowling Green vs Ball State"
          const title = item.title || '';
          const titleParts = title.split(' ');
          
          // Find the sport (usually after date/time)
          let sportId = '';
          let sportIndex = 0;
          for (let i = 0; i < titleParts.length; i++) {
            // Check for common sports names
            const part = titleParts[i].toLowerCase();
            if (['baseball', 'basketball', 'football', 'soccer', 'volleyball', 'tennis', 
                 'track', 'golf', 'swimming', 'softball', 'wrestling'].includes(part)) {
              sportId = part;
              sportIndex = i;
              break;
            }
          }
          
          // If a specific sport filter was set and this doesn't match, skip
          if (filterSportId && sportId !== filterSportId) {
            continue;
          }
          
          // Parse the teams - they come after the sport
          const teamsText = titleParts.slice(sportIndex + 1).join(' ');
          const teamMatch = teamsText.match(/(.+?)\s+(?:vs\.?|at|@)\s+(.+)/i);
          
          if (!teamMatch) {
            console.warn(`Could not parse teams from: ${teamsText}`);
            continue;
          }
          
          const homeTeamName = teamMatch[1].trim();
          const awayTeamName = teamMatch[2].trim();
          
          // Convert team names to IDs based on our known schools
          // This is simplified and might need more sophisticated matching
          const homeTeamId = this.getSchoolIdFromName(homeTeamName);
          const awayTeamId = this.getSchoolIdFromName(awayTeamName);
          
          // If a school filter was set and neither team matches, skip
          if (filterSchoolId && homeTeamId !== filterSchoolId && awayTeamId !== filterSchoolId) {
            continue;
          }
          
          // Parse the start time
          const startTime = item.evStartDate || item.localStartDate || new Date().toISOString();
          const gameDate = new Date(startTime);
          
          // Check for live stats URL
          let liveStatsUrl = '';
          if (item.links && item.links.s_livestats) {
            liveStatsUrl = item.links.s_livestats;
          }
          
          // Determine game status based on date
          const now = new Date();
          let status: 'scheduled' | 'live' | 'final' = 'scheduled';
          
          if (gameDate < now) {
            // Game date is in the past
            status = 'final';
          } else if (Math.abs(gameDate.getTime() - now.getTime()) < 4 * 60 * 60 * 1000) {
            // Game is within a 4-hour window of current time (potentially live)
            status = 'live';
          }
          
          // Create the game object
          games.push({
            id: `mac-${item.gameId || games.length + 1}-${Date.now()}`,
            sportId: this.normalizeSportId(sportId),
            homeTeamId,
            awayTeamId,
            // Add team names for teams that might not be in our database
            homeTeamName: homeTeamName,
            awayTeamName: awayTeamName,
            homeTeamScore: 0, // Will be updated for in-progress or completed games
            awayTeamScore: 0,
            status,
            clock: '',
            venue: item.evLocation || '',
            location: item.evLocation || '',
            startTime: gameDate.toISOString(),
            scheduledTime: gameDate.toISOString(),
            liveStatsUrl,
            isRivalryGame: false // Would need additional logic to determine this
          });
          
        } catch (err) {
          console.warn(`Error parsing MAC calendar item: ${err}`);
          // Continue with next item
        }
      }
      
      console.log(`Successfully imported ${games.length} games from MAC calendar`);
      return games;
      
    } catch (error) {
      console.error('Error importing MAC calendar:', error);
      return [];
    }
  }
  
  /**
   * Helper method to convert a school name to a school ID
   * 
   * @param schoolName The name of the school from the calendar
   * @returns The corresponding school ID in our system
   */
  private getSchoolIdFromName(schoolName: string): string {
    // Normalize the school name
    const normalizedName = schoolName.toLowerCase().trim();
    
    // Map of common MAC school names to our internal IDs
    const schoolNameMap: Record<string, string> = {
      'akron': 'akron',
      'zips': 'akron',
      'ball state': 'ballstate',
      'cardinals': 'ballstate',
      'bowling green': 'bowlinggreen',
      'bgsu': 'bowlinggreen',
      'falcons': 'bowlinggreen',
      'buffalo': 'buffalo',
      'bulls': 'buffalo',
      'central michigan': 'centralmichigan',
      'cmu': 'centralmichigan',
      'chippewas': 'centralmichigan',
      'eastern michigan': 'easternmichigan',
      'emu': 'easternmichigan',
      'eagles': 'easternmichigan',
      'kent state': 'kentstate',
      'ksu': 'kentstate',
      'golden flashes': 'kentstate',
      'miami': 'miamioh',
      'miami (oh)': 'miamioh',
      'redhawks': 'miamioh',
      'northern illinois': 'northernillinois',
      'niu': 'northernillinois',
      'huskies': 'northernillinois',
      'ohio': 'ohio',
      'bobcats': 'ohio',
      'toledo': 'toledo',
      'rockets': 'toledo',
      'western michigan': 'westernmichigan',
      'wmu': 'westernmichigan',
      'broncos': 'westernmichigan',
      'massachusetts': 'massachusetts',
      'umass': 'massachusetts',
      'minutemen': 'massachusetts',
      'george mason': 'georgemason',
      'patriots': 'georgemason',
      'cleveland state': 'clevelandstate',
      'vikings': 'clevelandstate'
    };
    
    // Try to find a match in our map
    for (const [key, value] of Object.entries(schoolNameMap)) {
      if (normalizedName.includes(key)) {
        return value;
      }
    }
    
    // If no match is found, return a placeholder ID
    console.warn(`Could not map school name to ID: ${schoolName}`);
    return `unknown-${normalizedName.replace(/\s+/g, '-')}`;
  }
  
  /**
   * Helper method to normalize sport IDs
   * 
   * @param sportName The sport name from the calendar
   * @returns The normalized sport ID
   */
  private normalizeSportId(sportName: string): string {
    // Normalize the sport name
    const normalizedName = sportName.toLowerCase().trim();
    
    // Map of common sport names to our internal IDs
    const sportIdMap: Record<string, string> = {
      'baseball': 'baseball',
      'mens basketball': 'mbball',
      'men basketball': 'mbball',
      'm basketball': 'mbball',
      'womens basketball': 'wbball',
      'women basketball': 'wbball',
      'w basketball': 'wbball',
      'football': 'football',
      'mens soccer': 'msoccer',
      'men soccer': 'msoccer',
      'm soccer': 'msoccer',
      'womens soccer': 'wsoccer',
      'women soccer': 'wsoccer',
      'w soccer': 'wsoccer',
      'softball': 'softball',
      'volleyball': 'volleyball',
      'track': 'track',
      'track and field': 'track',
      'wrestling': 'wrestling',
      'tennis': 'tennis',
      'golf': 'golf',
      'swimming': 'swimming',
      'cross country': 'crosscountry'
    };
    
    // Try to find a match in our map
    for (const [key, value] of Object.entries(sportIdMap)) {
      if (normalizedName.includes(key)) {
        return value;
      }
    }
    
    // If the sport name is just 'basketball', try to determine gender from context
    if (normalizedName === 'basketball') {
      return 'mbball'; // Default to men's basketball if not specified
    }
    
    // If no match found, use the normalized name
    return normalizedName.replace(/\s+/g, '-');
  }
}

// Export a singleton instance
export const dataImporter = new DataImporter();