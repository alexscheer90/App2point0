import { Game } from "@shared/schema";
import { Link } from "wouter";
import { findSchoolByName } from "../utils/findSchoolByName";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { CalendarIcon, ChevronRight, Clock, Play } from "lucide-react";
import { getOptimizedImagePath, handleImageError } from "../utils/imageOptimizer";

interface GameScoreCardProps {
  game: Game;
  isLive?: boolean;
  showType?: "list" | "card";
}

export default function GameScoreCard({ game, isLive = false, showType = "card" }: GameScoreCardProps) {
  // Handle special cases before calling findSchoolByName
  let adjustedHomeName = game.homeTeam;
  let adjustedAwayName = game.awayTeam;
  
  // Special case handling for known problematic schools
  if (game.awayTeam && (
      game.awayTeam.includes("Valparaiso") || 
      game.awayTeam.toLowerCase().includes("valpo") ||
      game.awayTeam.includes("Beacons")
  )) {
    adjustedAwayName = "Valparaiso";
  }
  
  if (game.awayTeam && (
      game.awayTeam.includes("Northern Kentucky") || 
      game.awayTeam.includes("NKU") ||
      game.awayTeam.includes("Norse")
  )) {
    adjustedAwayName = "Northern Kentucky";
  }
  
  if (game.homeTeam && (
      game.homeTeam.includes("Valparaiso") || 
      game.homeTeam.toLowerCase().includes("valpo") ||
      game.homeTeam.includes("Beacons")
  )) {
    adjustedHomeName = "Valparaiso";
  }
  
  if (game.homeTeam && (
      game.homeTeam.includes("Northern Kentucky") || 
      game.homeTeam.includes("NKU") ||
      game.homeTeam.includes("Norse")
  )) {
    adjustedHomeName = "Northern Kentucky";
  }
  
  // Find team data using the improved findSchoolByName function with adjusted names
  const homeTeam = findSchoolByName(adjustedHomeName);
  const awayTeam = findSchoolByName(adjustedAwayName);
  
  // Determine if the game is a rivalry based on both teams having logoUrls
  // and both being in the MAC conference
  const isRivalry = game.isRivalry;
  
  // Set default background color to MAC Navy
  const defaultBgColor = "#0B213E";
  
  // Determine background gradient based on team primary colors
  const homePrimaryColor = homeTeam?.primaryColor || defaultBgColor;
  const awayPrimaryColor = awayTeam?.primaryColor || defaultBgColor;
  
  // Generate a gradient background
  const gradientStyle = {
    background: `linear-gradient(125deg, ${homePrimaryColor} 0%, ${awayPrimaryColor} 100%)`,
  };
  
  // Determine badge color based on data source
  let sourceColor = "bg-blue-500"; // Default blue badge for normal data
  let sourceLabel = "Smart Data Sourcing";
  
  if (game.dataSource === "sidearm") {
    sourceColor = "bg-green-500";
    sourceLabel = "Official School Stats";
  } else if (game.dataSource === "espn") {
    sourceColor = "bg-purple-500";
    sourceLabel = "ESPN Data";
  }
  
  // Format date and time safely
  let formattedDate = "TBD";
  let formattedTime = "TBD";
  if (game.date) {
    const gameDate = new Date(game.date);
    formattedDate = format(gameDate, "MMM d, yyyy");
    formattedTime = format(gameDate, "h:mm a");
  } else if (game.startTime) {
    // Fall back to startTime if date is not available
    const gameDate = new Date(game.startTime);
    formattedDate = format(gameDate, "MMM d, yyyy");
    formattedTime = format(gameDate, "h:mm a");
  }
  
  // Determine display for current game situation (inning, score, etc.)
  let gameSituation = "";
  if (game.status === "live") {
    if (game.sport === "baseball" || game.sport === "softball") {
      if (game.period) {
        const inningText = `${game.period}${getInningOrdinal(game.period)}`;
        const topBottom = game.periodDetail?.toLowerCase().includes("top") ? "Top" : "Bottom";
        gameSituation = `${topBottom} ${inningText}`;
      }
    } else if (game.sport === "basketball") {
      gameSituation = `${game.periodDetail || ""} ${game.period || ""}`;
    } else if (game.sport === "football") {
      gameSituation = `${game.periodDetail || ""} ${game.period || "Q"}`;
    } else {
      gameSituation = game.periodDetail || "";
    }
  }
  
  return (
    <Link href={`/games/${game.id}`}>
      <div className={`relative mb-4 overflow-hidden text-white rounded-xl cursor-pointer transition-transform duration-200 hover:scale-102 ${
        isRivalry ? "ring-2 ring-yellow-400" : ""
      } ${showType === "card" ? "h-56" : "h-28"}`}>
        {/* Background gradient */}
        <div className="absolute inset-0" style={gradientStyle}></div>
        
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Rivalry indicator */}
        {isRivalry && (
          <div className="absolute top-0 left-0 z-10 flex items-center px-2 py-1 text-xs font-bold text-black bg-yellow-400 rounded-br-md">
            RIVALRY GAME
          </div>
        )}
        
        {/* Data source badge */}
        <div className="absolute top-0 right-0 z-10 px-2 py-1 text-xs font-medium text-white rounded-bl-md"
             style={{ backgroundColor: sourceColor.replace('bg-', '') }}>
          {sourceLabel}
        </div>
        
        {/* Content container */}
        <div className="relative z-10 flex flex-col h-full p-3">
          {/* Game header */}
          <div className="flex items-center mb-2 space-x-2 text-xs text-white/80">
            {game.status === "live" ? (
              <>
                <Badge variant="destructive" className="bg-red-600 animate-pulse">LIVE</Badge>
                <div className="flex items-center">
                  <Play size={12} className="mr-1" />
                  {gameSituation}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <CalendarIcon size={12} className="mr-1" />
                  {formattedDate}
                </div>
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {formattedTime}
                </div>
              </>
            )}
          </div>
          
          {/* Team display */}
          <div className="flex flex-col flex-grow justify-center">
            {/* Away team */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-3 overflow-hidden bg-white rounded-full shadow-md">
                  <img 
                    src={
                      awayTeam?.logoUrl || 
                      getOptimizedImagePath(game.awayTeam || "", false)
                    } 
                    alt={game.awayTeam} 
                    className="object-contain w-full h-full p-1"
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">{awayTeam?.shortName || game.awayTeam}</div>
                  <div className="text-xl font-bold">{game.awayTeam}</div>
                </div>
              </div>
              <div className="text-3xl font-bold mr-2">
                {game.awayScore || "0"}
              </div>
            </div>
            
            {/* Home team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-3 overflow-hidden bg-white rounded-full shadow-md">
                  <img 
                    src={
                      homeTeam?.logoUrl || 
                      getOptimizedImagePath(game.homeTeam || "", false)
                    } 
                    alt={game.homeTeam} 
                    className="object-contain w-full h-full p-1"
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">{homeTeam?.shortName || game.homeTeam}</div>
                  <div className="text-xl font-bold">{game.homeTeam}</div>
                </div>
              </div>
              <div className="text-3xl font-bold mr-2">
                {game.homeScore || "0"}
              </div>
            </div>
          </div>
          
          {/* View details chevron */}
          <div className="flex justify-end mt-2">
            <ChevronRight className="text-white/70" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// Helper function to get ordinal suffix for inning numbers
function getInningOrdinal(inning: string | number): string {
  if (typeof inning === 'string') {
    // Try to parse the inning string to a number
    inning = parseInt(inning, 10);
    if (isNaN(inning)) return ""; // If parsing fails, return empty string
  }
  
  const j = inning % 10;
  const k = inning % 100;
  
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}