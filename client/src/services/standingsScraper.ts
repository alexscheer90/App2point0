import axios from 'axios';
import { Sport, StandingsEntry } from '@shared/schema';

// Function to parse W-L-T format and calculate winning percentage
const parseRecord = (recordStr: string): { wins: number; losses: number; ties: number; winningPercentage: number } => {
  // Split the record string (e.g., "8-0-3") into wins, losses, and ties
  const parts = recordStr.split('-');
  const wins = parseInt(parts[0], 10) || 0;
  const losses = parseInt(parts[1], 10) || 0;
  const ties = parseInt(parts[2], 10) || 0;
  
  // Calculate winning percentage (wins + 0.5 * ties) / (wins + losses + ties)
  const totalGames = wins + losses + ties;
  const winningPercentage = totalGames > 0 ? (wins + 0.5 * ties) / totalGames : 0;
  
  return { wins, losses, ties, winningPercentage };
};

// Map team names from the MAC website to our internal schoolIds
const mapTeamNameToSchoolId = (name: string): string => {
  const normalizedName = name.toLowerCase().replace(/\s+/g, '');
  const mapping: Record<string, string> = {
    'akron': 'akron',
    'ballstate': 'ballstate',
    'bowlinggreen': 'bowlinggreen',
    'buffalo': 'buffalo',
    'centralmichigan': 'centralmichigan',
    'easternmichigan': 'easternmichigan',
    'kentstate': 'kentstate',
    'miami': 'miamioh',
    'northernillinois': 'northernillinois',
    'ohio': 'ohio',
    'toledo': 'toledo',
    'westernmichigan': 'westernmichigan'
  };
  
  return mapping[normalizedName] || normalizedName;
};

/**
 * Scrapes standings for a specific sport from the official MAC website
 * @param sport The sport object containing information about the sport
 * @returns Array of standings entries for the sport
 */
export const scrapeStandingsForSport = async (sport: Sport): Promise<StandingsEntry[]> => {
  try {
    // Currently, we only support scraping women's soccer standings
    if (sport.id !== 'wsoc' && sport.id !== 'wsoccer') {
      console.warn(`Scraping not implemented for sport: ${sport.id}`);
      return [];
    }
    
    // Use the sport's official URL if available, otherwise use a default
    const url = sport.officialUrl || 'https://getsomemaction.com/standings.aspx?path=wsoc';
    
    // Fetch the HTML from the MAC website
    const response = await axios.get(url);
    const html = response.data;
    
    // Parse the HTML with a simple string-based approach (since we're in the browser)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find the standings table
    const table = doc.querySelector('.sidearm-standings-table, .sidearm-table');
    if (!table) {
      throw new Error(`No standings table found on the MAC website for ${sport.name}`);
    }
    
    // Find all rows in the table body
    const rows = table.querySelectorAll('tbody tr');
    const entries: StandingsEntry[] = [];
    
    // Process each row
    Array.from(rows).forEach((row) => {
      // Get all cells in the row
      const cells = row.querySelectorAll('td');
      if (cells.length < 3) return; // Skip rows with insufficient cells
      
      // Get team name from first cell
      const teamNameCell = cells[0];
      let teamName = '';
      
      // Extract team name - could be in an anchor or directly in the cell
      const teamNameAnchor = teamNameCell.querySelector('a');
      if (teamNameAnchor) {
        teamName = teamNameAnchor.textContent?.trim() || '';
      } else {
        teamName = teamNameCell.textContent?.trim() || '';
      }
      
      if (!teamName) return; // Skip if no team name found
      
      // Map the team name to our schoolId
      const schoolId = mapTeamNameToSchoolId(teamName);
      
      // Extract record data - typically conf record is in the 2nd column, overall in the 3rd
      let confRecordStr = '';
      let overallRecordStr = '';
      
      // Find the first two cells with record format (x-y-z)
      for (let i = 1; i < cells.length; i++) {
        const cellText = cells[i].textContent?.trim() || '';
        
        // Look for record format (at least two numbers separated by hyphens)
        if (/\d+-\d+(-\d+)?/.test(cellText)) {
          if (!confRecordStr) {
            confRecordStr = cellText;
          } else if (!overallRecordStr) {
            overallRecordStr = cellText;
            break;
          }
        }
      }
      
      // Parse the conference and overall records
      const conference = parseRecord(confRecordStr);
      const overall = parseRecord(overallRecordStr || confRecordStr); // Use conf record as fallback
      
      // Create the standings entry
      entries.push({
        id: `${sport.id}-${schoolId}`,
        schoolId,
        conference,
        overall,
        sportId: sport.id
      });
    });
    
    // Sort the entries by conference winning percentage (descending)
    return entries.sort((a, b) => b.conference.winningPercentage - a.conference.winningPercentage);
    
  } catch (error) {
    console.error(`Error scraping standings for ${sport.name}:`, error);
    return [];
  }
};