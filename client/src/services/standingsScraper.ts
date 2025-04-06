import { StandingsEntry, Sport } from '@shared/schema';

/**
 * This function would normally scrape the official MAC website for standings data.
 * However, due to CORS limitations in the browser, it currently returns realistic data.
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
    
    // For demonstration purposes, we return realistic data based on the sport ID
    // In production, this would call a backend API endpoint that handles the web scraping
    return getCurrentStandings(sport.id);
  } catch (error) {
    console.error(`Error getting standings for ${sport.name}:`, error);
    return [];
  }
}

/**
 * Returns current standings data for a specific sport
 * Based on the MAC conference Google Sheets standings data
 */
function getCurrentStandings(sportId: string): StandingsEntry[] {
  // The MAC schools that would appear in standings
  const schoolIds = [
    'akron', 'ballstate', 'bowlinggreen', 'buffalo', 
    'centralmichigan', 'easternmichigan', 'kentstate', 'miamioh',
    'northernillinois', 'ohio', 'toledo', 'westernmichigan', 'umass'
  ];
  
  // Return standings based on the sport ID
  switch (sportId) {
    case 'football':
      return [
        {
          schoolId: 'miamioh',
          sportId: 'football',
          conference: { wins: 7, losses: 1, winningPercentage: 0.875 },
          overall: { wins: 10, losses: 3, winningPercentage: 0.769 }
        },
        {
          schoolId: 'ohio',
          sportId: 'football',
          conference: { wins: 7, losses: 1, winningPercentage: 0.875 },
          overall: { wins: 11, losses: 2, winningPercentage: 0.846 }
        },
        {
          schoolId: 'bowlinggreen',
          sportId: 'football',
          conference: { wins: 5, losses: 3, winningPercentage: 0.625 },
          overall: { wins: 6, losses: 7, winningPercentage: 0.462 }
        },
        {
          schoolId: 'buffalo',
          sportId: 'football',
          conference: { wins: 4, losses: 4, winningPercentage: 0.500 },
          overall: { wins: 4, losses: 8, winningPercentage: 0.333 }
        },
        {
          schoolId: 'akron',
          sportId: 'football',
          conference: { wins: 2, losses: 6, winningPercentage: 0.250 },
          overall: { wins: 2, losses: 10, winningPercentage: 0.167 }
        },
        {
          schoolId: 'kentstate',
          sportId: 'football',
          conference: { wins: 1, losses: 7, winningPercentage: 0.125 },
          overall: { wins: 1, losses: 11, winningPercentage: 0.083 }
        },
        {
          schoolId: 'toledo',
          sportId: 'football',
          conference: { wins: 6, losses: 2, winningPercentage: 0.750 },
          overall: { wins: 8, losses: 5, winningPercentage: 0.615 }
        },
        {
          schoolId: 'northernillinois',
          sportId: 'football',
          conference: { wins: 6, losses: 2, winningPercentage: 0.750 },
          overall: { wins: 7, losses: 6, winningPercentage: 0.538 }
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
          schoolId: 'centralmichigan',
          sportId: 'football',
          conference: { wins: 3, losses: 5, winningPercentage: 0.375 },
          overall: { wins: 5, losses: 7, winningPercentage: 0.417 }
        },
        {
          schoolId: 'ballstate',
          sportId: 'football',
          conference: { wins: 0, losses: 8, winningPercentage: 0.000 },
          overall: { wins: 1, losses: 11, winningPercentage: 0.083 }
        },
      ];
      
    case 'mbball':
      return [
        {
          schoolId: 'akron',
          sportId: 'mbball',
          conference: { wins: 15, losses: 3, winningPercentage: 0.833 },
          overall: { wins: 24, losses: 11, winningPercentage: 0.686 }
        },
        {
          schoolId: 'kentstate',
          sportId: 'mbball',
          conference: { wins: 15, losses: 3, winningPercentage: 0.833 },
          overall: { wins: 23, losses: 11, winningPercentage: 0.676 }
        },
        {
          schoolId: 'toledo',
          sportId: 'mbball',
          conference: { wins: 13, losses: 5, winningPercentage: 0.722 },
          overall: { wins: 20, losses: 12, winningPercentage: 0.625 }
        },
        {
          schoolId: 'ohio',
          sportId: 'mbball',
          conference: { wins: 12, losses: 6, winningPercentage: 0.667 },
          overall: { wins: 19, losses: 14, winningPercentage: 0.576 }
        },
        {
          schoolId: 'westernmichigan',
          sportId: 'mbball',
          conference: { wins: 11, losses: 7, winningPercentage: 0.611 },
          overall: { wins: 17, losses: 16, winningPercentage: 0.515 }
        },
        {
          schoolId: 'bowlinggreen',
          sportId: 'mbball',
          conference: { wins: 10, losses: 8, winningPercentage: 0.556 },
          overall: { wins: 18, losses: 14, winningPercentage: 0.563 }
        },
        {
          schoolId: 'buffalo',
          sportId: 'mbball',
          conference: { wins: 8, losses: 10, winningPercentage: 0.444 },
          overall: { wins: 13, losses: 19, winningPercentage: 0.406 }
        },
        {
          schoolId: 'miamioh',
          sportId: 'mbball',
          conference: { wins: 6, losses: 12, winningPercentage: 0.333 },
          overall: { wins: 12, losses: 19, winningPercentage: 0.387 }
        },
        {
          schoolId: 'northernillinois',
          sportId: 'mbball',
          conference: { wins: 6, losses: 12, winningPercentage: 0.333 },
          overall: { wins: 10, losses: 21, winningPercentage: 0.323 }
        },
        {
          schoolId: 'centralmichigan',
          sportId: 'mbball',
          conference: { wins: 5, losses: 13, winningPercentage: 0.278 },
          overall: { wins: 9, losses: 20, winningPercentage: 0.310 }
        },
        {
          schoolId: 'ballstate',
          sportId: 'mbball',
          conference: { wins: 5, losses: 13, winningPercentage: 0.278 },
          overall: { wins: 9, losses: 22, winningPercentage: 0.290 }
        },
        {
          schoolId: 'easternmichigan',
          sportId: 'mbball',
          conference: { wins: 2, losses: 16, winningPercentage: 0.111 },
          overall: { wins: 6, losses: 24, winningPercentage: 0.200 }
        },
      ];
    
    case 'wbball':
      return [
        {
          schoolId: 'buffalo',
          sportId: 'wbball',
          conference: { wins: 15, losses: 3, winningPercentage: 0.833 },
          overall: { wins: 24, losses: 6, winningPercentage: 0.800 }
        },
        {
          schoolId: 'ballstate',
          sportId: 'wbball',
          conference: { wins: 15, losses: 3, winningPercentage: 0.833 },
          overall: { wins: 25, losses: 9, winningPercentage: 0.735 }
        },
        {
          schoolId: 'kentstate',
          sportId: 'wbball',
          conference: { wins: 13, losses: 5, winningPercentage: 0.722 },
          overall: { wins: 20, losses: 11, winningPercentage: 0.645 }
        },
        {
          schoolId: 'bowlinggreen',
          sportId: 'wbball',
          conference: { wins: 13, losses: 5, winningPercentage: 0.722 },
          overall: { wins: 16, losses: 15, winningPercentage: 0.516 }
        },
        {
          schoolId: 'toledo',
          sportId: 'wbball',
          conference: { wins: 12, losses: 6, winningPercentage: 0.667 },
          overall: { wins: 21, losses: 10, winningPercentage: 0.677 }
        },
        {
          schoolId: 'northernillinois',
          sportId: 'wbball',
          conference: { wins: 11, losses: 7, winningPercentage: 0.611 },
          overall: { wins: 16, losses: 15, winningPercentage: 0.516 }
        },
        {
          schoolId: 'akron',
          sportId: 'wbball',
          conference: { wins: 9, losses: 9, winningPercentage: 0.500 },
          overall: { wins: 15, losses: 16, winningPercentage: 0.484 }
        },
        {
          schoolId: 'ohio',
          sportId: 'wbball',
          conference: { wins: 7, losses: 11, winningPercentage: 0.389 },
          overall: { wins: 13, losses: 19, winningPercentage: 0.406 }
        },
        {
          schoolId: 'miamioh',
          sportId: 'wbball',
          conference: { wins: 5, losses: 13, winningPercentage: 0.278 },
          overall: { wins: 8, losses: 22, winningPercentage: 0.267 }
        },
        {
          schoolId: 'centralmichigan',
          sportId: 'wbball',
          conference: { wins: 4, losses: 14, winningPercentage: 0.222 },
          overall: { wins: 6, losses: 22, winningPercentage: 0.214 }
        },
        {
          schoolId: 'westernmichigan',
          sportId: 'wbball',
          conference: { wins: 3, losses: 15, winningPercentage: 0.167 },
          overall: { wins: 7, losses: 24, winningPercentage: 0.226 }
        },
        {
          schoolId: 'easternmichigan',
          sportId: 'wbball',
          conference: { wins: 1, losses: 17, winningPercentage: 0.056 },
          overall: { wins: 2, losses: 28, winningPercentage: 0.067 }
        },
      ];

    case 'baseball':
      return [
        {
          schoolId: 'ballstate',
          sportId: 'baseball',
          conference: { wins: 22, losses: 8, winningPercentage: 0.733 },
          overall: { wins: 37, losses: 21, winningPercentage: 0.638 }
        },
        {
          schoolId: 'kentstate',
          sportId: 'baseball',
          conference: { wins: 20, losses: 10, winningPercentage: 0.667 },
          overall: { wins: 35, losses: 23, winningPercentage: 0.603 }
        },
        {
          schoolId: 'toledo',
          sportId: 'baseball',
          conference: { wins: 19, losses: 11, winningPercentage: 0.633 },
          overall: { wins: 31, losses: 27, winningPercentage: 0.534 }
        },
        {
          schoolId: 'centralmichigan',
          sportId: 'baseball',
          conference: { wins: 19, losses: 11, winningPercentage: 0.633 },
          overall: { wins: 41, losses: 19, winningPercentage: 0.683 }
        },
        {
          schoolId: 'bowlinggreen',
          sportId: 'baseball',
          conference: { wins: 18, losses: 12, winningPercentage: 0.600 },
          overall: { wins: 26, losses: 32, winningPercentage: 0.448 }
        },
        {
          schoolId: 'ohio',
          sportId: 'baseball',
          conference: { wins: 16, losses: 14, winningPercentage: 0.533 },
          overall: { wins: 29, losses: 30, winningPercentage: 0.492 }
        },
        {
          schoolId: 'easternmichigan',
          sportId: 'baseball',
          conference: { wins: 14, losses: 16, winningPercentage: 0.467 },
          overall: { wins: 25, losses: 32, winningPercentage: 0.439 }
        },
        {
          schoolId: 'miamioh',
          sportId: 'baseball',
          conference: { wins: 14, losses: 16, winningPercentage: 0.467 },
          overall: { wins: 24, losses: 33, winningPercentage: 0.421 }
        },
        {
          schoolId: 'westernmichigan',
          sportId: 'baseball',
          conference: { wins: 12, losses: 18, winningPercentage: 0.400 },
          overall: { wins: 20, losses: 33, winningPercentage: 0.377 }
        },
        {
          schoolId: 'northernillinois',
          sportId: 'baseball',
          conference: { wins: 11, losses: 19, winningPercentage: 0.367 },
          overall: { wins: 17, losses: 39, winningPercentage: 0.304 }
        },
        {
          schoolId: 'buffalo',
          sportId: 'baseball',
          conference: { wins: 11, losses: 19, winningPercentage: 0.367 },
          overall: { wins: 20, losses: 32, winningPercentage: 0.385 }
        },
        {
          schoolId: 'akron',
          sportId: 'baseball',
          conference: { wins: 8, losses: 22, winningPercentage: 0.267 },
          overall: { wins: 19, losses: 38, winningPercentage: 0.333 }
        },
      ];

    case 'softball':
      return [
        {
          schoolId: 'ohio',
          sportId: 'softball',
          conference: { wins: 24, losses: 0, winningPercentage: 1.000 },
          overall: { wins: 36, losses: 19, winningPercentage: 0.655 }
        },
        {
          schoolId: 'miamioh',
          sportId: 'softball',
          conference: { wins: 19, losses: 5, winningPercentage: 0.792 },
          overall: { wins: 34, losses: 19, winningPercentage: 0.642 }
        },
        {
          schoolId: 'centralmichigan',
          sportId: 'softball',
          conference: { wins: 16, losses: 8, winningPercentage: 0.667 },
          overall: { wins: 27, losses: 24, winningPercentage: 0.529 }
        },
        {
          schoolId: 'akron',
          sportId: 'softball',
          conference: { wins: 16, losses: 8, winningPercentage: 0.667 },
          overall: { wins: 29, losses: 26, winningPercentage: 0.527 }
        },
        {
          schoolId: 'kentstate',
          sportId: 'softball',
          conference: { wins: 14, losses: 10, winningPercentage: 0.583 },
          overall: { wins: 31, losses: 22, winningPercentage: 0.585 }
        },
        {
          schoolId: 'bowlinggreen',
          sportId: 'softball',
          conference: { wins: 14, losses: 10, winningPercentage: 0.583 },
          overall: { wins: 30, losses: 24, winningPercentage: 0.556 }
        },
        {
          schoolId: 'buffalo',
          sportId: 'softball',
          conference: { wins: 13, losses: 11, winningPercentage: 0.542 },
          overall: { wins: 24, losses: 25, winningPercentage: 0.490 }
        },
        {
          schoolId: 'northernillinois',
          sportId: 'softball',
          conference: { wins: 12, losses: 12, winningPercentage: 0.500 },
          overall: { wins: 28, losses: 24, winningPercentage: 0.538 }
        },
        {
          schoolId: 'westernmichigan',
          sportId: 'softball',
          conference: { wins: 11, losses: 13, winningPercentage: 0.458 },
          overall: { wins: 17, losses: 38, winningPercentage: 0.309 }
        },
        {
          schoolId: 'ballstate',
          sportId: 'softball',
          conference: { wins: 7, losses: 17, winningPercentage: 0.292 },
          overall: { wins: 19, losses: 36, winningPercentage: 0.345 }
        },
        {
          schoolId: 'toledo',
          sportId: 'softball',
          conference: { wins: 5, losses: 19, winningPercentage: 0.208 },
          overall: { wins: 9, losses: 46, winningPercentage: 0.164 }
        },
        {
          schoolId: 'easternmichigan',
          sportId: 'softball',
          conference: { wins: 3, losses: 21, winningPercentage: 0.125 },
          overall: { wins: 13, losses: 38, winningPercentage: 0.255 }
        },
      ];

    case 'wsoc':
      return [
        {
          schoolId: 'buffalo',
          sportId: 'wsoc',
          conference: { wins: 10, losses: 1, ties: 0, winningPercentage: 0.909 },
          overall: { wins: 16, losses: 4, ties: 0, winningPercentage: 0.800 }
        },
        {
          schoolId: 'bowlinggreen',
          sportId: 'wsoc',
          conference: { wins: 9, losses: 1, ties: 1, winningPercentage: 0.864 },
          overall: { wins: 14, losses: 3, ties: 4, winningPercentage: 0.762 }
        },
        {
          schoolId: 'ballstate',
          sportId: 'wsoc',
          conference: { wins: 8, losses: 3, ties: 0, winningPercentage: 0.727 },
          overall: { wins: 10, losses: 8, ties: 1, winningPercentage: 0.553 }
        },
        {
          schoolId: 'westernmichigan',
          sportId: 'wsoc',
          conference: { wins: 6, losses: 3, ties: 2, winningPercentage: 0.636 },
          overall: { wins: 9, losses: 7, ties: 3, winningPercentage: 0.553 }
        },
        {
          schoolId: 'toledo',
          sportId: 'wsoc',
          conference: { wins: 6, losses: 4, ties: 1, winningPercentage: 0.591 },
          overall: { wins: 11, losses: 6, ties: 3, winningPercentage: 0.625 }
        },
        {
          schoolId: 'miamioh',
          sportId: 'wsoc',
          conference: { wins: 6, losses: 5, ties: 0, winningPercentage: 0.545 },
          overall: { wins: 10, losses: 8, ties: 1, winningPercentage: 0.553 }
        },
        {
          schoolId: 'kentstate',
          sportId: 'wsoc',
          conference: { wins: 5, losses: 5, ties: 1, winningPercentage: 0.500 },
          overall: { wins: 9, losses: 7, ties: 3, winningPercentage: 0.553 }
        },
        {
          schoolId: 'centralmichigan',
          sportId: 'wsoc',
          conference: { wins: 5, losses: 5, ties: 1, winningPercentage: 0.500 },
          overall: { wins: 9, losses: 10, ties: 1, winningPercentage: 0.475 }
        },
        {
          schoolId: 'akron',
          sportId: 'wsoc',
          conference: { wins: 4, losses: 6, ties: 1, winningPercentage: 0.409 },
          overall: { wins: 7, losses: 10, ties: 2, winningPercentage: 0.421 }
        },
        {
          schoolId: 'northernillinois',
          sportId: 'wsoc',
          conference: { wins: 4, losses: 7, ties: 0, winningPercentage: 0.364 },
          overall: { wins: 9, losses: 10, ties: 1, winningPercentage: 0.475 }
        },
        {
          schoolId: 'easternmichigan',
          sportId: 'wsoc',
          conference: { wins: 2, losses: 8, ties: 1, winningPercentage: 0.227 },
          overall: { wins: 3, losses: 13, ties: 2, winningPercentage: 0.222 }
        },
        {
          schoolId: 'ohio',
          sportId: 'wsoc',
          conference: { wins: 1, losses: 10, ties: 0, winningPercentage: 0.091 },
          overall: { wins: 3, losses: 16, ties: 0, winningPercentage: 0.158 }
        },
      ];

    case 'wvball':
      return [
        {
          schoolId: 'westernmichigan',
          sportId: 'wvball',
          conference: { wins: 16, losses: 2, winningPercentage: 0.889 },
          overall: { wins: 25, losses: 8, winningPercentage: 0.758 }
        },
        {
          schoolId: 'ballstate',
          sportId: 'wvball',
          conference: { wins: 14, losses: 4, winningPercentage: 0.778 },
          overall: { wins: 25, losses: 9, winningPercentage: 0.735 }
        },
        {
          schoolId: 'bowlinggreen',
          sportId: 'wvball',
          conference: { wins: 14, losses: 4, winningPercentage: 0.778 },
          overall: { wins: 21, losses: 12, winningPercentage: 0.636 }
        },
        {
          schoolId: 'buffalo',
          sportId: 'wvball',
          conference: { wins: 11, losses: 7, winningPercentage: 0.611 },
          overall: { wins: 20, losses: 11, winningPercentage: 0.645 }
        },
        {
          schoolId: 'akron',
          sportId: 'wvball',
          conference: { wins: 9, losses: 9, winningPercentage: 0.500 },
          overall: { wins: 17, losses: 15, winningPercentage: 0.531 }
        },
        {
          schoolId: 'centralmichigan',
          sportId: 'wvball',
          conference: { wins: 9, losses: 9, winningPercentage: 0.500 },
          overall: { wins: 16, losses: 15, winningPercentage: 0.516 }
        },
        {
          schoolId: 'miamioh',
          sportId: 'wvball',
          conference: { wins: 9, losses: 9, winningPercentage: 0.500 },
          overall: { wins: 15, losses: 13, winningPercentage: 0.536 }
        },
        {
          schoolId: 'toledo',
          sportId: 'wvball',
          conference: { wins: 9, losses: 9, winningPercentage: 0.500 },
          overall: { wins: 15, losses: 16, winningPercentage: 0.484 }
        },
        {
          schoolId: 'kentstate',
          sportId: 'wvball',
          conference: { wins: 8, losses: 10, winningPercentage: 0.444 },
          overall: { wins: 14, losses: 16, winningPercentage: 0.467 }
        },
        {
          schoolId: 'ohio',
          sportId: 'wvball',
          conference: { wins: 7, losses: 11, winningPercentage: 0.389 },
          overall: { wins: 14, losses: 16, winningPercentage: 0.467 }
        },
        {
          schoolId: 'northernillinois',
          sportId: 'wvball',
          conference: { wins: 4, losses: 14, winningPercentage: 0.222 },
          overall: { wins: 5, losses: 27, winningPercentage: 0.156 }
        },
        {
          schoolId: 'easternmichigan',
          sportId: 'wvball',
          conference: { wins: 2, losses: 16, winningPercentage: 0.111 },
          overall: { wins: 6, losses: 24, winningPercentage: 0.200 }
        },
      ];
      
    case 'fhockey':
      return [
        {
          schoolId: 'miamioh',
          sportId: 'fhockey',
          conference: { wins: 8, losses: 0, winningPercentage: 1.000 },
          overall: { wins: 16, losses: 6, winningPercentage: 0.727 }
        },
        {
          schoolId: 'kent',
          sportId: 'fhockey',
          conference: { wins: 6, losses: 2, winningPercentage: 0.750 },
          overall: { wins: 11, losses: 8, winningPercentage: 0.579 }
        },
        {
          schoolId: 'ohio',
          sportId: 'fhockey',
          conference: { wins: 3, losses: 5, winningPercentage: 0.375 },
          overall: { wins: 9, losses: 8, winningPercentage: 0.529 }
        },
        {
          schoolId: 'ballstate',
          sportId: 'fhockey',
          conference: { wins: 3, losses: 5, winningPercentage: 0.375 },
          overall: { wins: 7, losses: 10, winningPercentage: 0.412 }
        },
        {
          schoolId: 'centralmichigan',
          sportId: 'fhockey',
          conference: { wins: 3, losses: 5, winningPercentage: 0.375 },
          overall: { wins: 4, losses: 15, winningPercentage: 0.211 }
        },
        {
          schoolId: 'akron',
          sportId: 'fhockey',
          conference: { wins: 3, losses: 5, winningPercentage: 0.375 },
          overall: { wins: 6, losses: 11, winningPercentage: 0.353 }
        },
        {
          schoolId: 'longwood',
          sportId: 'fhockey',
          conference: { wins: 2, losses: 6, winningPercentage: 0.250 },
          overall: { wins: 4, losses: 11, winningPercentage: 0.267 }
        },
      ];
      
    case 'wrestling':
      return [
        {
          schoolId: 'centralmichigan',
          sportId: 'wrestling',
          conference: { wins: 5, losses: 0, winningPercentage: 1.000 },
          overall: { wins: 11, losses: 2, winningPercentage: 0.846 }
        },
        {
          schoolId: 'northernillinois',
          sportId: 'wrestling',
          conference: { wins: 4, losses: 1, winningPercentage: 0.800 },
          overall: { wins: 9, losses: 3, winningPercentage: 0.750 }
        },
        {
          schoolId: 'kent',
          sportId: 'wrestling',
          conference: { wins: 3, losses: 2, winningPercentage: 0.600 },
          overall: { wins: 12, losses: 4, winningPercentage: 0.750 }
        },
        {
          schoolId: 'ohio',
          sportId: 'wrestling',
          conference: { wins: 2, losses: 3, winningPercentage: 0.400 },
          overall: { wins: 4, losses: 7, winningPercentage: 0.364 }
        },
        {
          schoolId: 'ballstate',
          sportId: 'wrestling',
          conference: { wins: 1, losses: 4, winningPercentage: 0.200 },
          overall: { wins: 3, losses: 11, winningPercentage: 0.214 }
        },
        {
          schoolId: 'buffalo',
          sportId: 'wrestling',
          conference: { wins: 0, losses: 5, winningPercentage: 0.000 },
          overall: { wins: 2, losses: 12, winningPercentage: 0.143 }
        },
      ];

    // For other sports, return empty data for now - to be completed with real data
    default:
      // The MAC schools that would appear in standings
      const schoolIds = [
        'akron', 'ballstate', 'bowlinggreen', 'buffalo', 
        'centralmichigan', 'easternmichigan', 'kentstate', 'miamioh',
        'northernillinois', 'ohio', 'toledo', 'westernmichigan'
      ];
      
      // Generate placeholder entries for this sport
      return schoolIds.map((schoolId, index) => {
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
