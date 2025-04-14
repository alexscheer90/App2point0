import axios from 'axios';
import { StandingsEntry } from '@shared/schema';

/**
 * Service for fetching and processing data from Google Sheets
 */
export class GoogleSheetsService {
  // The ID of the Google Sheet containing standings data
  private readonly spreadsheetId = '1Vq8UJeuIxVBwYKIJKOlFvZY2ITrApOvgMKhgjvoCmTs';
  
  // Map of sport IDs to their corresponding sheet gids
  private readonly sportToGidMap: Record<string, string> = {
    'football': '0',           // First tab (gid=0)
    'mbball': '584496246',     // Men's Basketball
    'wbball': '178438733',     // Women's Basketball
    'baseball': '1869752946',  // Baseball
    'softball': '987168557',   // Softball
    'volleyball': '2141557532',// Volleyball
    'field_hockey': '1356636135', // Field Hockey
    'msoccer': '1062272831',   // Men's Soccer
    'wsoccer': '1761039269',   // Women's Soccer
  };

  /**
   * Fetches standings data for a specific sport from Google Sheets
   * 
   * @param sportId The sport ID (must correspond to a tab in the Google Sheet)
   * @returns Array of standings entries
   */
  async fetchStandings(sportId: string): Promise<StandingsEntry[]> {
    try {
      console.log(`Fetching standings for ${sportId} from Google Sheets`);
      
      // Get the gid for this sport
      const gid = this.sportToGidMap[sportId] || '0';
      
      // Construct the URL to fetch the CSV format of the specific sheet
      const url = `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/export?format=csv&gid=${gid}`;
      
      console.log(`Fetching data from URL: ${url}`);
      
      // Fetch the CSV data
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mobile-MACtion-App/1.0'
        }
      });
      
      // Process the CSV data into standings entries
      const standings = this.processCSVToStandings(response.data, sportId);
      console.log(`Processed ${standings.length} standings entries for ${sportId}`);
      
      return standings;
    } catch (error) {
      console.error(`Error fetching ${sportId} standings from Google Sheets:`, error);
      // Return empty array on error
      return [];
    }
  }
  
  /**
   * Processes CSV data from Google Sheets into StandingsEntry objects
   * 
   * @param csvData The raw CSV data from Google Sheets
   * @param sportId The sport ID for these standings
   * @returns Array of standings entries
   */
  private processCSVToStandings(csvData: string, sportId: string): StandingsEntry[] {
    const standings: StandingsEntry[] = [];
    
    try {
      // Split the CSV into rows
      const rows = csvData.split('\n');
      
      console.log(`Processing ${rows.length} rows of CSV data`);
      console.log(`First row: ${rows[0]}`);
      
      if (rows.length <= 1) {
        console.warn('CSV data has insufficient rows');
        return [];
      }
      
      // Assume the first row contains headers
      const headers = rows[0].split(',');
      
      // Map expected column names to more flexible patterns
      const columnPatterns = {
        schoolName: ['school', 'team', 'university'],
        confWins: ['conference wins', 'conf wins', 'conf w', 'cw'],
        confLosses: ['conference losses', 'conf losses', 'conf l', 'cl'],
        overallWins: ['overall wins', 'wins', 'w', 'ow'],
        overallLosses: ['overall losses', 'losses', 'l', 'ol'],
      };
      
      // Find indices of relevant columns with flexible matching
      const findColumnIndex = (patterns: string[]) => {
        return headers.findIndex(header => {
          const headerLower = header.toLowerCase().trim();
          return patterns.some(pattern => headerLower.includes(pattern));
        });
      };
      
      const schoolNameIndex = findColumnIndex(columnPatterns.schoolName);
      const confWinsIndex = findColumnIndex(columnPatterns.confWins);
      const confLossesIndex = findColumnIndex(columnPatterns.confLosses);
      const overallWinsIndex = findColumnIndex(columnPatterns.overallWins);
      const overallLossesIndex = findColumnIndex(columnPatterns.overallLosses);
      
      console.log(`Column indices found: 
        School: ${schoolNameIndex}, 
        Conf Wins: ${confWinsIndex}, 
        Conf Losses: ${confLossesIndex}, 
        Overall Wins: ${overallWinsIndex}, 
        Overall Losses: ${overallLossesIndex}`);
      
      // Verify that we found the necessary columns
      if (schoolNameIndex === -1 || 
          confWinsIndex === -1 || confLossesIndex === -1 || 
          overallWinsIndex === -1 || overallLossesIndex === -1) {
        console.warn('Required columns not found in CSV data');
        return [];
      }
      
      // Known school name to ID mapping
      const schoolNameToId: Record<string, string> = {
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
        'massachusetts': 'massachusetts',
        'umass': 'massachusetts',
        'minutemen': 'massachusetts',
        'miami': 'miamioh',
        'miami (oh)': 'miamioh',
        'miami (ohio)': 'miamioh',
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
        'broncos': 'westernmichigan'
      };
      
      // Helper to determine school ID from name
      const getSchoolId = (name: string): string => {
        const lowercaseName = name.toLowerCase().trim();
        
        // First check exact matches in our mapping
        if (schoolNameToId[lowercaseName]) {
          return schoolNameToId[lowercaseName];
        }
        
        // Check for partial matches
        for (const [key, id] of Object.entries(schoolNameToId)) {
          if (lowercaseName.includes(key)) {
            return id;
          }
        }
        
        // Last resort: clean up the name and use it as ID
        return lowercaseName.replace(/[^a-z0-9]/g, '');
      };
      
      // Process each data row
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue; // Skip empty rows
        
        const columns = rows[i].split(',');
        
        // Skip if we don't have enough columns
        if (columns.length < Math.max(
          schoolNameIndex, 
          confWinsIndex, 
          confLossesIndex, 
          overallWinsIndex, 
          overallLossesIndex
        ) + 1) {
          console.warn(`Row ${i} has insufficient columns: ${rows[i]}`);
          continue;
        }
        
        // Extract values
        const schoolName = columns[schoolNameIndex].trim();
        const schoolId = getSchoolId(schoolName);
        
        // Parse numeric values, using 0 as fallback
        const confWins = parseInt(columns[confWinsIndex]) || 0;
        const confLosses = parseInt(columns[confLossesIndex]) || 0;
        const overallWins = parseInt(columns[overallWinsIndex]) || 0;
        const overallLosses = parseInt(columns[overallLossesIndex]) || 0;
        
        // Skip rows with no school ID
        if (!schoolId) {
          console.warn(`Could not determine school ID for: ${schoolName}`);
          continue;
        }
        
        // Calculate winning percentages
        const confTotal = confWins + confLosses;
        const overallTotal = overallWins + overallLosses;
        
        const confWinPct = confTotal > 0 ? confWins / confTotal : 0;
        const overallWinPct = overallTotal > 0 ? overallWins / overallTotal : 0;
        
        // Create unique ID for this standing entry
        const entryId = `${sportId}-${schoolId}-${Date.now()}-${i}`;
        
        console.log(`Creating standing entry for ${schoolName} (${schoolId}): Conference ${confWins}-${confLosses}, Overall ${overallWins}-${overallLosses}`);
        
        // Create standings entry
        standings.push({
          id: entryId,
          schoolId,
          sportId,
          conference: {
            wins: confWins,
            losses: confLosses,
            winningPercentage: confWinPct
          },
          overall: {
            wins: overallWins,
            losses: overallLosses,
            winningPercentage: overallWinPct
          }
        });
      }
      
      // Sort by conference winning percentage (descending)
      standings.sort((a, b) => 
        b.conference.winningPercentage - a.conference.winningPercentage
      );
      
    } catch (error) {
      console.error('Error processing CSV data:', error);
    }
    
    return standings;
  }
}

// Export a singleton instance
export const googleSheetsService = new GoogleSheetsService();