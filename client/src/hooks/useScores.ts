import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";
import { getGames, getSchoolGames } from "../lib/api";
import { useLiveScores } from "./useESPNScores";

export function useScores(sportId: string = "all") {
  // Use our traditional API for all sports or non-primary sports
  const { data: apiGames, isLoading: apiLoading } = useQuery({
    queryKey: [`/api/games/${sportId === "all" ? "" : sportId}`],
    queryFn: () => getGames(sportId),
    // Don't refetch as frequently for API games
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
  
  // For specific live sports, use ESPN API
  const useESPNForThisSport = 
    sportId !== "all" && 
    ["football", "basketball", "baseball", "softball"].includes(sportId);
  
  // Get real-time scores from ESPN for supported sports
  const { 
    games: espnGames, 
    isLoading: espnLoading,
    error: espnError
  } = useESPNForThisSport ? useLiveScores(sportId) : { games: undefined, isLoading: false, error: null };
  
  // Use ESPN data only if we have valid data and no errors
  const hasValidESPNData = useESPNForThisSport && espnGames && espnGames.length > 0 && !espnError;
  
  // Merge the data sources, preferring ESPN for live data when available
  const mergedGames = hasValidESPNData ? 
    mergeGameData(apiGames || [], espnGames) :
    apiGames || [];
  
  const isLoading = apiLoading || (useESPNForThisSport && espnLoading);
  
  // Filter games by status
  const liveGames = mergedGames?.filter(game => game.status === "live") || [];
  const upcomingGames = mergedGames?.filter(game => game.status === "scheduled") || [];
  const recentGames = mergedGames?.filter(game => game.status === "final") || [];
  
  return {
    liveGames,
    upcomingGames,
    recentGames,
    isLoading,
  };
}

// Helper function to merge game data from different sources,
// prioritizing ESPN data for live games
function mergeGameData(apiGames: Game[], espnGames: Game[]): Game[] {
  // Create a copy of API games to work with
  const result = [...apiGames];
  
  // Create a map of existing games by ID to make lookups faster
  const gameMap = new Map<string, number>();
  apiGames.forEach((game, index) => {
    gameMap.set(game.id, index);
  });
  
  // Process each ESPN game
  espnGames.forEach(espnGame => {
    // For games with ESPN IDs, update matching games
    if (espnGame.id.startsWith('espn-')) {
      // Try to find a matching game from our API
      const matchingGameIndex = apiGames.findIndex(
        apiGame => 
          // Match by teams and approximate time
          (apiGame.homeTeamId === espnGame.homeTeamId && 
           apiGame.awayTeamId === espnGame.awayTeamId) ||
          // Or by links if we have an ESPN link
          (apiGame.links?.s_video && 
           apiGame.links.s_video.includes(espnGame.id.replace('espn-', '')))
      );
      
      if (matchingGameIndex !== -1) {
        // Update existing game with ESPN data
        result[matchingGameIndex] = {
          ...result[matchingGameIndex],
          // Keep original ID and links
          id: result[matchingGameIndex].id,
          links: {
            ...result[matchingGameIndex].links,
            s_video: espnGame.links?.s_video || result[matchingGameIndex].links?.s_video
          },
          // Update live data
          status: espnGame.status,
          homeTeamScore: espnGame.homeTeamScore,
          awayTeamScore: espnGame.awayTeamScore,
          // Update metadata
          period: espnGame.period,
          clock: espnGame.clock,
          situation: espnGame.situation,
        };
      } else {
        // Add new game from ESPN
        result.push(espnGame);
      }
    }
  });
  
  return result;
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
