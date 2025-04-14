import axios from 'axios';
import { JSDOM } from 'jsdom';
import { StandingsEntry } from '@shared/schema';

/**
 * Service for fetching and processing data from Google Sheets or directly from MAC website
 */
export class GoogleSheetsService {
  // Known school name to ID mapping
  private readonly schoolNameToId: Record<string, string> = {
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

  /**
   * Fetches standings data for a specific sport directly from MAC website
   * 
   * @param sportId The sport ID used in the URL path
   * @returns Array of standings entries
   */
  async fetchStandings(sportId: string): Promise<StandingsEntry[]> {
    try {
      console.log(`Fetching standings for ${sportId} directly from MAC website`);
      
      // Construct the URL to the MAC standings page
      const url = `https://getsomemaction.com/standings.aspx?path=${sportId}`;
      
      console.log(`Fetching data from URL: ${url}`);
      
      // Fetch the HTML data
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      // Process the HTML data into standings entries
      const standings = this.processHTMLToStandings(response.data, sportId);
      console.log(`Processed ${standings.length} standings entries for ${sportId}`);
      
      return standings;
    } catch (error) {
      console.error(`Error fetching ${sportId} standings from MAC website:`, error);
      // Return empty array on error
      return [];
    }
  }
  
  /**
   * Processes HTML data from MAC website into StandingsEntry objects
   * 
   * @param htmlData The raw HTML data from MAC website
   * @param sportId The sport ID for these standings
   * @returns Array of standings entries
   */
  private processHTMLToStandings(htmlData: string, sportId: string): StandingsEntry[] {
    const standings: StandingsEntry[] = [];
    
    try {
      // Parse the HTML using jsdom
      const dom = new JSDOM(htmlData);
      const document = dom.window.document;
      
      // Find the standings table - looking for the sidearm-table class
      const table = document.querySelector('.sidearm-standings-table, .sidearm-table');
      
      if (!table) {
        console.warn('No standings table found in HTML');
        return [];
      }
      
      // Find the rows in the table body
      const rows = table.querySelectorAll('tbody tr');
      console.log(`Found ${rows.length} data rows in the standings table`);
      
      // Process each data row
      rows.forEach((row, index) => {
        try {
          // Find all cells in the row
          const cells = row.querySelectorAll('td');
          
          // Get team name from first cell - look for the team name span
          const teamNameCell = cells[0];
          let teamName = '';
          
          // Try to find team name in different possible elements
          const teamNameElement = teamNameCell.querySelector('.sidearm-table-team-name');
          if (teamNameElement) {
            teamName = teamNameElement.textContent?.trim() || '';
          } else {
            teamName = teamNameCell.textContent?.trim() || '';
          }
          
          // Clean up team name and determine school ID
          teamName = teamName.replace(/["""]/g, '').trim();
          const schoolId = this.getSchoolId(teamName);
          
          // Skip if we couldn't determine a school ID
          if (!schoolId) {
            console.warn(`Could not determine school ID for: ${teamName}`);
            return; // continue in forEach
          }
          
          console.log(`Processing team: ${teamName} (${schoolId})`);
          
          // Look for conference and overall records in the table
          // The exact column positions can vary, so we need to examine the table headers
          
          // Default positions - will attempt to determine more accurately
          let confWinsCol = 1;
          let confLossesCol = 2;
          let overallWinsCol = 4;
          let overallLossesCol = 5;
          
          // Try to find the cells with the conference record (usually W-L format)
          let confWins = 0;
          let confLosses = 0;
          let overallWins = 0;
          let overallLosses = 0;
          
          // Check each cell for potential conference or overall record
          for (let i = 1; i < cells.length; i++) {
            const cellText = cells[i].textContent?.trim() || '';
            
            // Look for W-L format (e.g., "8-0" or "8 - 0")
            const wlMatch = cellText.match(/(\d+)\s*-\s*(\d+)/);
            if (wlMatch) {
              // Found a W-L record, determine if it's conference or overall
              // Conference record is typically before overall record
              if (confWins === 0 && confLosses === 0) {
                confWins = parseInt(wlMatch[1]);
                confLosses = parseInt(wlMatch[2]);
                confWinsCol = i;
              } else if (overallWins === 0 && overallLosses === 0) {
                overallWins = parseInt(wlMatch[1]);
                overallLosses = parseInt(wlMatch[2]);
                overallWinsCol = i;
              }
            }
          }
          
          // If we still don't have records, look for individual W/L columns
          if (confWins === 0 && confLosses === 0) {
            // Try to find columns with just numbers for wins and losses
            for (let i = 1; i < cells.length - 1; i++) {
              const cell1Text = cells[i].textContent?.trim() || '';
              const cell2Text = cells[i+1].textContent?.trim() || '';
              
              // Check if both cells contain just numbers
              if (/^\d+$/.test(cell1Text) && /^\d+$/.test(cell2Text)) {
                confWins = parseInt(cell1Text);
                confLosses = parseInt(cell2Text);
                confWinsCol = i;
                confLossesCol = i + 1;
                break;
              }
            }
          }
          
          // As a last resort, try to grab numbers from cell text
          if (confWins === 0 && confLosses === 0 && cells.length > 2) {
            const win = parseInt(cells[1].textContent?.replace(/[^0-9]/g, '') || '0');
            const loss = parseInt(cells[2].textContent?.replace(/[^0-9]/g, '') || '0');
            if (win > 0 || loss > 0) {
              confWins = win;
              confLosses = loss;
            }
          }
          
          if (overallWins === 0 && overallLosses === 0 && cells.length > 4) {
            const win = parseInt(cells[4].textContent?.replace(/[^0-9]/g, '') || '0');
            const loss = parseInt(cells[5].textContent?.replace(/[^0-9]/g, '') || '0');
            if (win > 0 || loss > 0) {
              overallWins = win;
              overallLosses = loss;
            }
          }
          
          console.log(`Conference: ${confWins}-${confLosses}, Overall: ${overallWins}-${overallLosses}`);
          
          // Calculate winning percentages
          const confTotal = confWins + confLosses;
          const overallTotal = overallWins + overallLosses;
          
          const confWinPct = confTotal > 0 ? confWins / confTotal : 0;
          const overallWinPct = overallTotal > 0 ? overallWins / overallTotal : 0;
          
          // Create unique ID for this standing entry
          const entryId = `${sportId}-${schoolId}-${Date.now()}-${index}`;
          
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
        } catch (rowError) {
          console.error(`Error processing row ${index}:`, rowError);
        }
      });
      
      // Sort by conference winning percentage (descending)
      standings.sort((a, b) => 
        b.conference.winningPercentage - a.conference.winningPercentage
      );
      
    } catch (error) {
      console.error('Error processing HTML data:', error);
    }
    
    return standings;
  }
  
  /**
   * Helper to determine school ID from name
   */
  private getSchoolId(name: string): string {
    const lowercaseName = name.toLowerCase().trim();
    
    // First check exact matches in our mapping
    if (this.schoolNameToId[lowercaseName]) {
      return this.schoolNameToId[lowercaseName];
    }
    
    // Check for partial matches
    for (const [key, id] of Object.entries(this.schoolNameToId)) {
      if (lowercaseName.includes(key)) {
        return id;
      }
    }
    
    // Last resort: clean up the name and use it as ID
    return lowercaseName.replace(/[^a-z0-9]/g, '');
  }
}

// Export a singleton instance
export const googleSheetsService = new GoogleSheetsService();