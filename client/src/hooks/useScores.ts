import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";
import { getGames, getSchoolGames } from "../lib/api";

export function useScores(sportId: string = "all") {
  const { data: games, isLoading } = useQuery({
    queryKey: [`/api/games/${sportId === "all" ? "" : sportId}`],
    queryFn: () => getGames(sportId),
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
