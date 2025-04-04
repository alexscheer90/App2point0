import { Game } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { useMacSports } from "../hooks/useStandings";
import { format } from "date-fns";
import ShareButton from "./ShareButton";

interface UpcomingGameCardProps {
  game: Game;
}

const UpcomingGameCard = ({ game }: UpcomingGameCardProps) => {
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
  
  const homeTeam = schools.find(school => school.id === game.homeTeamId);
  const awayTeam = schools.find(school => school.id === game.awayTeamId);
  const sport = sports.find(sport => sport.id === game.sportId);
  
  if (!homeTeam || !awayTeam || !sport) {
    return null;
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
  const shareTitle = `${homeTeam.name} vs ${awayTeam.name} - ${readableDate}`;
  const description = `Don't miss this upcoming ${sport.name} matchup on Mobile #MACtion!`;
  
  const handleShareClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent any parent onClick from firing
    e.stopPropagation();
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
          <div className="flex items-center">
            {homeTeam.logoUrl ? (
              // When logo is available
              <div className="w-8 h-8 mr-3 flex items-center justify-center">
                <img 
                  src={homeTeam.logoUrl} 
                  alt={`${homeTeam.name} logo`} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              // Fallback to circular initial when no logo
              <div 
                className="w-8 h-8 rounded-full mr-3 flex items-center justify-center" 
                style={{ backgroundColor: homeTeam.primaryColor }}
              >
                <span className="text-xs font-bold" style={{ color: homeTeam.secondaryColor }}>
                  {homeTeam.shortName.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-semibold text-sm">{homeTeam.name}</span>
          </div>
          {game.isRivalryGame && (
            <span className="text-xs font-semibold text-[#C8102E] flex items-center">
              <span className="inline-block mr-1">🏆</span> Rivalry Game
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            {awayTeam.logoUrl ? (
              // When logo is available
              <div className="w-8 h-8 mr-3 flex items-center justify-center">
                <img 
                  src={awayTeam.logoUrl} 
                  alt={`${awayTeam.name} logo`} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              // Fallback to circular initial when no logo
              <div 
                className="w-8 h-8 rounded-full mr-3 flex items-center justify-center" 
                style={{ backgroundColor: awayTeam.primaryColor }}
              >
                <span className="text-xs font-bold" style={{ color: awayTeam.secondaryColor }}>
                  {awayTeam.shortName.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-semibold text-sm">{awayTeam.name}</span>
          </div>
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

export default UpcomingGameCard;
