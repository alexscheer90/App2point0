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

    // Temporary mock data (must satisfy schema)
    return generateMockStandings(sport.id);
  } catch (error) {
    console.error(`Error getting standings for ${sport.name}:`, error);
    return [];
  }
}

/**
 * Helper to generate stable IDs that satisfy the schema
 */
function makeStandingsId(sportId: string, schoolId: string) {
  return `${sportId}:${schoolId}`;
}

/**
 * Generates realistic mock standings data for a specific sport
 * In a production environment, this will be replaced with real MAC standings
 */
function generateMockStandings(sportId: string): StandingsEntry[] {
  const schoolIds = [
    'akron',
    'ballstate',
    'bowlinggreen',
    'buffalo',
    'centralmichigan',
    'easternmichigan',
    'kentstate',
    'miamioh',
    'northernillinois',
    'ohio',
    'toledo',
    'westernmichigan',
  ];

  switch (sportId) {
    case 'football':
      return [
        {
          id: makeStandingsId('football', 'toledo'),
          schoolId: 'toledo',
          sportId: 'football',
          conference: { wins: 8, losses: 0, winningPercentage: 1.0 },
          overall: { wins: 11, losses: 2, winningPercentage: 0.846 },
        },
        {
          id: makeStandingsId('football', 'miamioh'),
          schoolId: 'miamioh',
          sportId: 'football',
          conference: { wins: 7, losses: 1, winningPercentage: 0.875 },
          overall: { wins: 10, losses: 3, winningPercentage: 0.769 },
        },
        {
          id: makeStandingsId('football', 'bowlinggreen'),
          schoolId: 'bowlinggreen',
          sportId: 'football',
          conference: { wins: 6, losses: 2, winningPercentage: 0.75 },
          overall: { wins: 8, losses: 4, winningPercentage: 0.667 },
        },
        {
          id: makeStandingsId('football', 'northernillinois'),
          schoolId: 'northernillinois',
          sportId: 'football',
          conference: { wins: 5, losses: 3, winningPercentage: 0.625 },
          overall: { wins: 7, losses: 5, winningPercentage: 0.583 },
        },
        {
          id: makeStandingsId('football', 'ohio'),
          schoolId: 'ohio',
          sportId: 'football',
          conference: { wins: 5, losses: 3, winningPercentage: 0.625 },
          overall: { wins: 9, losses: 3, winningPercentage: 0.75 },
        },
        {
          id: makeStandingsId('football', 'easternmichigan'),
          schoolId: 'easternmichigan',
          sportId: 'football',
          conference: { wins: 4, losses: 4, winningPercentage: 0.5 },
          overall: { wins: 6, losses: 6, winningPercentage: 0.5 },
        },
        {
          id: makeStandingsId('football', 'westernmichigan'),
          schoolId: 'westernmichigan',
          sportId: 'football',
          conference: { wins: 3, losses: 5, winningPercentage: 0.375 },
          overall: { wins: 4, losses: 8, winningPercentage: 0.333 },
        },
        {
          id: makeStandingsId('football', 'buffalo'),
          schoolId: 'buffalo',
          sportId: 'football',
          conference: { wins: 3, losses: 5, winningPercentage: 0.375 },
          overall: { wins: 3, losses: 9, winningPercentage: 0.25 },
        },
        {
          id: makeStandingsId('football', 'centralmichigan'),
          schoolId: 'centralmichigan',
          sportId: 'football',
          conference: { wins: 2, losses: 6, winningPercentage: 0.25 },
          overall: { wins: 4, losses: 8, winningPercentage: 0.333 },
        },
        {
          id: makeStandingsId('football', 'ballstate'),
          schoolId: 'ballstate',
          sportId: 'football',
          conference: { wins: 2, losses: 6, winningPercentage: 0.25 },
          overall: { wins: 4, losses: 8, winningPercentage: 0.333 },
        },
        {
          id: makeStandingsId('football', 'akron'),
          schoolId: 'akron',
          sportId: 'football',
          conference: { wins: 1, losses: 7, winningPercentage: 0.125 },
          overall: { wins: 2, losses: 10, winningPercentage: 0.167 },
        },
        {
          id: makeStandingsId('football', 'kentstate'),
          schoolId: 'kentstate',
          sportId: 'football',
          conference: { wins: 0, losses: 8, winningPercentage: 0.0 },
          overall: { wins: 1, losses: 11, winningPercentage: 0.083 },
        },
      ];

    default:
      // fallback to avoid runtime crashes
      return schoolIds.map((schoolId) => ({
        id: makeStandingsId(sportId, schoolId),
        schoolId,
        sportId,
        conference: { wins: 0, losses: 0, winningPercentage: 0 },
        overall: { wins: 0, losses: 0, winningPercentage: 0 },
      }));
  }
}
