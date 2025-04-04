import { Game } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { useMacSports } from "../hooks/useStandings";
import { format, formatDistanceToNow } from "date-fns";
import ShareButton from "./ShareButton";

interface CompletedGameCardProps {
  game: Game;
}

const CompletedGameCard = ({ game }: CompletedGameCardProps) => {
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
  
  // Format the date for display
  const gameDate = new Date(game.startTime);
  const timeAgo = formatDistanceToNow(gameDate, { addSuffix: true });
  
  // Create a share URL for the game
  const shareUrl = `/games/${game.id}`;
  
  // Create share content
  const shareTitle = `Final: ${homeTeam.name} ${game.homeTeamScore}, ${awayTeam.name} ${game.awayTeamScore}`;
  const description = `Check out the final score of this ${sport.name} game from Mobile #MACtion!`;
  
  const handleShareClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent any parent onClick from firing
    e.stopPropagation();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden border border-gray-200">
      <div className="bg-gray-100 text-xs font-semibold px-3 py-1 flex justify-between items-center">
        <span>{sport.name}</span>
        <div className="flex items-center space-x-2">
          <span>Final • {timeAgo}</span>
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
            <div 
              className="w-8 h-8 rounded-full mr-3 flex items-center justify-center" 
              style={{ backgroundColor: homeTeam.primaryColor }}
            >
              <span className="text-xs font-bold" style={{ color: homeTeam.secondaryColor }}>
                {homeTeam.shortName.charAt(0)}
              </span>
            </div>
            <span className="font-semibold text-sm">{homeTeam.name}</span>
          </div>
          <span className="font-bold text-lg">{game.homeTeamScore}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full mr-3 flex items-center justify-center" 
              style={{ backgroundColor: awayTeam.primaryColor }}
            >
              <span className="text-xs font-bold" style={{ color: awayTeam.secondaryColor }}>
                {awayTeam.shortName.charAt(0)}
              </span>
            </div>
            <span className="font-semibold text-sm">{awayTeam.name}</span>
          </div>
          <span className="font-bold text-lg">{game.awayTeamScore}</span>
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
    </div>
  );
};

export default CompletedGameCard;
