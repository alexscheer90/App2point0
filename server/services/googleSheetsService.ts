import axios from 'axios';
import { StandingsEntry } from '@shared/schema';

/**
 * Service for fetching and processing data from Google Sheets
 */
export class GoogleSheetsService {
  // The ID of the Google Sheet containing standings data
  private readonly spreadsheetId = '1Vq8UJeuIxVBwYKIJKOlFvZY2ITrApOvgMKhgjvoCmTs';

  /**
   * Fetches standings data for a specific sport from Google Sheets
   * 
   * @param sportId The sport ID (must match a tab name in the Google Sheet)
   * @returns Array of standings entries
   */
  async fetchStandings(sportId: string): Promise<StandingsEntry[]> {
    try {
      console.log(`Fetching standings for ${sportId} from Google Sheets`);
      
      // Convert sportId to a Google Sheets tab name (gid parameter)
      // For simplicity, we'll assume the tab names match our sportIds
      // If needed, we can map sportIds to specific gids later
      
      // Construct the URL to fetch the CSV format of the specific sheet
      const url = `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/export?format=csv&gid=0`;
      
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
      const rows = csvData.split('\\n');
      
      // Assume the first row contains headers
      const headers = rows[0].split(',');
      
      // Find indices of relevant columns
      const schoolIdIndex = headers.findIndex(h => 
        h.toLowerCase().includes('school') || h.toLowerCase().includes('team'));
      const confWinsIndex = headers.findIndex(h => 
        h.toLowerCase().includes('conf') && h.toLowerCase().includes('win'));
      const confLossesIndex = headers.findIndex(h => 
        h.toLowerCase().includes('conf') && h.toLowerCase().includes('loss'));
      const winsIndex = headers.findIndex(h => 
        h.toLowerCase() === 'wins' || h.toLowerCase() === 'w');
      const lossesIndex = headers.findIndex(h => 
        h.toLowerCase() === 'losses' || h.toLowerCase() === 'l');
      
      // Verify that we found the necessary columns
      if (schoolIdIndex === -1 || 
          (confWinsIndex === -1 || confLossesIndex === -1) || 
          (winsIndex === -1 || lossesIndex === -1)) {
        console.warn('Required columns not found in CSV data');
        return [];
      }
      
      // Process each data row
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue; // Skip empty rows
        
        const columns = rows[i].split(',');
        
        if (columns.length < Math.max(schoolIdIndex, confWinsIndex, confLossesIndex, winsIndex, lossesIndex) + 1) {
          console.warn(`Row ${i} has insufficient columns: ${rows[i]}`);
          continue;
        }
        
        // Extract values
        const schoolId = columns[schoolIdIndex].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const confWins = parseInt(columns[confWinsIndex]) || 0;
        const confLosses = parseInt(columns[confLossesIndex]) || 0;
        const wins = parseInt(columns[winsIndex]) || 0;
        const losses = parseInt(columns[lossesIndex]) || 0;
        
        // Skip rows with no school ID
        if (!schoolId) continue;
        
        // Calculate winning percentages
        const confTotal = confWins + confLosses;
        const overallTotal = wins + losses;
        
        const confWinPct = confTotal > 0 ? confWins / confTotal : 0;
        const overallWinPct = overallTotal > 0 ? wins / overallTotal : 0;
        
        // Create standings entry
        standings.push({
          id: `${sportId}-${schoolId}-${Date.now()}`,
          schoolId,
          sportId,
          conference: {
            wins: confWins,
            losses: confLosses,
            winningPercentage: confWinPct
          },
          overall: {
            wins,
            losses,
            winningPercentage: overallWinPct
          }
        });
      }
    } catch (error) {
      console.error('Error processing CSV data:', error);
    }
    
    return standings;
  }
}

// Export a singleton instance
export const googleSheetsService = new GoogleSheetsService();