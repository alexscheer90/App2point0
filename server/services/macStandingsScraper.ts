import axios from 'axios';
import * as cheerio from 'cheerio';
import { StandingsEntry } from '../../shared/schema';

// Map team names from the MAC website to our internal schoolIds
const mapTeamNameToSchoolId = (name: string): string => {
  const normalizedName = name.toLowerCase().replace(/\s+/g, '');
  const mapping: Record<string, string> = {
    'akron': 'akron',
    'ballstate': 'ballstate',
    'ballst.': 'ballstate',
    'bowlinggreen': 'bowlinggreen',
    'bgsu': 'bowlinggreen',
    'buffalo': 'buffalo',
    'centralmichigan': 'centralmichigan',
    'cmu': 'centralmichigan',
    'easternmichigan': 'easternmichigan',
    'emu': 'easternmichigan',
    'kentstate': 'kentstate',
    'kent': 'kentstate',
    'miami': 'miamioh',
    'miamiohio': 'miamioh',
    'miamiuniversity': 'miamioh',
    'northernillinois': 'northernillinois',
    'niu': 'northernillinois',
    'ohio': 'ohio',
    'toledo': 'toledo',
    'westernmichigan': 'westernmichigan',
    'wmu': 'westernmichigan'
  };
  
  return mapping[normalizedName] || normalizedName;
};

// Function to parse W-L-T format and calculate winning percentage
const parseRecord = (recordStr: string): { wins: number; losses: number; ties: number; winningPercentage: number } => {
  // Handle empty records or null values
  if (!recordStr || recordStr === 'N/A' || recordStr === '-') {
    return { wins: 0, losses: 0, ties: 0, winningPercentage: 0 };
  }
  
  // Split the record string (e.g., "8-0-3") into wins, losses, and ties
  const parts = recordStr.split('-');
  
  // Handle variations in record format
  let wins = 0;
  let losses = 0;
  let ties = 0;
  
  if (parts.length >= 1) wins = parseInt(parts[0], 10) || 0;
  if (parts.length >= 2) losses = parseInt(parts[1], 10) || 0;
  if (parts.length >= 3) ties = parseInt(parts[2], 10) || 0;
  
  // Calculate winning percentage (wins + 0.5 * ties) / (wins + losses + ties)
  const totalGames = wins + losses + ties;
  const winningPercentage = totalGames > 0 ? (wins + 0.5 * ties) / totalGames : 0;
  
  return { wins, losses, ties, winningPercentage };
};

/**
 * Scrapes women's soccer standings directly from the MAC website
 */
export const scrapeWomensSoccerStandings = async (): Promise<StandingsEntry[]> => {
  try {
    // Add user agent to avoid being blocked
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    // Fetch the HTML from the MAC website
    const response = await axios.get('https://getsomemaction.com/standings.aspx?path=wsoc', { headers });
    const html = response.data;
    
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    
    // Find the standings table
    const table = $('.sidearm-standings-table, .sidearm-table');
    
    if (table.length === 0) {
      console.error('No standings table found on the MAC website');
      return [];
    }
    
    const entries: StandingsEntry[] = [];
    
    // Process each row in the table
    table.find('tbody tr').each((i, row) => {
      const cells = $(row).find('td');
      
      // Skip rows with insufficient cells
      if (cells.length < 8) return;
      
      // Get team name from the first cell
      let teamName = $(cells[0]).text().trim();
      
      // If there's a link in the cell, use that text instead
      const teamLink = $(cells[0]).find('a');
      if (teamLink.length > 0) {
        teamName = teamLink.text().trim();
      }
      
      if (!teamName) return; // Skip if no team name found
      
      // Map the team name to our schoolId
      const schoolId = mapTeamNameToSchoolId(teamName);
      
      // Extract record data
      // Expected column order: Team, Conference W-L-T, Conference %, Overall W-L-T, Overall %
      // But we'll also look for specific patterns in case columns change
      let confW = '', confL = '', confT = '';
      let overallW = '', overallL = '', overallT = '';
      let confPct = '', overallPct = '';
      
      // Try to extract direct W-L-T records first (exact column positions)
      const confRecordStr = $(cells[1]).text().trim();
      const overallRecordStr = $(cells[5]).text().trim();
      
      // Parse the conference and overall records
      const conference = parseRecord(confRecordStr);
      const overall = parseRecord(overallRecordStr);
      
      // Create the standings entry
      entries.push({
        id: `wsoc-${schoolId}`,
        schoolId,
        conference,
        overall,
        sportId: 'wsoc'
      });
    });
    
    // Sort the entries by conference winning percentage (descending)
    return entries.sort((a, b) => b.conference.winningPercentage - a.conference.winningPercentage);
    
  } catch (error) {
    console.error('Error scraping women\'s soccer standings:', error);
    return [];
  }
};