import axios from "axios";

interface GameStats {
  boxScore?: {
    homePoints: number[];
    awayPoints: number[];
    totalHome: number;
    totalAway: number;
  };
  leaders?: {
    home: {
      points?: { name: string; value: number };
      rebounds?: { name: string; value: number };
      assists?: { name: string; value: number };
    };
    away: {
      points?: { name: string; value: number };
      rebounds?: { name: string; value: number };
      assists?: { name: string; value: number };
    };
  };
  teamStats?: {
    home: Record<string, number>;
    away: Record<string, number>;
  };
}

function extractLineScore(data: any): { home: number[]; away: number[] } | null {
  const linescore = data?.linescore ?? data?.lineScore ?? data?.linescores;
  if (Array.isArray(linescore)) {
    const homePoints = linescore.map((period) => Number(period?.home ?? period?.homeScore ?? 0));
    const awayPoints = linescore.map((period) => Number(period?.away ?? period?.awayScore ?? 0));
    return { home: homePoints, away: awayPoints };
  }

  const periods = data?.periods ?? data?.periodScores ?? data?.periodScore;
  if (Array.isArray(periods)) {
    const homePoints = periods.map((period) => Number(period?.home ?? period?.homeScore ?? 0));
    const awayPoints = periods.map((period) => Number(period?.away ?? period?.awayScore ?? 0));
    return { home: homePoints, away: awayPoints };
  }

  return null;
}

function toNumber(value: any): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export const ncaaApiService = {
  async fetchGameStats(gameId: string): Promise<GameStats | null> {
    if (!gameId) return null;

    try {
      const response = await axios.get(`/api/ncaa/game/${gameId}/boxscore`);
      const data = response.data;

      const lineScore = extractLineScore(data);
      const homeTotals = data?.home?.score ?? data?.homeTeam?.score ?? data?.homeTeam?.points ?? 0;
      const awayTotals = data?.away?.score ?? data?.awayTeam?.score ?? data?.awayTeam?.points ?? 0;

      if (lineScore) {
        return {
          boxScore: {
            homePoints: lineScore.home,
            awayPoints: lineScore.away,
            totalHome: toNumber(homeTotals),
            totalAway: toNumber(awayTotals),
          },
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching NCAA game stats:", error);
      return null;
    }
  },
};

export default ncaaApiService;
