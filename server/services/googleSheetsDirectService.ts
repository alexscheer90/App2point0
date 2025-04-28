import { google, sheets_v4 } from 'googleapis';
import { StandingsEntry } from '@shared/schema';

/**
 * Service to directly access Google Sheets data using the Google Sheets API
 */
export class GoogleSheetsDirectService {
  private readonly spreadsheetId = '1Vq8UJKIJeuIxVBwYKOlFvZY2ITrApOvgMKhgjvoCmTs';
  private readonly sheets: sheets_v4.Sheets;
  
  // Mapping of sport IDs to their corresponding tab names in the Google Sheet
  private readonly sportTabNames: Record<string, string> = {
    'baseball': 'Baseball',
    'mbball': 'Men\'s Basketball',
    'football': 'Football',
    'mtennis': 'Men\'s Tennis',
    'wrestling': 'Wrestling',
    'wbball': 'Women\'s Basketball',
    'field-hockey': 'Field Hockey',
    'gymnastics': 'Gymnastics',
    'wlacrosse': 'Women\'s Lacrosse',
    'wlax': 'Women\'s Lacrosse', // Alias for Women's Lacrosse
    'wsoc': 'Women\'s Soccer',
    'wsoccer': 'Women\'s Soccer', // Alias for Women's Soccer
    'softball': 'Softball',
    'wtennis': 'Women\'s Tennis',
    'volleyball': 'Volleyball',
    'wvball': 'Volleyball' // Alias for Volleyball
  };
  
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
    'broncos': 'westernmichigan',
    // Add affiliate schools
    'james madison': 'jmu',
    'jamesmadison': 'jmu',
    'jmu': 'jmu',
    'dukes': 'jmu',
    'app state': 'appstate',
    'appalachian state': 'appstate',
    'appalachian': 'appstate',
    'mountaineers': 'appstate',
    'longwood': 'longwood',
    'lancers': 'longwood',
    'bellarmine': 'bellarmine',
    'knights': 'bellarmine',
    'chicago state': 'chicagostate',
    'chicago state university': 'chicagostate',
    'siu edwardsville': 'siuedwardsville',
    'siue': 'siuedwardsville',
    'lock haven': 'lockhaven',
    'george mason': 'georgemason',
    'gmu': 'georgemason',
    'rider': 'rider',
    'edinboro': 'edinboro',
    'cleveland state': 'clevelandstate',
    'csu': 'clevelandstate',
    'clarion': 'clarion',
    'bloomsburg': 'bloomsburg',
    'youngstown state': 'youngstownstate',
    'youngstown': 'youngstownstate',
    'detroit mercy': 'detroitmercy',
    'detroit': 'detroitmercy',
    'robert morris': 'robertmorris'
  };

  constructor() {
    // Initialize Google Sheets API client
    this.sheets = google.sheets({ version: 'v4', auth: this.getAuth() });
  }

  /**
   * Get the auth client for accessing Google Sheets
   * In a real implementation, this would use OAuth2 or service account
   */
  private getAuth() {
    // For development, we're using API key authentication
    // In production, you would use OAuth2 or a service account
    // This is a placeholder - we would need actual credentials in production
    return process.env.GOOGLE_API_KEY || '';
  }

  /**
   * Fetch standings data for a specific sport from Google Sheets
   * 
   * @param sportId The sport ID to fetch standings for
   * @returns Array of standings entries
   */
  async fetchStandings(sportId: string): Promise<StandingsEntry[]> {
    try {
      // Get the sheet name for this sport
      const sheetName = this.sportTabNames[sportId];
      if (!sheetName) {
        console.warn(`No sheet name mapping found for sport ID: ${sportId}`);
        return [];
      }

      console.log(`Fetching standings for ${sportId} from Google Sheet tab "${sheetName}"`);

      // Check if we have API credentials before proceeding
      if (!this.getAuth()) {
        console.warn('No Google API key available. Cannot fetch from Google Sheets');
        return [];
      }

      // Get all data from the sheet
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:J` // Get columns A through J
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.warn(`No data found in sheet: ${sheetName}`);
        return [];
      }

      // Process the data into standings entries
      return this.processSheetData(rows, sportId);
    } catch (error) {
      console.error(`Error fetching ${sportId} standings from Google Sheets:`, error);
      return [];
    }
  }

  /**
   * Process Google Sheet data into StandingsEntry objects
   * 
   * @param data The raw data from Google Sheets
   * @param sportId The sport ID for these standings
   * @returns Array of standings entries
   */
  private processSheetData(data: any[][], sportId: string): StandingsEntry[] {
    // Skip the header row
    const rows = data.slice(1);
    const standings: StandingsEntry[] = [];

    // Get the column indexes based on the sport
    const schoolCol = 0; // Column A is always the school name
    let confRecordCol = 3; // Column D is usually the conference record
    
    // Based on the sport, get the specific columns needed
    if (sportId === 'wsoc' || sportId === 'wsoccer') {
      // Women's soccer has a different structure with points and goals
      for (const row of rows) {
        try {
          const schoolName = row[schoolCol]?.toString() || '';
          if (!schoolName) continue;
          
          // Clean the school name and get the schoolId
          const cleanedName = schoolName.toLowerCase().trim();
          const schoolId = this.getSchoolId(cleanedName);
          
          if (!schoolId) {
            console.warn(`Could not determine school ID for: ${schoolName}`);
            continue;
          }
          
          // Get values from the row
          const confRecord = row[confRecordCol]?.toString() || '0-0-0';
          const points = row[6]?.toString() || '0'; // Column G - Points
          
          // Extract W-L-T from the conference record
          const [confWins, confLosses, confTies] = this.parseRecord(confRecord);
          
          // Create the standings entry with the conference record only
          standings.push({
            id: `${sportId}-${schoolId}`,
            schoolId,
            schoolName,
            sportId,
            confWins,
            confLosses,
            confTies,
            confWinPercentage: this.calculateWinPercentage(confWins, confLosses, confTies),
            points: parseInt(points) || 0,
            // Don't include overall records as per requirement
            overallWins: 0,
            overallLosses: 0,
            overallTies: 0,
            overallWinPercentage: 0,
            division: '', // Women's soccer doesn't use divisions
            notes: ''
          });
        } catch (error) {
          console.error(`Error processing row for ${sportId}:`, error);
        }
      }
    } else if (sportId === 'wrestling') {
      // Wrestling has divisions in column C
      for (const row of rows) {
        try {
          const schoolName = row[schoolCol]?.toString() || '';
          if (!schoolName) continue;
          
          // Clean the school name and get the schoolId
          const cleanedName = schoolName.toLowerCase().trim();
          const schoolId = this.getSchoolId(cleanedName);
          
          if (!schoolId) {
            console.warn(`Could not determine school ID for: ${schoolName}`);
            continue;
          }
          
          // Get values from the row
          const division = row[2]?.toString() || ''; // Column C - Division
          const confRecord = row[confRecordCol]?.toString() || '0-0';
          
          // Extract W-L from the conference record
          const [confWins, confLosses, confTies] = this.parseRecord(confRecord);
          
          // Create the standings entry with the conference record only
          standings.push({
            id: `${sportId}-${schoolId}`,
            schoolId,
            schoolName,
            sportId,
            confWins,
            confLosses,
            confTies,
            confWinPercentage: this.calculateWinPercentage(confWins, confLosses, confTies),
            // Don't include overall records as per requirement
            overallWins: 0,
            overallLosses: 0,
            overallTies: 0,
            overallWinPercentage: 0,
            division, // Include division for wrestling
            notes: ''
          });
        } catch (error) {
          console.error(`Error processing row for ${sportId}:`, error);
        }
      }
    } else {
      // Default processing for most sports
      for (const row of rows) {
        try {
          const schoolName = row[schoolCol]?.toString() || '';
          if (!schoolName) continue;
          
          // Clean the school name and get the schoolId
          const cleanedName = schoolName.toLowerCase().trim();
          const schoolId = this.getSchoolId(cleanedName);
          
          if (!schoolId) {
            console.warn(`Could not determine school ID for: ${schoolName}`);
            continue;
          }
          
          // Get values from the row
          const confRecord = row[confRecordCol]?.toString() || '0-0';
          
          // Extract W-L from the conference record
          const [confWins, confLosses, confTies] = this.parseRecord(confRecord);
          
          // Create the standings entry with the conference record only
          standings.push({
            id: `${sportId}-${schoolId}`,
            schoolId,
            schoolName,
            sportId,
            confWins,
            confLosses,
            confTies,
            confWinPercentage: this.calculateWinPercentage(confWins, confLosses, confTies),
            // Don't include overall records as per requirement
            overallWins: 0,
            overallLosses: 0,
            overallTies: 0,
            overallWinPercentage: 0,
            division: '', // Most sports don't use divisions
            notes: ''
          });
        } catch (error) {
          console.error(`Error processing row for ${sportId}:`, error);
        }
      }
    }

    // Sort standings by conf wins (descending), then conf losses (ascending)
    return standings.sort((a, b) => {
      // Sort by win % first (descending)
      if (b.confWinPercentage !== a.confWinPercentage) {
        return b.confWinPercentage - a.confWinPercentage;
      }
      
      // If win % is tied, sort by points (for sports that have points)
      if (a.points !== undefined && b.points !== undefined && a.points !== b.points) {
        return b.points - a.points;
      }

      // If still tied, sort by conf wins
      if (b.confWins !== a.confWins) {
        return b.confWins - a.confWins;
      }

      // If still tied, sort by conf losses
      return a.confLosses - b.confLosses;
    });
  }

  /**
   * Parse a record string (e.g. "5-3-1") into wins, losses, and ties
   * 
   * @param record Record string in format "W-L" or "W-L-T"
   * @returns Array of [wins, losses, ties]
   */
  private parseRecord(record: string): [number, number, number] {
    if (!record) return [0, 0, 0];
    
    // Remove any extra whitespace and split on hyphens
    const parts = record.trim().split('-').map(p => p.trim());
    
    const wins = parseInt(parts[0]) || 0;
    const losses = parseInt(parts[1]) || 0;
    const ties = parts.length > 2 ? (parseInt(parts[2]) || 0) : 0;
    
    return [wins, losses, ties];
  }

  /**
   * Calculate win percentage from wins, losses, and ties
   * 
   * @param wins Number of wins
   * @param losses Number of losses
   * @param ties Number of ties
   * @returns Win percentage as a number between 0 and 1
   */
  private calculateWinPercentage(wins: number, losses: number, ties: number): number {
    const total = wins + losses + ties;
    if (total === 0) return 0;
    
    // Win percentage calculation: (wins + (ties * 0.5)) / total
    return Number(((wins + (ties * 0.5)) / total).toFixed(3));
  }

  /**
   * Get the standard school ID from a school name
   * 
   * @param schoolName The school name to convert to ID
   * @returns The standard school ID
   */
  private getSchoolId(schoolName: string): string {
    // First, try direct mapping
    const directMatch = this.schoolNameToId[schoolName.toLowerCase()];
    if (directMatch) return directMatch;
    
    // If no direct match, try looking for partial matches
    for (const [key, value] of Object.entries(this.schoolNameToId)) {
      if (schoolName.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    
    // If still no match, try to create a normalized ID from the name
    if (schoolName) {
      // Remove special characters, replace spaces with nothing, and convert to lowercase
      return schoolName.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '');
    }
    
    return '';
  }
}

// Export a singleton instance
export const googleSheetsDirectService = new GoogleSheetsDirectService();