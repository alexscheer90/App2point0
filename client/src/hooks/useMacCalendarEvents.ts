import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";

/**
 * Custom hook to fetch MAC calendar events with final scores
 * 
 * @param date Optional date string in YYYY-MM-DD format
 * @returns Query object with MAC calendar events data
 */
export const useMacCalendarEvents = (date?: string) => {
  const queryParams = new URLSearchParams();
  
  if (date) {
    queryParams.append('date', date);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return useQuery<Game[]>({
    queryKey: ['/api/mac/calendar', date],
    select: (data: any) => {
      if (data && data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

/**
 * Custom hook to fetch MAC events for a specific date
 * 
 * @param date Date string in YYYY-MM-DD format
 * @returns Query object with MAC events data for the specific date
 */
export const useMacEventsByDate = (date: string) => {
  return useQuery<Game[]>({
    queryKey: ['/api/mac/events-by-date', date],
    enabled: !!date && /^\d{4}-\d{2}-\d{2}$/.test(date), // Only run if date is valid
    select: (data: any) => {
      if (data && data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};