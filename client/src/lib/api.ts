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
  return macSchoolSounds.filter(sound => sound.schoolId === schoolId);
}

export async function getSchoolSound(id: string): Promise<SchoolSound | undefined> {
  return macSchoolSounds.find(sound => sound.id === id);
}

export async function getSchoolSoundsByType(schoolId: string, type: "fight_song" | "alma_mater"): Promise<SchoolSound[]> {
  return macSchoolSounds.filter(sound => 
    sound.schoolId === schoolId && sound.type === type
  );
}

// Local Eats API
export async function getLocalEats(schoolId: string): Promise<LocalEats[]> {
  return macLocalEats.filter(restaurant => restaurant.schoolId === schoolId);
}

export async function getLocalEat(id: string): Promise<LocalEats | undefined> {
  return macLocalEats.find(restaurant => restaurant.id === id);
}

// Games API - Mock implementation
export async function getGames(sportId?: string): Promise<Game[]> {
  // Generate some mock games for demonstration
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  
  const mockGames: Game[] = [
    // Live games
    {
      id: "game1",
      sportId: "football",
      homeTeamId: "toledo",
      awayTeamId: "bowlinggreen",
      homeTeamScore: 24,
      awayTeamScore: 17,
      startTime: now.toISOString(),
      status: "live",
      period: "3rd QTR",
      situation: "Ball on 34 yard line • 3rd & 8",
    },
    {
      id: "game2",
      sportId: "wbasketball",
      homeTeamId: "ohio",
      awayTeamId: "kentstate",
      homeTeamScore: 56,
      awayTeamScore: 42,
      startTime: now.toISOString(),
      status: "live",
      period: "2nd Half",
      situation: "8:45 remaining • Ohio possession",
    },
    // Upcoming games
    {
      id: "game3",
      sportId: "football",
      homeTeamId: "miamioh",
      awayTeamId: "ballstate",
      startTime: tomorrow.toISOString(),
      status: "scheduled",
      venue: "Yager Stadium, Oxford OH",
    },
    {
      id: "game4",
      sportId: "basketball",
      homeTeamId: "akron",
      awayTeamId: "northernillinois",
      startTime: tomorrow.toISOString(),
      status: "scheduled",
      venue: "James A. Rhodes Arena, Akron OH",
    },
    // Completed games
    {
      id: "game5",
      sportId: "baseball",
      homeTeamId: "westernmichigan",
      awayTeamId: "centralmichigan",
      homeTeamScore: 5,
      awayTeamScore: 3,
      startTime: yesterday.toISOString(),
      status: "final",
    },
    {
      id: "game6",
      sportId: "football",
      homeTeamId: "easternmichigan",
      awayTeamId: "buffalo",
      homeTeamScore: 21,
      awayTeamScore: 28,
      startTime: yesterday.toISOString(),
      status: "final",
    },
  ];
  
  // Filter by sport if needed
  if (sportId && sportId !== "all") {
    return mockGames.filter(game => game.sportId === sportId);
  }
  
  return mockGames;
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

// Standings API - Implementation using real data from MAC website
export async function getStandings(sportId: string): Promise<StandingsEntry[]> {
  try {
    // Get the sport details
    const sport = macSports.find(s => s.id === sportId);
    
    if (!sport) {
      console.error(`Sport with ID ${sportId} not found`);
      return [];
    }
    
    if (!sport.officialUrl) {
      console.error(`No official URL found for sport ${sportId}`);
      return [];
    }
    
    // Use the scraper to get real-time data
    const standings = await scrapeStandingsForSport(sport);
    
    // If we got real data, return it
    if (standings.length > 0) {
      return standings;
    }
    
    // If scraping failed, return a placeholder message
    console.error(`Failed to scrape standings for ${sportId}`);
    return [];
  } catch (error) {
    console.error(`Error fetching standings for ${sportId}:`, error);
    return [];
  }
}

// Get all standings for a specific school
export async function getSchoolStandings(schoolId: string): Promise<{ sportId: string, entries: StandingsEntry[] }[]> {
  const sports = ["football", "basketball", "baseball"];
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
