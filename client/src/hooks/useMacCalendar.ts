import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";

/**
 * Custom hook to fetch MAC calendar data from the official MAC website
 * 
 * @param sportId Optional sport ID to filter events by sport
 * @param schoolId Optional school ID to filter events by school
 * @returns Query object with calendar data
 */
export const useMacCalendar = (sportId?: string, schoolId?: string) => {
  const queryParams = new URLSearchParams();
  
  if (sportId) {
    queryParams.append('sportId', sportId);
  }
  
  if (schoolId) {
    queryParams.append('schoolId', schoolId);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return useQuery<Game[]>({
    queryKey: ['/api/import/mac-calendar', sportId, schoolId],
    select: (data: any) => {
      if (data && data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
    // Don't refresh too frequently since this is external data
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};