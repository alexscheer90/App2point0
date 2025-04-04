import { useQuery } from "@tanstack/react-query";
import { Rivalry } from "@shared/schema";
import { getRivalries, getRivalry, getSchoolRivalries } from "@/lib/api";

export function useRivalries() {
  return useQuery({
    queryKey: ["/api/rivalries"],
    queryFn: () => getRivalries(),
  });
}

export function useRivalry(id: string) {
  return useQuery({
    queryKey: ["/api/rivalries", id],
    queryFn: () => getRivalry(id),
    enabled: !!id,
  });
}

export function useSchoolRivalries(schoolId: string) {
  return useQuery({
    queryKey: ["/api/schools", schoolId, "rivalries"],
    queryFn: () => getSchoolRivalries(schoolId),
    enabled: !!schoolId,
  });
}