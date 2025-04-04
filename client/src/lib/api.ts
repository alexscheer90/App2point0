import { apiRequest } from "./queryClient";
import { Game, NewsItem, School, Sport, StandingsEntry, Rivalry, SchoolSound, LocalEats } from "@shared/schema";
import { macSchools } from "../data/macSchools";
import { macSports } from "../data/macSports";
import { macRivalries } from "../data/macRivalries";
import { macSchoolSounds } from "../data/macSchoolSounds";
import { macLocalEats } from "../data/macLocalEats";
import { scrapeStandingsForSport } from "../services/standingsScraper";

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

// News API - Mock implementation
export async function getNews(schoolId?: string): Promise<NewsItem[]> {
  // Generate some mock news items
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);
  
  const mockNews: NewsItem[] = [
    {
      id: "news1",
      schoolId: "toledo",
      title: "Toledo Rockets Clinch MAC West Division with Perfect Record",
      summary: "The Rockets continue their winning streak, securing first place with a dominant performance against Western Michigan.",
      content: "TOLEDO, OH - The Toledo Rockets have officially clinched the MAC West Division title with their eighth consecutive victory, continuing their perfect season. In a dominant display against Western Michigan on Saturday, the Rockets showcased why they've been the team to beat in the conference this year.\n\nHead Coach Jason Candle praised his team's performance, stating, \"These players have worked incredibly hard all season, and they deserve this achievement. But we're not done yet - we've got our sights set on the MAC Championship.\"\n\nQuarterback Dequan Finn completed 18 of 24 passes for 285 yards and three touchdowns in the victory. The Rockets defense also showed up, holding Western Michigan to just 14 points and forcing three turnovers.\n\nWith the division title locked up, Toledo now prepares for their final regular season games before the MAC Championship game in Detroit on December 3rd.",
      imageUrl: "https://as1.ftcdn.net/v2/jpg/02/19/55/80/1000_F_219558039_bV25HgXWXVOcKdA6Yl3RpGN5AMkbZ9cN.jpg",
      publishedAt: now.toISOString(),
    },
    {
      id: "news2",
      schoolId: "buffalo",
      title: "Buffalo Men's Basketball Adds Five-Star Recruit for 2023",
      summary: "The Bulls strengthen their roster with a top national recruit expected to make immediate impact.",
      content: "BUFFALO, NY - The University at Buffalo men's basketball program received a major boost today with the announcement that five-star recruit Marcus Johnson has committed to join the Bulls for the 2023-24 season.\n\nJohnson, a 6'7\" forward from Rochester, NY, is ranked among the top 25 players nationally in his class and chose Buffalo over offers from several Power Five programs. This represents one of the highest-rated recruits in MAC history.\n\n\"We're thrilled to welcome Marcus to our Buffalo family,\" said Bulls head coach Jim Whitesell. \"He's not only an exceptional talent but a high-character young man who will represent our university well both on and off the court.\"\n\nJohnson averaged 24.6 points, 11.3 rebounds, and 4.2 assists per game as a junior at East High School last season.",
      imageUrl: "https://as2.ftcdn.net/v2/jpg/00/46/76/29/1000_F_46762975_d8QzlIBcNBgfT1vLJ0n9cEiB5HcKGJXh.jpg",
      publishedAt: yesterday.toISOString(),
    },
    {
      id: "news3",
      schoolId: "ohio",
      title: "Ohio Women's Soccer Coach Wins MAC Coach of the Year",
      summary: "After leading the Bobcats to their best season in program history, Coach Williams receives top conference honor.",
      content: "ATHENS, OH - Ohio University women's soccer head coach Aaron Williams has been named the Mid-American Conference Coach of the Year after guiding the Bobcats to their most successful season in program history.\n\nIn just his third season at the helm, Williams led Ohio to a 15-2-1 regular season record and the program's first MAC regular season championship since 2004. Under his leadership, the Bobcats also set a school record with 11 consecutive victories.\n\n\"This award is a reflection of our entire program - the players, the assistant coaches, and the support staff,\" Williams said. \"I'm fortunate to work with an amazing group of student-athletes who have bought into our vision and put in the work every day.\"\n\nWilliams has compiled a 41-15-6 record since taking over the program, transforming the Bobcats into a conference powerhouse.",
      imageUrl: "https://as1.ftcdn.net/v2/jpg/05/09/08/46/1000_F_509084671_Pprh63KuCCT7CrWSY11hY9ioZrzkHpNE.jpg",
      publishedAt: yesterday.toISOString(),
    },
    {
      id: "news4",
      schoolId: "ballstate",
      title: "Ball State Baseball Breaks Home Run Record in Win Against CMU",
      summary: "Cardinals shatter single-season home run record with still three weeks left in regular season play.",
      content: "MUNCIE, IN - The Ball State Cardinals baseball team made history yesterday, breaking the program's single-season home run record in impressive fashion during their 12-5 victory over Central Michigan.\n\nWith three home runs in yesterday's game, the Cardinals have now hit 87 home runs this season, surpassing the previous record of 85 set in 2009. What makes the achievement even more remarkable is that the team still has nine regular season games remaining.\n\n\"This group has tremendous power from top to bottom in the lineup,\" said Ball State head coach Rich Maloney. \"But what I'm most proud of is that we're not just swinging for the fences - we're putting together quality at-bats and playing complete baseball.\"\n\nSenior outfielder Zach Cole, who hit his team-leading 16th homer in the game, added, \"It's special to be part of history, but we have bigger goals ahead. We want to win the MAC tournament and make a run in the NCAA regionals.\"",
      imageUrl: "https://as2.ftcdn.net/v2/jpg/00/91/44/31/1000_F_91443184_SY6XJwd7Qmopttx7IHFpKXD1rjR2kErq.jpg",
      publishedAt: twoDaysAgo.toISOString(),
    },
  ];
  
  // Filter by school if needed
  if (schoolId && schoolId !== "all") {
    return mockNews.filter(news => news.schoolId === schoolId);
  }
  
  return mockNews;
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
