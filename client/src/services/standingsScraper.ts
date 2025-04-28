import { StandingsEntry, Sport } from '@shared/schema';

/**
 * This function would normally scrape the official MAC website for standings data.
 * However, due to CORS limitations in the browser, it currently returns realistic mock data.
 * In a production environment, this would be implemented as a server-side API endpoint.
 * 
 * @param sport The sport to get standings for
 * @returns Promise containing standings entries
 */
export async function scrapeStandingsForSport(sport: Sport): Promise<StandingsEntry[]> {
  if (!sport.officialUrl) {
    console.error(`No official URL provided for sport: ${sport.name}`);
    return [];
  }

  try {
    console.log(`Fetching standings for: ${sport.name}`);
    
    // For demonstration purposes, we return realistic mock data based on the sport ID
    // In production, this would call a backend API endpoint that handles the web scraping
    return generateMockStandings(sport.id);
  } catch (error) {
    console.error(`Error getting standings for ${sport.name}:`, error);
    return [];
  }
}

/**
 * Generates realistic mock standings data for a specific sport
 * In a production environment, this would be replaced with actual scraped data
 */
function generateMockStandings(sportId: string): StandingsEntry[] {
  // The MAC schools that would appear in standings
  const schoolIds = [
    'akron', 'ballstate', 'bowlinggreen', 'buffalo', 
    'centralmichigan', 'easternmichigan', 'kentstate', 'miamioh',
    'northernillinois', 'ohio', 'toledo', 'westernmichigan'
  ];
  
  // Generate different standings for each sport type
  switch (sportId) {
    case 'football':
      return [
        {
          schoolId: 'toledo',
          sportId: 'football',
          conference: { wins: 8, losses: 0, winningPercentage: 1.000 },
          overall: { wins: 11, losses: 2, winningPercentage: 0.846 }
        },
        {
          schoolId: 'miamioh',
          sportId: 'football',
          conference: { wins: 7, losses: 1, winningPercentage: 0.875 },
          overall: { wins: 10, losses: 3, winningPercentage: 0.769 }
        },
        {
          schoolId: 'bowlinggreen',
          sportId: 'football',
          conference: { wins: 6, losses: 2, winningPercentage: 0.750 },
          overall: { wins: 8, losses: 4, winningPercentage: 0.667 }
        },
        {
          schoolId: 'northernillinois',
          sportId: 'football',
          conference: { wins: 5, losses: 3, winningPercentage: 0.625 },
          overall: { wins: 7, losses: 5, winningPercentage: 0.583 }
        },
        {
          schoolId: 'ohio',
          sportId: 'football',
          conference: { wins: 5, losses: 3, winningPercentage: 0.625 },
          overall: { wins: 9, losses: 3, winningPercentage: 0.750 }
        },
        {
          schoolId: 'easternmichigan',
          sportId: 'football',
          conference: { wins: 4, losses: 4, winningPercentage: 0.500 },
          overall: { wins: 6, losses: 6, winningPercentage: 0.500 }
        },
        {
          schoolId: 'westernmichigan',
          sportId: 'football',
          conference: { wins: 3, losses: 5, winningPercentage: 0.375 },
          overall: { wins: 4, losses: 8, winningPercentage: 0.333 }
        },
        {
          schoolId: 'buffalo',
          sportId: 'football',
          conference: { wins: 3, losses: 5, winningPercentage: 0.375 },
          overall: { wins: 3, losses: 9, winningPercentage: 0.250 }
        },
        {
          schoolId: 'centralmichigan',
          sportId: 'football',
          conference: { wins: 2, losses: 6, winningPercentage: 0.250 },
          overall: { wins: 4, losses: 8, winningPercentage: 0.333 }
        },
        {
          schoolId: 'ballstate',
          sportId: 'football',
          conference: { wins: 2, losses: 6, winningPercentage: 0.250 },
          overall: { wins: 4, losses: 8, winningPercentage: 0.333 }
        },
        {
          schoolId: 'akron',
          sportId: 'football',
          conference: { wins: 1, losses: 7, winningPercentage: 0.125 },
          overall: { wins: 2, losses: 10, winningPercentage: 0.167 }
        },
        {
          schoolId: 'kentstate',
          sportId: 'football',
          conference: { wins: 0, losses: 8, winningPercentage: 0.000 },
          overall: { wins: 1, losses: 11, winningPercentage: 0.083 }
        },
      ];
      
    case 'basketball':
    case 'mbasketball':
      return [
        {
          schoolId: 'akron',
          sportId: 'basketball',
          conference: { wins: 15, losses: 3, winningPercentage: 0.833 },
          overall: { wins: 23, losses: 8, winningPercentage: 0.742 }
        },
        {
          schoolId: 'toledo',
          sportId: 'basketball',
          conference: { wins: 14, losses: 4, winningPercentage: 0.778 },
          overall: { wins: 25, losses: 7, winningPercentage: 0.781 }
        },
        {
          schoolId: 'kentstate',
          sportId: 'basketball',
          conference: { wins: 13, losses: 5, winningPercentage: 0.722 },
          overall: { wins: 21, losses: 10, winningPercentage: 0.677 }
        },
        {
          schoolId: 'buffalo',
          sportId: 'basketball',
          conference: { wins: 13, losses: 5, winningPercentage: 0.722 },
          overall: { wins: 19, losses: 10, winningPercentage: 0.655 }
        },
        {
          schoolId: 'ballstate',
          sportId: 'basketball',
          conference: { wins: 11, losses: 7, winningPercentage: 0.611 },
          overall: { wins: 17, losses: 13, winningPercentage: 0.567 }
        },
        {
          schoolId: 'bowlinggreen',
          sportId: 'basketball',
          conference: { wins: 10, losses: 8, winningPercentage: 0.556 },
          overall: { wins: 17, losses: 14, winningPercentage: 0.548 }
        },
        {
          schoolId: 'ohio',
          sportId: 'basketball',
          conference: { wins: 9, losses: 9, winningPercentage: 0.500 },
          overall: { wins: 18, losses: 14, winningPercentage: 0.563 }
        },
        {
          schoolId: 'northernillinois',
          sportId: 'basketball',
          conference: { wins: 8, losses: 10, winningPercentage: 0.444 },
          overall: { wins: 15, losses: 16, winningPercentage: 0.484 }
        },
        {
          schoolId: 'miamioh',
          sportId: 'basketball',
          conference: { wins: 7, losses: 11, winningPercentage: 0.389 },
          overall: { wins: 12, losses: 19, winningPercentage: 0.387 }
        },
        {
          schoolId: 'westernmichigan',
          sportId: 'basketball',
          conference: { wins: 5, losses: 13, winningPercentage: 0.278 },
          overall: { wins: 8, losses: 23, winningPercentage: 0.258 }
        },
        {
          schoolId: 'centralmichigan',
          sportId: 'basketball',
          conference: { wins: 4, losses: 14, winningPercentage: 0.222 },
          overall: { wins: 8, losses: 22, winningPercentage: 0.267 }
        },
        {
          schoolId: 'easternmichigan',
          sportId: 'basketball',
          conference: { wins: 3, losses: 15, winningPercentage: 0.167 },
          overall: { wins: 8, losses: 22, winningPercentage: 0.267 }
        },
      ];
      
    case 'baseball':
      return [
        {
          schoolId: 'ballstate',
          sportId: 'baseball',
          conference: { wins: 18, losses: 6, winningPercentage: 0.750 },
          overall: { wins: 35, losses: 21, winningPercentage: 0.625 }
        },
        {
          schoolId: 'toledo',
          sportId: 'baseball',
          conference: { wins: 17, losses: 7, winningPercentage: 0.708 },
          overall: { wins: 32, losses: 23, winningPercentage: 0.582 }
        },
        {
          schoolId: 'centralmichigan',
          sportId: 'baseball',
          conference: { wins: 16, losses: 8, winningPercentage: 0.667 },
          overall: { wins: 33, losses: 20, winningPercentage: 0.623 }
        },
        {
          schoolId: 'ohio',
          sportId: 'baseball',
          conference: { wins: 15, losses: 9, winningPercentage: 0.625 },
          overall: { wins: 28, losses: 25, winningPercentage: 0.528 }
        },
        {
          schoolId: 'westernmichigan',
          sportId: 'baseball',
          conference: { wins: 14, losses: 10, winningPercentage: 0.583 },
          overall: { wins: 27, losses: 28, winningPercentage: 0.491 }
        },
        {
          schoolId: 'kentstate',
          sportId: 'baseball',
          conference: { wins: 13, losses: 11, winningPercentage: 0.542 },
          overall: { wins: 25, losses: 32, winningPercentage: 0.439 }
        },
        {
          schoolId: 'miamioh',
          sportId: 'baseball',
          conference: { wins: 12, losses: 12, winningPercentage: 0.500 },
          overall: { wins: 23, losses: 33, winningPercentage: 0.411 }
        },
        {
          schoolId: 'easternmichigan',
          sportId: 'baseball',
          conference: { wins: 10, losses: 14, winningPercentage: 0.417 },
          overall: { wins: 22, losses: 34, winningPercentage: 0.393 }
        },
        {
          schoolId: 'bowlinggreen',
          sportId: 'baseball',
          conference: { wins: 9, losses: 15, winningPercentage: 0.375 },
          overall: { wins: 19, losses: 37, winningPercentage: 0.339 }
        },
        {
          schoolId: 'northernillinois',
          sportId: 'baseball',
          conference: { wins: 8, losses: 16, winningPercentage: 0.333 },
          overall: { wins: 14, losses: 42, winningPercentage: 0.250 }
        },
        {
          schoolId: 'akron',
          sportId: 'baseball',
          conference: { wins: 7, losses: 17, winningPercentage: 0.292 },
          overall: { wins: 16, losses: 39, winningPercentage: 0.291 }
        },
        {
          schoolId: 'buffalo',
          sportId: 'baseball', 
          conference: { wins: 5, losses: 19, winningPercentage: 0.208 },
          overall: { wins: 12, losses: 42, winningPercentage: 0.222 }
        },
      ];
    
    // For other sports, generate random standings
    default:
      // Shuffle schools to create random standings
      const shuffledSchools = [...schoolIds].sort(() => Math.random() - 0.5);
      
      // Generate win/loss records that make sense
      return shuffledSchools.map((schoolId, index) => {
        // Top teams have better records
        const confWins = Math.max(2, 18 - index);
        const confLosses = Math.min(18, index + 2);
        const overallWins = confWins + Math.floor(Math.random() * 10);
        const overallLosses = confLosses + Math.floor(Math.random() * 6);
        
        return {
          schoolId,
          sportId,
          conference: {
            wins: confWins,
            losses: confLosses,
            winningPercentage: Number((confWins / (confWins + confLosses)).toFixed(3))
          },
          overall: {
            wins: overallWins,
            losses: overallLosses,
            winningPercentage: Number((overallWins / (overallWins + overallLosses)).toFixed(3))
          }
        };
      });
  }
}
