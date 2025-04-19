import { Game, School, Sport } from '@shared/schema';
import { macSchools } from '../data/macSchools';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetches current live games from Sidearm API for a specific school
 * 
 * @param school The MAC school to fetch games for
 * @returns List of live games currently in progress
 */
export async function fetchLiveGamesForSchool(school: School): Promise<Game[]> {
  // For now, return an empty array to simplify and avoid connection issues
  console.log(`Mock fetching live scores for: ${school.name}`);
  return [];
}

/**
 * Maps Sidearm sport names to our internal sport IDs
 */
function mapSidearmSportToMacSport(sidearmSport: string = ''): string {
  const sportMap: Record<string, string> = {
    'football': 'football',
    'mfball': 'football',
    'm-footbl': 'football',
    'football-m': 'football',
    
    'mens-basketball': 'mbball',
    'mbball': 'mbball',
    'm-baskbl': 'mbball',
    'basketball-m': 'mbball',
    'bball-m': 'mbball',
    
    'womens-basketball': 'wbball',
    'wbball': 'wbball',
    'w-baskbl': 'wbball',
    'basketball-w': 'wbball',
    'bball-w': 'wbball',
    
    'baseball': 'baseball',
    'mbase': 'baseball',
    'm-basebl': 'baseball',
    
    'softball': 'softball',
    'wsball': 'softball',
    'w-sball': 'softball',
    
    'volleyball': 'wvball',
    'wvball': 'wvball',
    'w-vball': 'wvball',
    'volleyball-w': 'wvball',
    
    'mens-soccer': 'msoc',
    'msoc': 'msoc',
    'm-soccer': 'msoc',
    'soccer-m': 'msoc',
    
    'womens-soccer': 'wsoc',
    'wsoc': 'wsoc',
    'w-soccer': 'wsoc',
    'soccer-w': 'wsoc',
  };
  
  const normalized = sidearmSport.trim().toLowerCase();
  
  return sportMap[normalized] || 'unknown';
}

/**
 * Generate a URL for live stats for a particular school and sport
 */
function generateLiveStatsUrl(school: School, sportId: string): string {
  if (!school.sidearmUrl) return '';
  
  // Format the sport ID to match Sidearm's format
  let sportPath = sportId;
  
  switch (sportId) {
    case "mbball":
      sportPath = "mbball";
      break;
    case "wbball":
      sportPath = "wbball";
      break;
    case "football":
      sportPath = "football";
      break;
    case "baseball":
      sportPath = "baseball";
      break;
    case "softball":
      sportPath = "softball";
      break;
    case "wvball":
      sportPath = "wvball";
      break;
    case "msoc":
      sportPath = "msoc";
      break;
    case "wsoc":
      sportPath = "wsoc";
      break;
  }
  
  const baseUrl = school.sidearmUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `https://${baseUrl}/sidearmstats/${sportPath}/summary`;
}

/**
 * Fetches all currently live games across all MAC schools
 * 
 * @returns List of all live games currently in progress across MAC
 */
export async function fetchAllLiveGames(): Promise<Game[]> {
  // Get all schools with Sidearm URLs
  const schoolsWithSidearm = macSchools.filter(school => 
    school.sidearmScoresApi && !school.affiliate);
  
  console.log(`Fetching live games from ${schoolsWithSidearm.length} schools with Sidearm APIs`);
  
  // For demo purposes, limit to just a few schools to avoid too many requests
  const schools = schoolsWithSidearm.slice(0, 5);
  
  // Fetch games from all schools
  const gamePromises = schools.map(school => fetchLiveGamesForSchool(school));
  const gamesArrays = await Promise.all(gamePromises);
  
  // Flatten the array of arrays and return
  return gamesArrays.flat();
}

/**
 * Gets today's games, including those scheduled for today
 * 
 * @returns List of games scheduled for today
 */
export async function getTodaysGames(): Promise<Game[]> {
  // Create today's date at the start and end of day
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  
  // Create live games and upcoming games
  // For demo and testing, we'll create a few games with the Sidearm schools
  // In production, this would make actual API calls to fetch scheduled games
  
  const liveGames: Game[] = [];
  
  // Use the schools with Sidearm URLs to create realistic games
  const bowlingGreen = macSchools.find(school => school.id === 'bowlinggreen')!;
  const toledo = macSchools.find(school => school.id === 'toledo')!;
  const ohio = macSchools.find(school => school.id === 'ohio')!;
  const miami = macSchools.find(school => school.id === 'miamioh')!;
  
  // Create a few live games
  const liveGame1: Game = {
    id: 'live-game-1',
    sportId: 'mbball',
    homeTeamId: bowlingGreen.id,
    awayTeamId: toledo.id,
    homeTeamScore: 62,
    awayTeamScore: 58,
    startTime: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), // Started 1 hour ago
    scheduledTime: today.toISOString(),
    status: 'live',
    period: 2,
    clock: '8:22',
    situation: 'BGSU ball • Under 8:30 timeout',
    venue: 'Stroh Center',
    location: 'Bowling Green, OH',
    liveStatsUrl: `https://bgsufalcons.com/sidearmstats/mbball/summary`,
    homeScore: 62,
    awayScore: 58,
  };
  
  const liveGame2: Game = {
    id: 'live-game-2',
    sportId: 'wbball',
    homeTeamId: ohio.id,
    awayTeamId: miami.id,
    homeTeamScore: 45,
    awayTeamScore: 41,
    startTime: new Date(now.getTime() - 45 * 60 * 1000).toISOString(), // Started 45 minutes ago
    scheduledTime: today.toISOString(),
    status: 'live',
    period: 3,
    clock: '2:38',
    situation: 'Miami ball • 2:38 remaining in 3rd quarter',
    venue: 'Convocation Center',
    location: 'Athens, OH',
    liveStatsUrl: `https://ohiobobcats.com/sidearmstats/wbball/summary`,
    homeScore: 45,
    awayScore: 41,
  };
  
  // Create some upcoming games for today
  const kentState = macSchools.find(school => school.id === 'kentstate')!;
  const akron = macSchools.find(school => school.id === 'akron')!;
  const ballState = macSchools.find(school => school.id === 'ballstate')!;
  const westernMichigan = macSchools.find(school => school.id === 'westernmichigan')!;
  const centralMichigan = macSchools.find(school => school.id === 'centralmichigan')!;
  const buffalo = macSchools.find(school => school.id === 'buffalo')!;
  
  // Create a few real-world upcoming games
  const upcomingGame1: Game = {
    id: 'upcoming-game-1',
    sportId: 'baseball',
    homeTeamId: kentState.id,
    awayTeamId: akron.id,
    homeTeamScore: 0,
    awayTeamScore: 0,
    startTime: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    scheduledTime: today.toISOString(),
    status: 'scheduled',
    venue: 'Schoonover Stadium',
    location: 'Kent, OH',
    homeScore: 0,
    awayScore: 0,
  };
  
  const upcomingGame2: Game = {
    id: 'upcoming-game-2',
    sportId: 'softball',
    homeTeamId: ballState.id,
    awayTeamId: westernMichigan.id,
    homeTeamScore: 0,
    awayTeamScore: 0,
    startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    scheduledTime: today.toISOString(),
    status: 'scheduled',
    venue: 'Softball Field at First Merchants Ballpark Complex',
    location: 'Muncie, IN',
    homeScore: 0,
    awayScore: 0,
  };
  
  const upcomingGame3: Game = {
    id: 'upcoming-game-3',
    sportId: 'wlax',
    homeTeamId: centralMichigan.id,
    awayTeamId: 'detroitmercy',
    homeTeamName: 'Central Michigan',
    awayTeamName: 'Detroit Mercy',
    homeTeamScore: 0,
    awayTeamScore: 0,
    startTime: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    scheduledTime: today.toISOString(),
    status: 'scheduled',
    venue: 'CMU Lacrosse Complex',
    location: 'Mount Pleasant, MI',
    homeScore: 0,
    awayScore: 0,
  };
  
  const upcomingGame4: Game = {
    id: 'upcoming-game-4',
    sportId: 'softball',
    homeTeamId: buffalo.id,
    awayTeamId: toledo.id,
    homeTeamScore: 0,
    awayTeamScore: 0,
    startTime: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    scheduledTime: today.toISOString(),
    status: 'scheduled',
    venue: 'Nan Harvey Field',
    location: 'Buffalo, NY',
    homeScore: 0,
    awayScore: 0,
  };
  
  // Add completed games for today
  const completedGame1: Game = {
    id: 'completed-game-1',
    sportId: 'baseball',
    homeTeamId: miami.id,
    awayTeamId: 'bellarmine',
    homeTeamName: 'Miami',
    awayTeamName: 'Bellarmine',
    homeTeamScore: 7,
    awayTeamScore: 3,
    startTime: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    scheduledTime: today.toISOString(),
    status: 'final',
    venue: 'McKie Field at Hayden Park',
    location: 'Oxford, OH',
    homeScore: 7,
    awayScore: 3,
  };
  
  const completedGame2: Game = {
    id: 'completed-game-2',
    sportId: 'mtennis',
    homeTeamId: bowlingGreen.id,
    awayTeamId: 'michigan',
    homeTeamName: 'Bowling Green',
    awayTeamName: 'Michigan',
    homeTeamScore: 1,
    awayTeamScore: 6,
    startTime: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    scheduledTime: today.toISOString(),
    status: 'final',
    venue: 'Keefe Courts',
    location: 'Bowling Green, OH',
    homeScore: 1,
    awayScore: 6,
  };
  
  // Add all games to our list
  liveGames.push(
    liveGame1, 
    liveGame2, 
    upcomingGame1, 
    upcomingGame2, 
    upcomingGame3, 
    upcomingGame4,
    completedGame1,
    completedGame2
  );
  
  // In a real implementation, we would fetch actual games from Sidearm APIs
  // For this demo, we're returning the mock games that match today's real date
  return liveGames;
}

/**
 * Connects to Sidearm APIs to fetch live scores data for display
 * 
 * @param school The MAC school to fetch scores for
 * @param sport The sport to fetch scores for
 * @returns Current score data if available
 */
export async function fetchLiveScore(school: School, sport: Sport): Promise<{ homeScore: number, awayScore: number, period: string, clock: string, situation: string } | null> {
  // This would connect to a real API in production
  console.log(`Mock fetching live score for ${school.name} ${sport.name}`);
  
  // Simple static data for demo purposes
  if (sport.id === 'mbball') {
    return {
      homeScore: 64,
      awayScore: 58,
      period: '2nd Half',
      clock: '4:22',
      situation: 'Home team timeout'
    };
  } else if (sport.id === 'wbball') {
    return {
      homeScore: 56,
      awayScore: 42,
      period: '3rd Quarter',
      clock: '1:56',
      situation: 'Away team possession'
    };
  } else if (sport.id === 'football') {
    return {
      homeScore: 21, 
      awayScore: 14,
      period: '3rd Quarter',
      clock: '8:45',
      situation: '2nd & 8 at the 35'
    };
  }
  
  // Default for other sports
  return {
    homeScore: 3,
    awayScore: 2,
    period: 'Current',
    clock: '15:00',
    situation: 'In play'
  };
}