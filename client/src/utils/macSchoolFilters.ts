import { Game, School } from '@shared/schema';
import { macSchools } from '../data/macSchools';
import { MAC_AFFILIATE_SCHOOLS_BY_SPORT } from '../data/macAffiliatesBySport';

const affiliateSportsLookup = new Map(
  Object.entries(MAC_AFFILIATE_SCHOOLS_BY_SPORT).map(([sportId, schoolIds]) => [
    sportId,
    new Set(schoolIds),
  ])
);

export function isMacSchoolForSport(schoolId: string, sportId: string): boolean {
  const school = macSchools.find((entry) => entry.id === schoolId);
  if (!school) {
    return false;
  }

  if (!school.affiliate) {
    return true;
  }

  const affiliatesForSport = affiliateSportsLookup.get(sportId);
  return affiliatesForSport?.has(schoolId) ?? false;
}

export function getMacSchoolsForSport(sportId: string): School[] {
  if (sportId === 'all') {
    return macSchools.filter((school) => !school.affiliate);
  }

  return macSchools.filter((school) => isMacSchoolForSport(school.id, sportId));
}

export function isMacGameForSport(game: Game, sportId: string): boolean {
  return (
    isMacSchoolForSport(game.homeTeamId, sportId) ||
    isMacSchoolForSport(game.awayTeamId, sportId)
  );
}

export function filterMacGamesForSport(games: Game[], sportId: string): Game[] {
  if (!sportId) {
    return games;
  }

  return games.filter((game) => isMacGameForSport(game, sportId));
}
