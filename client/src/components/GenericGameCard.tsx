import { Game } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { useMacSports } from "../hooks/useStandings";
import { format } from "date-fns";
import ShareButton from "./ShareButton";

interface GenericGameCardProps {
  game: Game;
}

const GenericGameCard = ({ game }: GenericGameCardProps) => {
  const { data: schools, isLoading: schoolsLoading } = useMacSchools();
  const { data: sports, isLoading: sportsLoading } = useMacSports();
  
  if (schoolsLoading || sportsLoading || !schools || !sports) {
    return (
      <div className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }
  
  // Find the MAC school and the sport
  const homeTeam = schools.find(school => school.id === game.homeTeamId);
  const awayTeam = schools.find(school => school.id === game.awayTeamId);
  const sport = sports.find(sport => sport.id === game.sportId) || { 
    id: game.sportId, 
    name: game.sportId.charAt(0).toUpperCase() + game.sportId.slice(1),
    gender: "mixed" 
  };
  
  // Extract opponent information from game.situation if it exists
  let nonMacHomeTeam = null;
  let nonMacAwayTeam = null;
  
  if (game.situation) {
    if (game.situation.includes("Home:")) {
      const homeMatch = game.situation.match(/Home: ([^|]+)/);
      if (homeMatch && homeMatch[1]) {
        nonMacHomeTeam = homeMatch[1].trim();
      }
    }
    
    if (game.situation.includes("Away:")) {
      const awayMatch = game.situation.match(/Away: ([^|]+)/);
      if (awayMatch && awayMatch[1]) {
        nonMacAwayTeam = awayMatch[1].trim();
      }
    }
  }
  
  // Format the date nicely
  const gameDate = new Date(game.startTime);
  const isToday = new Date().toDateString() === gameDate.toDateString();
  const isTomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() === gameDate.toDateString();
  
  let formattedDate = format(gameDate, "h:mm a");
  if (isToday) {
    formattedDate = `Today, ${formattedDate}`;
  } else if (isTomorrow) {
    formattedDate = `Tomorrow, ${formattedDate}`;
  } else {
    formattedDate = `${format(gameDate, "MMM d")}, ${formattedDate}`;
  }
  
  // Create a share URL for the game
  const shareUrl = `/games/${game.id}`;
  
  // Create share content
  const readableDate = format(gameDate, "MMMM d, yyyy 'at' h:mm a");
  
  // Determine which team names to use for the display and share
  const displayHomeTeamName = homeTeam?.name || nonMacHomeTeam || "Unknown Home Team";
  const displayAwayTeamName = awayTeam?.name || nonMacAwayTeam || "Unknown Away Team";
  
  const shareTitle = `${displayHomeTeamName} vs ${displayAwayTeamName} - ${readableDate}`;
  const description = `${sport.name} matchup on Mobile #MACtion!`;
  
  const handleShareClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent any parent onClick from firing
    e.stopPropagation();
  };
  
  // Helper function to render a team section
  const renderTeam = (team: any, isHome: boolean, nonMacTeamName: string | null) => {
    if (team) {
      // We have a MAC team, render with logo
      return (
        <div className="flex items-center">
          {team.logoUrl ? (
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <img 
                src={team.logoUrl} 
                alt={`${team.name} logo`} 
                className="max-h-full max-w-full object-contain" 
              />
            </div>
          ) : (
            <div 
              className="w-8 h-8 rounded-full mr-3 flex items-center justify-center" 
              style={{ backgroundColor: team.primaryColor }}
            >
              <span className="text-xs font-bold" style={{ color: team.secondaryColor }}>
                {team.shortName.charAt(0)}
              </span>
            </div>
          )}
          <span className="font-semibold text-sm">{team.name}</span>
        </div>
      );
    } else if (nonMacTeamName) {
      // We have a non-MAC team name from the situation field
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center bg-gray-200">
            <span className="text-xs font-bold text-gray-600">
              {nonMacTeamName.charAt(0)}
            </span>
          </div>
          <span className="font-semibold text-sm">{nonMacTeamName}</span>
        </div>
      );
    } else {
      // Fallback for unknown team
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center bg-gray-200">
            <span className="text-xs font-bold text-gray-600">?</span>
          </div>
          <span className="font-semibold text-sm">{isHome ? "Home Team" : "Away Team"}</span>
        </div>
      );
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden border border-gray-200">
      <div className="bg-gray-100 text-xs font-semibold px-3 py-1 flex justify-between items-center">
        <span>{sport.name} • {sport.gender !== "mixed" ? sport.gender.charAt(0).toUpperCase() + sport.gender.slice(1) : "Mixed"}</span>
        <div className="flex items-center space-x-2">
          <span>{formattedDate}</span>
          <div onClick={handleShareClick}>
            <ShareButton 
              url={shareUrl}
              title={shareTitle}
              description={description}
              compact={true}
            />
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          {renderTeam(homeTeam, true, nonMacHomeTeam)}
          {game.status === 'final' && game.homeTeamScore !== undefined && (
            <span className="font-bold text-lg">{game.homeTeamScore}</span>
          )}
        </div>
        <div className="flex justify-between items-center mb-2">
          {renderTeam(awayTeam, false, nonMacAwayTeam)}
          {game.status === 'final' && game.awayTeamScore !== undefined && (
            <span className="font-bold text-lg">{game.awayTeamScore}</span>
          )}
        </div>
        
        <div className="flex justify-end pt-2 border-t border-gray-100 mt-2">
          <div onClick={handleShareClick} className="hidden md:block">
            <ShareButton 
              url={shareUrl}
              title={shareTitle}
              description={description}
            />
          </div>
        </div>
      </div>
      {game.venue && (
        <div className="bg-gray-100 text-xs px-3 py-2 flex justify-between">
          <span>{game.venue}</span>
          <div onClick={handleShareClick} className="hidden md:block">
            <ShareButton 
              url={shareUrl}
              title={shareTitle}
              description={description}
              compact={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericGameCard;