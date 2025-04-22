import { Game } from "@shared/schema";
import { Link } from "wouter";
import { findSchoolByName } from "../utils/findSchoolByName";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { CalendarIcon, ChevronRight, Clock, Trophy, Headphones, Tv2 } from "lucide-react";

// Type definition for team information
interface TeamInfo {
  name: string;
  mascot?: string;
}

// Helper function to convert team IDs to proper display names with mascots
function getTeamNameFromId(teamId: string | undefined): TeamInfo {
  if (!teamId) return { name: "Unknown Team" };
  
  // Remove the "unknown-" prefix if it exists
  const cleanedTeamId = teamId.replace(/^unknown-/, '');
  
  // Convert teamId to proper team name and mascot
  const teamMap: Record<string, TeamInfo> = {
    // MAC Schools
    "akron": { name: "Akron", mascot: "Zips" },
    "ballstate": { name: "Ball State", mascot: "Cardinals" },
    "bowlinggreen": { name: "Bowling Green", mascot: "Falcons" },
    "buffalo": { name: "Buffalo", mascot: "Bulls" },
    "centralmichigan": { name: "Central Michigan", mascot: "Chippewas" },
    "easternmichigan": { name: "Eastern Michigan", mascot: "Eagles" },
    "kentstate": { name: "Kent State", mascot: "Golden Flashes" },
    "miami": { name: "Miami", mascot: "RedHawks" },
    "miamioh": { name: "Miami", mascot: "RedHawks" },
    "northernillinois": { name: "Northern Illinois", mascot: "Huskies" },
    "ohio": { name: "Ohio", mascot: "Bobcats" },
    "toledo": { name: "Toledo", mascot: "Rockets" },
    "westernmichigan": { name: "Western Michigan", mascot: "Broncos" },
    
    // Non-MAC schools
    "umass": { name: "Massachusetts", mascot: "Minutemen" },
    "massachusetts": { name: "Massachusetts", mascot: "Minutemen" },
    "bellarmine": { name: "Bellarmine", mascot: "Knights" },
    "notredame": { name: "Notre Dame", mascot: "Fighting Irish" },
    "michiganstate": { name: "Michigan State", mascot: "Spartans" },
    "michigan": { name: "Michigan", mascot: "Wolverines" },
    "ohiostate": { name: "Ohio State", mascot: "Buckeyes" },
    "ohio-state": { name: "Ohio State", mascot: "Buckeyes" },
    "valparaiso-beacons": { name: "Valparaiso", mascot: "Beacons" },
    "valparaiso": { name: "Valparaiso", mascot: "Beacons" },
    "northern-kentucky-university": { name: "Northern Kentucky", mascot: "Norse" },
    "northern-kentucky": { name: "Northern Kentucky", mascot: "Norse" },
    "mid-american-conference": { name: "MAC Championship", mascot: "Conference" },
    "notre-dame": { name: "Notre Dame", mascot: "Fighting Irish" },
  };
  
  // Try to find the team in our map
  if (teamMap[cleanedTeamId.toLowerCase()]) {
    return teamMap[cleanedTeamId.toLowerCase()];
  }
  
  // If not found, create a proper name from the ID
  const formattedName = cleanedTeamId
    .replace(/-/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
  
  return { name: formattedName };
}

interface CompletedGameCardProps {
  game: Game;
  showType?: "list" | "card";
}

export default function CompletedGameCard({ game, showType = "card" }: CompletedGameCardProps) {
  // Debug game data
  console.log(`Game ID: ${game.id}, HomeID: "${game.homeTeamId}", AwayID: "${game.awayTeamId}"`);
  
  // Get team names from IDs
  const homeTeamInfo = getTeamNameFromId(game.homeTeamId);
  const awayTeamInfo = getTeamNameFromId(game.awayTeamId);
  
  // Find team data using the improved findSchoolByName function
  const homeTeam = findSchoolByName(homeTeamInfo.name);
  const awayTeam = findSchoolByName(awayTeamInfo.name);
  
  // Debug team resolution
  console.log(`Team resolution - Home: ${homeTeam?.name || homeTeamInfo.name}, Logo: ${homeTeam?.logoUrl || 'Using default'}`);
  console.log(`Team resolution - Away: ${awayTeam?.name || awayTeamInfo.name}, Logo: ${awayTeam?.logoUrl || 'Using default'}`);
  
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
  let formattedTime = "";
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
  
  // Format game result text
  let resultText = "Final";
  if (game.periodDetail && game.sport === "baseball") {
    resultText = `Final/${game.periodDetail}`;
  } else if (game.periodDetail) {
    resultText = `Final ${game.periodDetail}`;
  }
  
  // Get sport color based on type
  const getSportColor = () => {
    if (!game.sport) return "#6E44FF"; // Default purple for unknown sports
    
    switch (game.sport.toLowerCase()) {
      case 'football':
        return "#C2410C"; // Orange for football
      case 'basketball':
        return "#BE123C"; // Red for basketball
      case 'baseball':
        return "#047857"; // Green for baseball
      case 'hockey':
        return "#0891B2"; // Cyan for hockey
      case 'soccer':
        return "#4338CA"; // Indigo for soccer
      default:
        return "#6E44FF"; // Default purple for other sports
    }
  }
  
  // Format sport name with proper capitalization
  const sportName = game.sport 
    ? game.sport.charAt(0).toUpperCase() + game.sport.slice(1).toLowerCase() 
    : "Sport";
  
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
        
        {/* Data source badge - moved to bottom left */}
        <div className="absolute bottom-0 left-0 z-10 px-2 py-1 text-xs font-medium text-white rounded-tr-md"
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
            
            {/* Sport badge */}
            <div className="flex items-center px-2 py-0.5 ml-1 rounded-full"
                style={{ backgroundColor: getSportColor() }}>
              <Trophy size={10} className="mr-1" />
              <span className="text-xs">{sportName}</span>
            </div>
            
            {/* Time badge if available */}
            {formattedTime && (
              <div className="flex items-center ml-1">
                <Clock size={10} className="mr-1" />
                <span className="text-xs">{formattedTime}</span>
              </div>
            )}
          </div>
          
          {/* Team display */}
          <div className="flex flex-col flex-grow justify-center">
            {/* Away team */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-3 overflow-hidden bg-white rounded-full shadow-md">
                  <img 
                    src={awayTeam?.logoUrl || "/school-logos/ncaa.png"} 
                    alt={awayTeamInfo.name} 
                    className={`object-contain w-full h-full p-1 ${awayWinner ? 'ring-2 ring-yellow-400' : ''}`}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-300">{awayTeamInfo.mascot || ''}</div>
                  <div className={`text-xl font-bold ${awayWinner ? 'text-yellow-400' : ''}`}>{awayTeamInfo.name}</div>
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
                    src={homeTeam?.logoUrl || "/school-logos/ncaa.png"} 
                    alt={homeTeamInfo.name} 
                    className={`object-contain w-full h-full p-1 ${homeWinner ? 'ring-2 ring-yellow-400' : ''}`}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-300">{homeTeamInfo.mascot || ''}</div>
                  <div className={`text-xl font-bold ${homeWinner ? 'text-yellow-400' : ''}`}>{homeTeamInfo.name}</div>
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