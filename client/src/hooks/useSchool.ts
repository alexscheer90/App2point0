import { useQuery } from "@tanstack/react-query";
import { getSchools, getSchool } from "../lib/api";

export function useMacSchools() {
  return useQuery({
    queryKey: ['/api/schools'],
    queryFn: getSchools,
  });
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: [`/api/schools/${id}`],
    queryFn: () => getSchool(id),
    enabled: !!id,
  });
}
