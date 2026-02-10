import axios from "axios";
import { Game, GameStatus } from "@shared/schema";
import { filterMacGamesForSport } from "../utils/macSchoolFilters";

type NcaaScoreboardGame = Record<string, any>;

const NCAA_STATUS_TO_GAME_STATUS: Record<string, GameStatus> = {
  final: "final",
  completed: "final",
  live: "live",
  inprogress: "live",
  scheduled: "scheduled",
  postponed: "postponed",
  canceled: "cancelled",
  cancelled: "cancelled",
};

function normalizeStatus(rawStatus?: string): GameStatus {
  if (!rawStatus) return "scheduled";
  const normalized = rawStatus.toLowerCase();
  if (normalized.includes("final") || normalized.includes("complete")) return "final";
  if (normalized.includes("live") || normalized.includes("in progress") || normalized.includes("inprogress")) return "live";
  if (normalized.includes("postponed")) return "postponed";
  if (normalized.includes("cancel")) return "cancelled";
  if (normalized.includes("scheduled") || normalized.includes("pre")) return "scheduled";
  return "scheduled";
}

function getFirstValue<T>(candidates: Array<T | undefined | null>): T | undefined {
  return candidates.find((value) => value !== undefined && value !== null);
}

function extractGames(payload: any): NcaaScoreboardGame[] {
  if (!payload) return [];
  if (Array.isArray(payload.games)) return payload.games;
  if (Array.isArray(payload.scoreboard)) return payload.scoreboard;
  if (Array.isArray(payload.contests)) return payload.contests;
  if (Array.isArray(payload.events)) return payload.events;
  if (payload.scoreboard && Array.isArray(payload.scoreboard.games)) return payload.scoreboard.games;
  if (payload.scoreboard && Array.isArray(payload.scoreboard.days)) {
    return payload.scoreboard.days.flatMap((day: any) => day.games || []);
  }
  return [];
}

function mapNcaaGameToGame(game: NcaaScoreboardGame, sportId: string): Game | null {
  const contest = game.contest ?? game.game ?? game;
  const contestId = String(
    getFirstValue([
      contest.id,
      contest.gameId,
      contest.contestId,
      contest.uid,
      game.id,
      game.gameId,
    ]) ?? ""
  );

  if (!contestId) return null;

  const home = contest.home ?? contest.homeTeam ?? contest.home_team ?? {};
  const away = contest.away ?? contest.awayTeam ?? contest.away_team ?? {};

  const homeName = String(
    getFirstValue([
      home.names?.full,
      home.names?.short,
      home.team?.name,
      home.team?.shortName,
      home.name,
      home.shortName,
      home.displayName,
    ]) ?? ""
  );

  const awayName = String(
    getFirstValue([
      away.names?.full,
      away.names?.short,
      away.team?.name,
      away.team?.shortName,
      away.name,
      away.shortName,
      away.displayName,
    ]) ?? ""
  );

  if (!homeName || !awayName) return null;

  const statusData = contest.status ?? contest.gameState ?? contest.statuses ?? {};
  const statusRaw = String(
    getFirstValue([
      statusData.state,
      statusData.gameState,
      statusData.type?.state,
      statusData.type?.name,
      statusData.status,
      statusData.description,
      contest.statusText,
    ]) ?? ""
  );

  const status = normalizeStatus(statusRaw);

  const homeScore = Number(
    getFirstValue([home.score, home.points, home.scoreTotal, home.scoreByPeriod?.total]) ?? 0
  );
  const awayScore = Number(
    getFirstValue([away.score, away.points, away.scoreTotal, away.scoreByPeriod?.total]) ?? 0
  );

  const startTime = String(
    getFirstValue([
      contest.startTime,
      contest.startDate,
      contest.start_time,
      contest.date,
      contest.gameDate,
      contest.scheduled,
    ]) ?? new Date().toISOString()
  );

  const venue = contest.venue ?? {};
  const venueName = getFirstValue([venue.name, venue.fullName, contest.location?.name]);
  const location = getFirstValue([
    contest.location?.city && contest.location?.state
      ? `${contest.location.city}, ${contest.location.state}`
      : undefined,
    venue.city && venue.state ? `${venue.city}, ${venue.state}` : undefined,
  ]);

  return {
    id: `ncaa-${contestId}`,
    sportId,
    homeTeamId: homeName.toLowerCase().replace(/\s+/g, ""),
    awayTeamId: awayName.toLowerCase().replace(/\s+/g, ""),
    homeTeamName: homeName,
    awayTeamName: awayName,
    homeTeamScore: homeScore,
    awayTeamScore: awayScore,
    startTime,
    scheduledTime: startTime,
    status,
    clock: statusData.clock ?? statusData.displayClock ?? "",
    period: statusData.period ?? statusData.currentPeriod ?? undefined,
    venue: venueName,
    location,
    dataSource: "ncaa",
    links: {
      ncaa: contestId,
    },
  };
}

export const ncaaScoreboardService = {
  async getLiveScores(sportId: string, date?: string): Promise<Game[]> {
    try {
      const response = await axios.get("/api/ncaa/scoreboard", {
        params: {
          sportId,
          date,
        },
      });

      const rawGames = extractGames(response.data);
      const games = rawGames
        .map((game) => mapNcaaGameToGame(game, sportId))
        .filter((game): game is Game => Boolean(game));

      return filterMacGamesForSport(games, sportId);
    } catch (error) {
      console.error("Error fetching NCAA scoreboard:", error);
      return [];
    }
  },
};

export default ncaaScoreboardService;
