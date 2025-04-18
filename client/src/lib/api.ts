import { apiRequest } from "./queryClient";
import { Game, NewsItem, School, Sport, StandingsEntry, Rivalry, SchoolSound, LocalEats } from "@shared/schema";
import { macSchools } from "../data/macSchools";
import { macSports } from "../data/macSports";
import { macRivalries } from "../data/macRivalries";
import { macSchoolSounds } from "../data/macSchoolSounds";
import { macLocalEats } from "../data/macLocalEats";
import { scrapeStandingsForSport } from "../services/standingsScraper";
import { fetchSchoolNewsFeed, fetchAllSchoolsNews, schoolFeedUrls } from "../services/newsFeedParser";

// User preferences
export async function getFavoriteSchool() {
  const res = await apiRequest("GET", "/api/preferences/favorite-school");
  return res.json();
}

export async function setFavoriteSchool(schoolId: string | null) {
  const res = await apiRequest("POST", "/api/preferences/favorite-school", {
    favoriteSchool: schoolId,
  });
  return res.json();
}

// Mock API functions - In a real app, these would call real endpoints
// Schools API
export async function getSchools(): Promise<School[]> {
  // For demo, return hardcoded data
  return macSchools;
}

export async function getSchool(id: string): Promise<School | undefined> {
  return macSchools.find(school => school.id === id);
}

// Sports API
export async function getSports(): Promise<Sport[]> {
  // For demo, return hardcoded data
  return macSports;
}

// Rivalries API
export async function getRivalries(): Promise<Rivalry[]> {
  return macRivalries;
}

export async function getRivalry(id: string): Promise<Rivalry | undefined> {
  return macRivalries.find(rivalry => rivalry.id === id);
}

export async function getSchoolRivalries(schoolId: string): Promise<Rivalry[]> {
  return macRivalries.filter(rivalry => 
    rivalry.team1Id === schoolId || rivalry.team2Id === schoolId
  );
}

// School Sounds API
export async function getSchoolSounds(schoolId: string): Promise<SchoolSound[]> {
  // If no schoolId is provided, return all sounds
  if (!schoolId) {
    return macSchoolSounds;
  }
  return macSchoolSounds.filter(sound => sound.schoolId === schoolId);
}

export async function getSchoolSound(id: string): Promise<SchoolSound | undefined> {
  return macSchoolSounds.find(sound => sound.id === id);
}

export async function getSchoolSoundsByType(schoolId: string, type: "fight_song" | "alma_mater"): Promise<SchoolSound[]> {
  // If no schoolId is provided, return all sounds of the specified type
  if (!schoolId) {
    return macSchoolSounds.filter(sound => sound.type === type);
  }
  return macSchoolSounds.filter(sound => 
    sound.schoolId === schoolId && sound.type === type
  );
}

// Local Eats API
export async function getLocalEats(schoolId: string): Promise<LocalEats[]> {
  // If no schoolId is provided, return all restaurants
  if (!schoolId) {
    return macLocalEats;
  }
  return macLocalEats.filter(restaurant => restaurant.schoolId === schoolId);
}

export async function getLocalEat(id: string): Promise<LocalEats | undefined> {
  return macLocalEats.find(restaurant => restaurant.id === id);
}

// Import the live score service
import { getTodaysGames, fetchAllLiveGames } from "../services/liveScoreService";

// Games API - Uses real-time data along with upcoming and recent games
export async function getGames(sportId?: string): Promise<Game[]> {
  // Generate date references for game scheduling
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  
  // Initialize arrays for different game types
  let liveGames: Game[] = [];
  let upcomingGames: Game[] = [];
  let recentGames: Game[] = [];
  
  try {
    // Try to get real-time games that are happening today
    console.log("Fetching today's games with real-time data...");
    const todaysGames = await getTodaysGames();
    
    // If we got games, add them to our live games list
    if (todaysGames.length > 0) {
      console.log(`Found ${todaysGames.length} games happening today!`);
      liveGames = todaysGames;
    }
  } catch (error) {
    console.error("Error fetching real-time games:", error);
  }
  
  // Add some upcoming scheduled games (these would come from a real API in production)
  upcomingGames = [
    // Tomorrow's games
    {
      id: "game3",
      sportId: "baseball",
      homeTeamId: "miamioh",
      awayTeamId: "ballstate",
      startTime: tomorrow.toISOString(),
      scheduledTime: tomorrow.toISOString(),
      status: "scheduled" as const,
      venue: "McKie Field at Hayden Park, Oxford OH",
      location: "McKie Field at Hayden Park, Oxford OH",
      homeTeamScore: 0,
      awayTeamScore: 0,
      homeScore: 0,
      awayScore: 0,
    },
    {
      id: "game4",
      sportId: "softball",
      homeTeamId: "akron",
      awayTeamId: "northernillinois",
      startTime: tomorrow.toISOString(),
      scheduledTime: tomorrow.toISOString(),
      status: "scheduled" as const,
      venue: "Lee R. Jackson Field, Akron OH",
      location: "Lee R. Jackson Field, Akron OH",
      homeTeamScore: 0,
      awayTeamScore: 0,
      homeScore: 0,
      awayScore: 0,
    },
    {
      id: "game7",
      sportId: "mbball", 
      homeTeamId: "kentstate",
      awayTeamId: "easternmichigan",
      startTime: new Date(tomorrow.getTime() + 3600000 * 3).toISOString(), // 3pm tomorrow
      scheduledTime: new Date(tomorrow.getTime() + 3600000 * 3).toISOString(),
      status: "scheduled" as const,
      venue: "Memorial Athletic and Convocation Center, Kent OH",
      location: "Memorial Athletic and Convocation Center, Kent OH", 
      homeTeamScore: 0,
      awayTeamScore: 0,
      homeScore: 0,
      awayScore: 0,
    }
  ];
  
  // Add some recently completed games
  recentGames = [
    // Yesterday's games
    {
      id: "game5",
      sportId: "baseball",
      homeTeamId: "westernmichigan",
      awayTeamId: "centralmichigan",
      homeTeamScore: 5,
      awayTeamScore: 3,
      startTime: yesterday.toISOString(),
      scheduledTime: yesterday.toISOString(),
      status: "final" as const,
      location: "Hyames Field, Kalamazoo MI",
      homeScore: 5,
      awayScore: 3,
    },
    {
      id: "game6",
      sportId: "msoc",
      homeTeamId: "easternmichigan",
      awayTeamId: "buffalo",
      homeTeamScore: 1,
      awayTeamScore: 2,
      startTime: yesterday.toISOString(),
      scheduledTime: yesterday.toISOString(),
      status: "final" as const,
      location: "Scicluna Field, Ypsilanti MI",
      homeScore: 1,
      awayScore: 2,
    },
    {
      id: "game8",
      sportId: "wbball",
      homeTeamId: "bowlinggreen",
      awayTeamId: "buffalo",
      homeTeamScore: 78,
      awayTeamScore: 72,
      startTime: yesterday.toISOString(),
      scheduledTime: yesterday.toISOString(),
      status: "final" as const,
      location: "Stroh Center, Bowling Green OH",
      homeScore: 78,
      awayScore: 72,
    }
  ];
  
  // If live games list is still empty, add a couple of mock live games
  if (liveGames.length === 0) {
    console.log("No live games found from API, adding mock live games");
    
    liveGames = [
      // Live games happening NOW
      {
        id: "game1",
        sportId: "mbball",
        homeTeamId: "toledo",
        awayTeamId: "bowlinggreen",
        homeTeamScore: 64,
        awayTeamScore: 58,
        startTime: now.toISOString(),
        scheduledTime: now.toISOString(),
        status: "live" as const,
        period: 2,
        clock: "4:22",
        situation: "Toledo timeout • Under 5 TV timeout",
        location: "Savage Arena, Toledo OH",
        homeScore: 64,
        awayScore: 58,
        liveStatsUrl: "https://utrockets.com/sidearmstats/mbball/summary",
      },
      {
        id: "game2",
        sportId: "wbball",
        homeTeamId: "ohio",
        awayTeamId: "kentstate",
        homeTeamScore: 56,
        awayTeamScore: 42,
        startTime: now.toISOString(),
        scheduledTime: now.toISOString(),
        status: "live" as const,
        period: 3,
        clock: "1:56",
        situation: "3rd Quarter • Kent St. possession",
        location: "Convocation Center, Athens OH",
        homeScore: 56,
        awayScore: 42,
        liveStatsUrl: "https://ohiobobcats.com/sidearmstats/wbball/summary",
      }
    ];
  }
  
  // Combine all games into a single array
  const allGames = [...liveGames, ...upcomingGames, ...recentGames];
  
  // Filter by sport if needed
  if (sportId && sportId !== "all") {
    return allGames.filter(game => game.sportId === sportId);
  }
  
  return allGames;
}

export async function getSchoolGames(schoolId: string): Promise<Game[]> {
  const allGames = await getGames();
  return allGames.filter(game => 
    game.homeTeamId === schoolId || game.awayTeamId === schoolId
  );
}

// News API - Real RSS Feed Implementation
export async function getNews(schoolId?: string): Promise<NewsItem[]> {
  try {
    console.log(`Fetching news for school: ${schoolId || 'all'}`);
    
    // Attempt to fetch real news from RSS feeds
    if (schoolId && schoolId !== "all" && schoolFeedUrls[schoolId]) {
      // Get news from a specific school's RSS feed
      return await fetchSchoolNewsFeed(schoolId, schoolFeedUrls[schoolId]);
    } else if (schoolId === "all" || !schoolId) {
      // Get news from all schools with configured RSS feeds
      return await fetchAllSchoolsNews();
    }
    
    // If we reach here, no RSS feed is configured for this school
    console.warn(`No RSS feed configured for school: ${schoolId}`);
    
    // Fallback to mock data for schools without RSS feeds
    // This ensures we have something to display even if RSS isn't available
    const now = new Date();
    
    // For Toledo, we should never reach here as we've configured its RSS feed
    if (schoolId === "toledo") {
      return [];
    }
    
    // Return an empty array for now - in production we'd have mock data for all schools
    return [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

// Standings API - Implementation using real data from Google Sheets
export async function getStandings(sportId: string): Promise<StandingsEntry[]> {
  try {
    console.log(`Fetching standings for: ${sportId}`);
    
    // Try to get standings from our Google Sheets API endpoint
    const response = await apiRequest("GET", `/api/sheets/standings/${sportId}`);
    const result = await response.json();
    
    if (result.success && result.data && Array.isArray(result.data)) {
      console.log(`Successfully fetched ${result.data.length} standings entries from Google Sheets`);
      return result.data;
    }
    
    // If Google Sheets fetch failed, fall back to scraper
    console.log("Google Sheets data not available, falling back to scraper");
    const sport = macSports.find(s => s.id === sportId);
    
    if (!sport) {
      console.error(`Sport with ID ${sportId} not found`);
      return [];
    }
    
    if (!sport.officialUrl) {
      console.error(`No official URL found for sport ${sportId}`);
      return [];
    }
    
    // Use the scraper to get real-time data as a backup
    const standings = await scrapeStandingsForSport(sport);
    
    // If we got real data, return it
    if (standings.length > 0) {
      return standings;
    }
    
    // If all methods failed, return empty array
    console.error(`Failed to fetch standings for ${sportId} from all sources`);
    return [];
  } catch (error) {
    console.error(`Error fetching standings for ${sportId}:`, error);
    return [];
  }
}

// Get all standings for a specific school
export async function getSchoolStandings(schoolId: string): Promise<{ sportId: string, entries: StandingsEntry[] }[]> {
  const sports = ["football", "mbball", "baseball"];
  const results = [];
  
  for (const sport of sports) {
    const allStandings = await getStandings(sport);
    
    // Since MAC no longer has divisions, we include all standings when viewing a school
    // Just return all standings - the filter is a no-op since `|| true` will always be true
    const filteredStandings = allStandings;
    
    if (filteredStandings.length > 0) {
      results.push({
        sportId: sport,
        entries: filteredStandings
      });
    }
  }
  
  return results;
}
