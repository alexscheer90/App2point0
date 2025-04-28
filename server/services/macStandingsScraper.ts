import axios from 'axios';
import * as cheerio from 'cheerio';
import { StandingsEntry } from '@shared/schema';

// Define the URL for women's soccer standings
const MAC_WSOC_STANDINGS_URL = 'https://getsomemaction.com/standings.aspx?path=wsoc';

// Interface for the scraped standings data before normalization
interface ScrapedStandingsRow {
  teamName: string;
  teamId: string;
  conferenceWins: number;
  conferenceLosses: number;
  conferenceTies: number;
  conferencePct: string;
  overallWins: number;
  overallLosses: number;
  overallTies: number;
  overallPct: string;
}

// Map MAC website team names to our app's team IDs
const teamNameToId: Record<string, string> = {
  'Akron': 'akron',
  'Ball State': 'ballstate',
  'Bowling Green': 'bowlinggreen',
  'Buffalo': 'buffalo',
  'Central Michigan': 'centralmichigan',
  'Eastern Michigan': 'easternmichigan',
  'Kent State': 'kentstate',
  'Miami': 'miamioh', 
  'Northern Illinois': 'northernillinois',
  'Ohio': 'ohio',
  'Toledo': 'toledo',
  'Western Michigan': 'westernmichigan'
};

/**
 * Fetches and parses women's soccer standings from the MAC website
 */
export async function fetchMacWomensSoccerStandings(): Promise<StandingsEntry[]> {
  try {
    console.log(`Fetching women's soccer standings from: ${MAC_WSOC_STANDINGS_URL}`);
    
    const response = await axios.get(MAC_WSOC_STANDINGS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Parse the HTML with cheerio
    const $ = cheerio.load(response.data);
    const standingsRows: ScrapedStandingsRow[] = [];
    
    // Find the standings table - using the class that appears in the MAC website
    const standingsTable = $('.standings-table');
    
    // Verify we found the table
    if (standingsTable.length === 0) {
      console.error('Could not find women\'s soccer standings table on MAC website');
      return [];
    }
    
    console.log('Found women\'s soccer standings table on MAC website');
    
    // Process each row in the table (skipping the header row)
    standingsTable.find('tbody tr').each((index, element) => {
      const cells = $(element).find('td');
      
      // Skip if not enough cells or it's not a team row
      if (cells.length < 9) return;
      
      // Extract team name from the first cell
      const teamNameCell = $(cells[0]);
      const teamNameText = teamNameCell.text().trim();
      
      // Check if this team is one of our tracked MAC schools
      const teamId = teamNameToId[teamNameText];
      if (!teamId) {
        console.log(`Skipping non-MAC team: ${teamNameText}`);
        return;
      }
      
      // Parse record values
      // Column order from MAC website: Team, Conference W, L, T, Pct, Overall W, L, T, Pct
      const confW = parseInt($(cells[1]).text().trim(), 10) || 0;
      const confL = parseInt($(cells[2]).text().trim(), 10) || 0;
      const confT = parseInt($(cells[3]).text().trim(), 10) || 0;
      const confPct = $(cells[4]).text().trim();
      
      const overallW = parseInt($(cells[5]).text().trim(), 10) || 0;
      const overallL = parseInt($(cells[6]).text().trim(), 10) || 0;
      const overallT = parseInt($(cells[7]).text().trim(), 10) || 0;
      const overallPct = $(cells[8]).text().trim();
      
      standingsRows.push({
        teamName: teamNameText,
        teamId,
        conferenceWins: confW,
        conferenceLosses: confL,
        conferenceTies: confT,
        conferencePct: confPct,
        overallWins: overallW,
        overallLosses: overallL, 
        overallTies: overallT,
        overallPct: overallPct
      });
    });
    
    console.log(`Scraped ${standingsRows.length} women's soccer teams from MAC website`);
    
    // Convert to app's StandingsEntry format, matching the schema
    const standingsEntries: StandingsEntry[] = standingsRows.map(row => {
      // Calculate winning percentages for consistency
      const confTotal = row.conferenceWins + row.conferenceLosses + row.conferenceTies;
      const confPct = confTotal > 0 ? (row.conferenceWins + 0.5 * row.conferenceTies) / confTotal : 0;
      
      const overallTotal = row.overallWins + row.overallLosses + row.overallTies;
      const overallPct = overallTotal > 0 ? (row.overallWins + 0.5 * row.overallTies) / overallTotal : 0;
      
      return {
        id: `wsoc-${row.teamId}`,
        schoolId: row.teamId,
        sportId: 'wsoc',
        conference: {
          wins: row.conferenceWins,
          losses: row.conferenceLosses,
          ties: row.conferenceTies,
          winningPercentage: Number(confPct.toFixed(3))
        },
        overall: {
          wins: row.overallWins,
          losses: row.overallLosses,
          ties: row.overallTies,
          winningPercentage: Number(overallPct.toFixed(3))
        }
      };
    });
    
    // Sort by conference winning percentage (descending)
    return standingsEntries.sort((a, b) => {
      // Sort by percentage (descending)
      if (a.conference.winningPercentage > b.conference.winningPercentage) return -1;
      if (a.conference.winningPercentage < b.conference.winningPercentage) return 1;
      
      // If percentages are tied, use total conference wins as tiebreaker
      return b.conference.wins - a.conference.wins;
    });
    
  } catch (error) {
    console.error('Error fetching MAC women\'s soccer standings:', error);
    return [];
  }
}

/**
 * Calculate winning percentage from a W-L-T record
 * Using the standard formula: (W + 0.5*T) / (W + L + T)
 */
function calculateWinPercentage(wins: number, losses: number, ties: number): number {
  const totalGames = wins + losses + ties;
  if (totalGames === 0) return 0;
  
  return (wins + 0.5 * ties) / totalGames;
}

/**
 * Fetch MAC standings based on sport ID
 */
export async function fetchMacStandingsBySport(sportId: string): Promise<StandingsEntry[]> {
  // Currently only supporting women's soccer - can be expanded in the future
  if (sportId === 'wsoc' || sportId === 'wsoccer') {
    return fetchMacWomensSoccerStandings();
  }
  
  // Return empty array for unsupported sports
  console.log(`MAC standings scraper does not support sport: ${sportId}`);
  return [];
}