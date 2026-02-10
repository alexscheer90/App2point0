import axios from "axios";

const NCAA_SCOREBOARD_BASE = "https://data.ncaa.com/casablanca/scoreboard";
const NCAA_GAME_BASE = "https://data.ncaa.com/casablanca/game";

const NCAA_SPORT_PATHS: Record<string, string> = {
  baseball: "baseball",
  basketball: "basketball-men",
  football: "football",
  softball: "softball",
  soccer: "soccer-men",
  volleyball: "volleyball-women",
  hockey: "icehockey-men",
  wrestling: "wrestling",
  tennis: "tennis-men",
  golf: "golf-men",
  track: "track-field-indoor-men",
};

const NCAA_DIVISION_BY_SPORT: Record<string, string> = {
  football: "fbs",
};

function resolveSportPath(sportId: string): string | undefined {
  return NCAA_SPORT_PATHS[sportId];
}

function resolveDivision(sportId: string): string {
  return NCAA_DIVISION_BY_SPORT[sportId] ?? "d1";
}

function resolveDateSegments(date?: string): { year: string; month: string; day: string } {
  if (date && /^\d{8}$/.test(date)) {
    return {
      year: date.slice(0, 4),
      month: date.slice(4, 6),
      day: date.slice(6, 8),
    };
  }

  const today = new Date();
  return {
    year: String(today.getFullYear()),
    month: String(today.getMonth() + 1).padStart(2, "0"),
    day: String(today.getDate()).padStart(2, "0"),
  };
}

export async function fetchNcaaScoreboard(sportId: string, date?: string) {
  const sportPath = resolveSportPath(sportId);
  if (!sportPath) {
    throw new Error(`Sport ID ${sportId} not supported for NCAA API`);
  }

  const division = resolveDivision(sportId);
  const { year, month, day } = resolveDateSegments(date);
  const url = `${NCAA_SCOREBOARD_BASE}/${sportPath}/${division}/${year}/${month}/${day}/scoreboard.json`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "App2point0 NCAA proxy",
    },
  });
  return response.data;
}

export async function fetchNcaaBoxscore(gameId: string) {
  const url = `${NCAA_GAME_BASE}/${gameId}/boxscore.json`;
  const response = await axios.get(url, {
    headers: {
      "User-Agent": "App2point0 NCAA proxy",
    },
  });
  return response.data;
}
