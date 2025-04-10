import { useQuery } from "@tanstack/react-query";
import { TeamStat } from "@shared/schema";
import { macTeamStats } from "@/data/macTeamStats";

/**
 * Hook to fetch team statistics for a specific school
 */
export function useTeamStats(schoolId: string, sportId: string = "all") {
  return useQuery<TeamStat[]>({
    queryKey: ['/api/schools', schoolId, 'stats', sportId],
    queryFn: async () => {
      // Filter stats by schoolId and sportId (if not 'all')
      return macTeamStats.filter(stat => {
        if (stat.schoolId !== schoolId) return false;
        if (sportId !== "all" && stat.sportId !== sportId) return false;
        return true;
      });
    }
  });
}

/**
 * Hook to fetch team statistics for a specific sport
 */
export function useSportTeamStats(sportId: string) {
  return useQuery<TeamStat[]>({
    queryKey: ['/api/sports', sportId, 'stats'],
    queryFn: async () => {
      return macTeamStats.filter(stat => stat.sportId === sportId);
    }
  });
}