import { useQuery } from "@tanstack/react-query";
import { getStandings, getSchoolStandings, getSports } from "../lib/api";

export function useStandings(sportId: string) {
  const { data, isLoading } = useQuery({
    queryKey: [`/api/standings/${sportId}`],
    queryFn: () => getStandings(sportId),
  });
  
  return { data, isLoading };
}

export function useSchoolStandings(schoolId: string) {
  const { data, isLoading } = useQuery({
    queryKey: [`/api/schools/${schoolId}/standings`],
    queryFn: () => getSchoolStandings(schoolId),
  });
  
  return { data, isLoading };
}

export function useMacSports() {
  return useQuery({
    queryKey: ['/api/sports'],
    queryFn: getSports,
  });
}
