import { apiRequest } from "./queryClient";
import { Game, NewsItem, School, Sport, StandingsEntry, Rivalry, SchoolSound, LocalEats } from "@shared/schema";
import { macSchools } from "../data/macSchools";
import { macSports } from "../data/macSports";
import { macRivalries } from "../data/macRivalries";
import { macSchoolSounds } from "../data/macSchoolSounds";
import { macLocalEats } from "../data/macLocalEats";
import { scrapeStandingsForSport } from "../services/standingsScraper";
import { fetchSchoolNewsFeed, fetchAllSchoolsNews, schoolFeedUrls } from "../services/newsFeedParser";
import { fetchAllMacEvents } from "../services/scheduleFeedParser";
import { fetchMacCalendar } from "../services/icsParser";

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

// Games API - Real implementation using feed

export async function getGames(sportId?: string): Promise<Game[]> {
  try {
    // Try multiple data sources to get real game data
    console.log(`Fetching games for sport: ${sportId || 'all'}`);
    
    // First attempt: Try the MAC ICS calendar feed
    try {
      const realGames = await fetchMacCalendar(sportId || 'all');
      
      if (realGames && realGames.length > 0) {
        console.log(`Successfully fetched ${realGames.length} games from MAC calendar feed`);
        return realGames;
      } else {
        console.log("No games found in ICS feed or invalid format received");
      }
    } catch (icsError) {
      console.error("Error fetching from ICS calendar:", icsError);
    }
    
    // Second attempt: Try the RSS feed 
    try {
      console.log("Trying RSS feed as an alternative source");
      const rssGames = await fetchAllMacEvents(sportId || 'all');
      
      if (rssGames && rssGames.length > 0) {
        console.log(`Successfully fetched ${rssGames.length} games from MAC RSS feed`);
        return rssGames;
      } else {
        console.log("No games found in RSS feed or invalid format received");
      }
    } catch (rssError) {
      console.error("Error fetching from RSS feed:", rssError);
    }
    
    // If we reach here, we couldn't get any data from either source
    console.error("Failed to fetch game data from any source");
    
    // Instead of fake data, show an empty result set with proper message
    // The UI layer should handle this empty state appropriately
    return [];
    
  } catch (error) {
    console.error("Unexpected error fetching games:", error);
    return [];
  }
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
      const schoolNews = await fetchSchoolNewsFeed(schoolId, schoolFeedUrls[schoolId]);
      if (schoolNews && schoolNews.length > 0) {
        return schoolNews;
      } else {
        console.warn(`No news items found in RSS feed for school: ${schoolId}`);
      }
    } else if (schoolId === "all" || !schoolId) {
      // Get news from all schools with configured RSS feeds
      const allNews = await fetchAllSchoolsNews();
      if (allNews && allNews.length > 0) {
        return allNews;
      } else {
        console.warn("No news items found in any school RSS feeds");
      }
    } else {
      // If we reach here, no RSS feed is configured for this school
      console.warn(`No RSS feed configured for school: ${schoolId}`);
    }
    
    // Instead of using fake data, return an empty array with proper error handling in UI
    console.log("Returning empty news array - no real data available from RSS feeds");
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
