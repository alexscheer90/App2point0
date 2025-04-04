import { useQuery } from "@tanstack/react-query";
import { LocalEats } from "@shared/schema";
import { getLocalEats, getLocalEat } from "@/lib/api";

export function useLocalEats(schoolId: string) {
  return useQuery({
    queryKey: ["/api/schools", schoolId, "local-eats"],
    queryFn: () => getLocalEats(schoolId),
    enabled: !!schoolId,
  });
}

export function useLocalEat(id: string) {
  return useQuery({
    queryKey: ["/api/local-eats", id],
    queryFn: () => getLocalEat(id),
    enabled: !!id,
  });
}