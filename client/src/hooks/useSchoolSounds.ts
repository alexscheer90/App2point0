import { useQuery } from "@tanstack/react-query";
import { SchoolSound } from "@shared/schema";
import { getSchoolSounds, getSchoolSound, getSchoolSoundsByType } from "@/lib/api";

export function useSchoolSounds(schoolId: string) {
  return useQuery({
    queryKey: ["/api/schools", schoolId || "all", "sounds"],
    queryFn: () => getSchoolSounds(schoolId),
    // Always enable the query, even with empty schoolId
    enabled: true,
  });
}

export function useSchoolSound(id: string) {
  return useQuery({
    queryKey: ["/api/sounds", id],
    queryFn: () => getSchoolSound(id),
    enabled: !!id,
  });
}

export function useSchoolSoundsByType(schoolId: string, type: "fight_song" | "alma_mater") {
  return useQuery({
    queryKey: ["/api/schools", schoolId, "sounds", type],
    queryFn: () => getSchoolSoundsByType(schoolId, type),
    enabled: !!schoolId,
  });
}