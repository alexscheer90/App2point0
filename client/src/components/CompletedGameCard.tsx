import { Game } from "@shared/schema";
import { Link } from "wouter";
import { findSchoolByName } from "../utils/findSchoolByName";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { CalendarIcon, ChevronRight, Clock } from "lucide-react";

interface CompletedGameCardProps {
  game: Game;
  showType?: "list" | "card";
}

export default function CompletedGameCard({ game, showType = "card" }: CompletedGameCardProps) {
  // Find team data using the improved findSchoolByName function
  const homeTeam = findSchoolByName(game.homeTeam);
  const awayTeam = findSchoolByName(game.awayTeam);
  
  // Determine if the game is a rivalry
  const isRivalry = game.isRivalry;
  
  // Set default background color to MAC Navy
  const defaultBgColor = "#0B213E";
  
  // Determine background gradient based on team primary colors
  const homePrimaryColor = homeTeam?.primaryColor || defaultBgColor;
  const awayPrimaryColor = awayTeam?.primaryColor || defaultBgColor;
  
  // Get winner and loser for styling
  let winnerTeam = null;
  let loserTeam = null;
  let homeWinner = false;
  let awayWinner = false;
  
  // Only determine winner/loser if we have scores
  if (game.homeScore !== undefined && game.awayScore !== undefined) {
    const homeScore = parseInt(game.homeScore.toString());
    const awayScore = parseInt(game.awayScore.toString());
    
    if (homeScore > awayScore) {
      winnerTeam = homeTeam;
      loserTeam = awayTeam;
      homeWinner = true;
    } else if (awayScore > homeScore) {
      winnerTeam = awayTeam;
      loserTeam = homeTeam;
      awayWinner = true;
    }
  }
  
  // Define the background gradient that emphasizes the winner
  let gradientStyle;
  if (winnerTeam && loserTeam) {
    // If we have a winner, make their color more prominent
    const winnerColor = winnerTeam?.primaryColor || defaultBgColor;
    const loserColor = loserTeam?.primaryColor || defaultBgColor;
    gradientStyle = {
      background: `linear-gradient(125deg, ${homeWinner ? winnerColor : loserColor} 0%, ${awayWinner ? winnerColor : loserColor} 100%)`,
    };
  } else {
    // Otherwise use both team colors equally
    gradientStyle = {
      background: `linear-gradient(125deg, ${homePrimaryColor} 0%, ${awayPrimaryColor} 100%)`,
    };
  }
  
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
  
  // Format date safely
  let formattedDate = "TBD";
  if (game.date) {
    const gameDate = new Date(game.date);
    formattedDate = format(gameDate, "MMM d, yyyy");
  } else if (game.startTime) {
    // Fall back to startTime if date is not available
    const gameDate = new Date(game.startTime);
    formattedDate = format(gameDate, "MMM d, yyyy");
  }
  
  // Format game result text
  let resultText = "Final";
  if (game.periodDetail && game.sport === "baseball") {
    resultText = `Final/${game.periodDetail}`;
  } else if (game.periodDetail) {
    resultText = `Final ${game.periodDetail}`;
  }
  
  return (
    <Link href={`/games/${game.id}`}>
      <div className={`relative mb-4 overflow-hidden text-white rounded-xl cursor-pointer transition-transform duration-200 hover:scale-102 ${
        isRivalry ? "ring-2 ring-yellow-400" : ""
      } ${showType === "card" ? "h-48" : "h-28"}`}>
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
            <Badge variant="outline" className="border-white/30 text-white">
              {resultText}
            </Badge>
            <div className="flex items-center">
              <CalendarIcon size={12} className="mr-1" />
              {formattedDate}
            </div>
          </div>
          
          {/* Team display */}
          <div className="flex flex-col flex-grow justify-center">
            {/* Away team */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-3 overflow-hidden bg-white rounded-full shadow-md">
                  <img 
                    src={awayTeam?.logoUrl || "/school-logos/generic.png"} 
                    alt={game.awayTeam} 
                    className={`object-contain w-full h-full p-1 ${awayWinner ? 'ring-2 ring-yellow-400' : ''}`}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">{awayTeam?.shortName || game.awayTeam}</div>
                  <div className={`text-xl font-bold ${awayWinner ? 'text-yellow-400' : ''}`}>{game.awayTeam}</div>
                </div>
              </div>
              <div className={`text-3xl font-bold mr-2 ${awayWinner ? 'text-yellow-400' : ''}`}>
                {game.awayScore || "0"}
              </div>
            </div>
            
            {/* Home team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-3 overflow-hidden bg-white rounded-full shadow-md">
                  <img 
                    src={homeTeam?.logoUrl || "/school-logos/generic.png"} 
                    alt={game.homeTeam} 
                    className={`object-contain w-full h-full p-1 ${homeWinner ? 'ring-2 ring-yellow-400' : ''}`}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">{homeTeam?.shortName || game.homeTeam}</div>
                  <div className={`text-xl font-bold ${homeWinner ? 'text-yellow-400' : ''}`}>{game.homeTeam}</div>
                </div>
              </div>
              <div className={`text-3xl font-bold mr-2 ${homeWinner ? 'text-yellow-400' : ''}`}>
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