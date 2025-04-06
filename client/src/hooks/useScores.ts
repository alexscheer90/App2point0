import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";
import { getGames, getSchoolGames } from "../lib/api";

// Helper function to check if a date is today
function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function useScores(sportId: string = "all", favoriteSchoolId: string | null = null) {
  const { data: games, isLoading } = useQuery({
    queryKey: [`/api/games/${sportId === "all" ? "" : sportId}`],
    queryFn: () => getGames(sportId),
  });
  
  // Filter for today's games only
  const todayGames = games?.filter(game => isToday(game.startTime)) || [];
  
  // Sort games by favorite school first
  const sortedGames = [...todayGames].sort((a, b) => {
    // Put games with favorite school at the top
    if (favoriteSchoolId) {
      const aHasFavorite = a.homeTeamId === favoriteSchoolId || a.awayTeamId === favoriteSchoolId;
      const bHasFavorite = b.homeTeamId === favoriteSchoolId || b.awayTeamId === favoriteSchoolId;
      
      if (aHasFavorite && !bHasFavorite) return -1;
      if (!aHasFavorite && bHasFavorite) return 1;
    }
    return 0;
  });
  
  // Then categorize by status
  const liveGames = sortedGames.filter(game => game.status === "live");
  const upcomingGames = sortedGames.filter(game => game.status === "scheduled");
  const recentGames = sortedGames.filter(game => game.status === "final");
  
  return {
    liveGames,
    upcomingGames,
    recentGames,
    isLoading,
  };
}

export function useGames(sportId: string = "all") {
  const { data, isLoading } = useQuery({
    queryKey: [`/api/games/${sportId === "all" ? "" : sportId}`],
    queryFn: () => getGames(sportId),
  });
  
  // Map data to include required fields for schedule
  const games = data?.map((game: Game) => {
    return {
      ...game,
      scheduledTime: game.startTime, // Use startTime as scheduledTime
      location: game.venue || "TBD", // Use venue as location
      homeScore: game.homeTeamScore, // Alias for homeTeamScore
      awayScore: game.awayTeamScore, // Alias for awayTeamScore
    };
  });
  
  return {
    data: games,
    isLoading,
  };
}

export function useSchoolGames(schoolId: string) {
  const { data: games, isLoading } = useQuery({
    queryKey: [`/api/schools/${schoolId}/games`],
    queryFn: () => getSchoolGames(schoolId),
  });
  
  const liveGames = games?.filter(game => game.status === "live") || [];
  const upcomingGames = games?.filter(game => game.status === "scheduled") || [];
  const recentGames = games?.filter(game => game.status === "final") || [];
  
  return {
    liveGames,
    upcomingGames,
    recentGames,
    isLoading,
  };
}
