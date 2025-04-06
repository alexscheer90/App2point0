import { Game } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { useMacSports } from "../hooks/useStandings";
import ShareButton from "./ShareButton";
import { format } from "date-fns";
import ncaaLogoPath from "@assets/NCAA_logo.svg.png";

interface GameScoreCardProps {
  game: Game;
}

const GameScoreCard = ({ game }: GameScoreCardProps) => {
  const { data: schools, isLoading: schoolsLoading } = useMacSchools();
  const { data: sports, isLoading: sportsLoading } = useMacSports();
  
  if (schoolsLoading || sportsLoading || !schools || !sports) {
    return (
      <div className="bg-white rounded-lg shadow-md mb-3 overflow-hidden border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }
  
  const homeTeam = schools.find(school => school.id === game.homeTeamId);
  const awayTeam = schools.find(school => school.id === game.awayTeamId);
  const sport = sports.find(sport => sport.id === game.sportId);
  
  if (!sport) {
    return null;
  }
  
  // If either team is not in our MAC schools, use a generic NCAA team object
  const ncaaTeam = {
    id: 'ncaa',
    name: 'NCAA Opponent',
    shortName: 'NCAA',
    logoUrl: ncaaLogoPath,
    primaryColor: '#0089D0',
    secondaryColor: '#FFFFFF',
    mascot: 'NCAA',
    city: '',
    state: '',
  };
  
  // Use NCAA team placeholder if team not found in schools array
  const finalHomeTeam = homeTeam || { 
    ...ncaaTeam, 
    name: game.homeTeamId === 'TBD' ? 'TBD' : 'NCAA Opponent' 
  };
  
  const finalAwayTeam = awayTeam || { 
    ...ncaaTeam, 
    name: game.awayTeamId === 'TBD' ? 'TBD' : 'NCAA Opponent'
  };
  
  // Create a share URL for the game
  const shareUrl = `/games/${game.id}`;
  
  // Create a share title based on the game status
  let shareTitle = '';
  let description = '';
  
  if (game.status === 'final') {
    shareTitle = `Final: ${finalHomeTeam.name} ${game.homeTeamScore}, ${finalAwayTeam.name} ${game.awayTeamScore}`;
    description = `Check out the final score of this ${sport.name} game from Mobile #MACtion!`;
  } else if (game.status === 'live') {
    shareTitle = `LIVE: ${finalHomeTeam.name} ${game.homeTeamScore}, ${finalAwayTeam.name} ${game.awayTeamScore}`;
    description = `Watch this ${sport.name} game live on Mobile #MACtion!`;
  } else {
    const gameDate = game.startTime ? format(new Date(game.startTime), 'MMM d, yyyy') : '';
    shareTitle = `${finalHomeTeam.name} vs ${finalAwayTeam.name} - ${gameDate}`;
    description = `Don't miss this upcoming ${sport.name} matchup on Mobile #MACtion!`;
  }
  
  const handleShareClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent any parent onClick from firing
    e.stopPropagation();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md mb-3 overflow-hidden border border-gray-200">
      <div className="bg-[#0C2340] text-white text-xs font-semibold px-3 py-1 flex justify-between">
        <span>{sport.name} • {sport.gender !== "mixed" ? sport.gender.charAt(0).toUpperCase() + sport.gender.slice(1) : "Mixed"}</span>
        <div className="flex items-center space-x-2">
          {game.status === 'live' && (
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#28A745] mr-1 animate-pulse"></span>
              LIVE • {game.period || ""}
            </span>
          )}
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
            {finalHomeTeam.logoUrl ? (
              // When logo is available
              <div className="w-8 h-8 mr-3 flex items-center justify-center">
                <img 
                  src={finalHomeTeam.logoUrl} 
                  alt={`${finalHomeTeam.name} logo`} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              // Fallback to circular initial when no logo
              <div 
                className="w-8 h-8 rounded-full mr-3 flex items-center justify-center" 
                style={{ backgroundColor: finalHomeTeam.primaryColor }}
              >
                <span className="text-xs font-bold" style={{ color: finalHomeTeam.secondaryColor }}>
                  {finalHomeTeam.shortName.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-semibold text-sm">{finalHomeTeam.name}</span>
          </div>
          <span className="font-bold text-lg">{game.homeTeamScore}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {finalAwayTeam.logoUrl ? (
              // When logo is available
              <div className="w-8 h-8 mr-3 flex items-center justify-center">
                <img 
                  src={finalAwayTeam.logoUrl} 
                  alt={`${finalAwayTeam.name} logo`} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              // Fallback to circular initial when no logo
              <div 
                className="w-8 h-8 rounded-full mr-3 flex items-center justify-center" 
                style={{ backgroundColor: finalAwayTeam.primaryColor }}
              >
                <span className="text-xs font-bold" style={{ color: finalAwayTeam.secondaryColor }}>
                  {finalAwayTeam.shortName.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-semibold text-sm">{finalAwayTeam.name}</span>
          </div>
          <span className="font-bold text-lg">{game.awayTeamScore}</span>
        </div>
      </div>
      {game.situation && (
        <div className="bg-gray-100 text-xs px-3 py-2 flex justify-between">
          <span>{game.situation}</span>
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
      {!game.situation && (
        <div className="bg-gray-100 text-xs px-3 py-2 flex justify-end">
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

export default GameScoreCard;
