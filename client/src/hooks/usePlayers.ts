import { useQuery } from "@tanstack/react-query";
import { Player } from "@shared/schema";
import { macPlayers } from "@/data/macPlayers";

/**
 * Hook to fetch players for a specific school
 */
export function usePlayers(schoolId: string, sportId: string = "all") {
  return useQuery<Player[]>({
    queryKey: ['/api/schools', schoolId, 'players', sportId],
    queryFn: async () => {
      // Filter players by schoolId and sportId (if not 'all')
      return macPlayers.filter(player => {
        if (player.schoolId !== schoolId) return false;
        if (sportId !== "all" && player.sportId !== sportId) return false;
        return true;
      });
    }
  });
}

/**
 * Hook to fetch a specific player by ID
 */
export function usePlayer(playerId: string) {
  return useQuery<Player | undefined>({
    queryKey: ['/api/players', playerId],
    queryFn: async () => {
      return macPlayers.find(player => player.id === playerId);
    }
  });
}

/**
 * Hook to fetch players for a specific sport
 */
export function useSportPlayers(sportId: string) {
  return useQuery<Player[]>({
    queryKey: ['/api/sports', sportId, 'players'],
    queryFn: async () => {
      return macPlayers.filter(player => player.sportId === sportId);
    }
  });
}