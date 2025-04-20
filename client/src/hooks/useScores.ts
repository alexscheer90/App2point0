import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";
import { useMacCalendar } from "./useMacCalendar";

// Helper to check if a date is today
function isGameToday(gameDate: string): boolean {
  const today = new Date();
  const gameDateTime = new Date(gameDate);
  
  return (
    today.getFullYear() === gameDateTime.getFullYear() &&
    today.getMonth() === gameDateTime.getMonth() &&
    today.getDate() === gameDateTime.getDate()
  );
}

export function useScores(sportId: string = "all") {
  // Use our MAC calendar API for real event data
  const { data: macCalendarGames, isLoading: macLoading } = useMacCalendar(
    sportId !== "all" ? sportId : undefined
  );
  
  // Filter games to only show those for today and completed games from today
  const games = macCalendarGames || [];
  
  // Get today's games, including completed ones
  const todaysGames = games.filter(game => {
    return isGameToday(game.scheduledTime || game.startTime);
  });
  
  const isLoading = macLoading;
  
  // Filter games by status
  const liveGames = todaysGames.filter(game => game.status === "live") || [];
  const upcomingGames = todaysGames.filter(game => game.status === "scheduled") || [];
  const recentGames = todaysGames.filter(game => game.status === "final") || [];
  
  // Log for debugging
  console.log(`Found ${todaysGames.length} games today (${liveGames.length} live, ${upcomingGames.length} upcoming, ${recentGames.length} completed)`);
  
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
  // Use our MAC calendar API for real event data
  const { data: macCalendarGames, isLoading } = useMacCalendar(
    sportId !== "all" ? sportId : undefined
  );
  
  // Map data to include required fields for schedule
  const games = macCalendarGames?.map((game: Game) => {
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
  // Use our MAC calendar API for real event data
  const { data: macCalendarGames, isLoading } = useMacCalendar(
    undefined, // all sports
    schoolId   // for specific school
  );
  
  const liveGames = macCalendarGames?.filter((game: Game) => game.status === "live") || [];
  const upcomingGames = macCalendarGames?.filter((game: Game) => game.status === "scheduled") || [];
  const recentGames = macCalendarGames?.filter((game: Game) => game.status === "final") || [];
  
  return {
    liveGames,
    upcomingGames,
    recentGames,
    isLoading,
  };
}
