import { useQuery } from "@tanstack/react-query";
import { Sport } from "@shared/schema";
import { macSports } from "../data/macSports";

/**
 * Hook to fetch all MAC sports
 */
export function useMacSports() {
  return useQuery<Sport[]>({
    queryKey: ['/api/sports'],
    queryFn: async () => {
      return macSports;
    }
  });
}

/**
 * Hook to fetch a specific sport by ID
 */
export function useSport(sportId: string) {
  return useQuery<Sport | undefined>({
    queryKey: ['/api/sports', sportId],
    queryFn: async () => {
      return macSports.find(sport => sport.id === sportId);
    }
  });
}