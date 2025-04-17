import { Game } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { useMacSports } from "../hooks/useStandings";
import { format, formatDistanceToNow } from "date-fns";
import ShareButton from "./ShareButton";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

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
  
  // Extract team names from the game data
  const homeTeamName = game.homeTeamName || (homeTeam?.name) || game.homeTeamId || 'Unknown Team';
  const awayTeamName = game.awayTeamName || (awayTeam?.name) || game.awayTeamId || 'Unknown Team';
  
  // Get short names for the teams
  const homeShortName = homeTeamName.split(' ').pop() || 'UNK';
  const awayShortName = awayTeamName.split(' ').pop() || 'UNK';
  
  // Create placeholder objects for unknown teams if needed
  const defaultHomeTeam = homeTeam || {
    id: game.homeTeamId || 'unknown',
    name: homeTeamName,
    shortName: homeShortName,
    primaryColor: '#0099D8', // NCAA blue color
    secondaryColor: '#ffffff',
    logoUrl: '/attached_assets/IMG_0788.png' // Direct path to NCAA logo
  };
  
  const defaultAwayTeam = awayTeam || {
    id: game.awayTeamId || 'unknown',
    name: awayTeamName,
    shortName: awayShortName,
    primaryColor: '#0099D8', // NCAA blue color
    secondaryColor: '#ffffff',
    logoUrl: '/attached_assets/IMG_0788.png' // Direct path to NCAA logo
  };
  
  if (!sport) {
    return null;
  }
  
  // Format the date for display
  const gameDate = new Date(game.startTime);
  const timeAgo = formatDistanceToNow(gameDate, { addSuffix: true });
  
  // Create a share URL for the game
  const shareUrl = `/games/${game.id}`;
  
  // Create share content
  const shareTitle = `Final: ${defaultHomeTeam.name} ${game.homeTeamScore}, ${defaultAwayTeam.name} ${game.awayTeamScore}`;
  const description = `Check out the final score of this ${sport.name} game from Mobile #MACtion!`;
  
  const handleShareClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent any parent onClick from firing
    e.stopPropagation();
  };
  
  // Set up navigation
  const [_, setLocation] = useLocation();
  
  // Handle click to navigate to game stats page
  const handleGameClick = () => {
    // For completed games, we'll always show stats
    setLocation(`/games/${game.id}`);
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleGameClick}
    >
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
            {defaultHomeTeam.logoUrl ? (
              // When logo is available
              <div className="w-8 h-8 mr-3 flex items-center justify-center">
                <img 
                  src={defaultHomeTeam.logoUrl} 
                  alt={`${defaultHomeTeam.name} logo`} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              // Fallback to circular initial when no logo
              <div 
                className="w-8 h-8 rounded-full mr-3 flex items-center justify-center" 
                style={{ backgroundColor: defaultHomeTeam.primaryColor }}
              >
                <span className="text-xs font-bold" style={{ color: defaultHomeTeam.secondaryColor }}>
                  {defaultHomeTeam.shortName.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-semibold text-sm">{defaultHomeTeam.name}</span>
          </div>
          <span className="font-bold text-lg">{game.homeTeamScore}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            {defaultAwayTeam.logoUrl ? (
              // When logo is available
              <div className="w-8 h-8 mr-3 flex items-center justify-center">
                <img 
                  src={defaultAwayTeam.logoUrl} 
                  alt={`${defaultAwayTeam.name} logo`} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              // Fallback to circular initial when no logo
              <div 
                className="w-8 h-8 rounded-full mr-3 flex items-center justify-center" 
                style={{ backgroundColor: defaultAwayTeam.primaryColor }}
              >
                <span className="text-xs font-bold" style={{ color: defaultAwayTeam.secondaryColor }}>
                  {defaultAwayTeam.shortName.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-semibold text-sm">{defaultAwayTeam.name}</span>
          </div>
          <span className="font-bold text-lg">{game.awayTeamScore}</span>
        </div>
        
        <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
          <span className="text-blue-600 flex items-center gap-1 text-xs" onClick={(e) => {
            e.stopPropagation();
            setLocation(`/games/${game.id}`);
          }}>
            <ChevronRight size={12} />
            Box Score
          </span>
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
