import { Game } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { useMacSports } from "../hooks/useStandings";
import { format, formatDistanceToNow } from "date-fns";
import ShareButton from "./ShareButton";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { findSchoolByName, getTeamColors } from "../utils/teamLogoUtils";

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
  
  // Get team data, first try to match by ID from our MAC schools
  let homeTeam = schools.find(school => school.id === game.homeTeamId);
  let awayTeam = schools.find(school => school.id === game.awayTeamId);
  const sport = sports.find(sport => sport.id === game.sportId);
  
  // Extract team names from the game data
  const homeTeamName = game.homeTeamName || (homeTeam?.name) || game.homeTeamId || 'Unknown Team';
  const awayTeamName = game.awayTeamName || (awayTeam?.name) || game.awayTeamId || 'Unknown Team';
  
  // For non-MAC teams, try to find by name using the logo utility
  if (!homeTeam && game.homeTeamName) {
    homeTeam = findSchoolByName(game.homeTeamName);
  }
  
  if (!awayTeam && game.awayTeamName) {
    awayTeam = findSchoolByName(game.awayTeamName);
  }
  
  // Check if this is a MAC tournament/championship game
  const isMacConferenceGame = 
    homeTeamName.includes('Mid-American Conference') || 
    awayTeamName.includes('Mid-American Conference');
  
  // Create placeholder objects for unknown teams if needed
  const defaultHomeTeam = homeTeam || {
    id: game.homeTeamId || 'unknown',
    name: homeTeamName,
    shortName: homeTeamName.split(' ').pop() || 'UNK',
    mascot: "",
    primaryColor: isMacConferenceGame ? '#0B213E' : '#0099D8', // MAC navy or NCAA blue
    secondaryColor: '#ffffff',
    logoUrl: isMacConferenceGame && homeTeamName.includes('Mid-American Conference') 
      ? '/mac-logo.png' // MAC logo
      : '/attached_assets/IMG_0788.png' // NCAA logo
  };
  
  const defaultAwayTeam = awayTeam || {
    id: game.awayTeamId || 'unknown',
    name: awayTeamName,
    shortName: awayTeamName.split(' ').pop() || 'UNK',
    mascot: "",
    primaryColor: isMacConferenceGame ? '#0B213E' : '#0099D8', // MAC navy or NCAA blue
    secondaryColor: '#ffffff',
    logoUrl: isMacConferenceGame && awayTeamName.includes('Mid-American Conference') 
      ? '/mac-logo.png' // MAC logo
      : '/attached_assets/IMG_0788.png' // NCAA logo
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
                  onError={(e) => {
                    console.log(`Failed to load logo for: ${defaultHomeTeam.name} from ${defaultHomeTeam.logoUrl}`);
                    e.currentTarget.onerror = null; // Prevent infinite error loop
                    // Try to load a fallback logo if applicable
                    if (defaultHomeTeam.name?.toLowerCase().includes("mid-american conference")) {
                      e.currentTarget.src = "/school-logos/mac-conference.png";
                    } else if (defaultHomeTeam.name === "Bowling Green") {
                      e.currentTarget.src = "/school-logos/bowlinggreen.png";
                    } else if (defaultHomeTeam.name?.includes("Illinois-Chicago")) {
                      e.currentTarget.src = "/school-logos/affiliate/uic.png";
                    }
                  }}
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
                  onError={(e) => {
                    console.log(`Failed to load logo for: ${defaultAwayTeam.name}`);
                    e.currentTarget.onerror = null; // Prevent infinite error loop
                    // Try to load a fallback logo if applicable
                    if (defaultAwayTeam.name?.toLowerCase().includes("mid-american conference")) {
                      e.currentTarget.src = "/attached_assets/MAC logo.PNG";
                    } else if (defaultAwayTeam.name === "Bowling Green") {
                      e.currentTarget.src = "/attached_assets/BGSU.png";
                    } else if (defaultAwayTeam.name?.includes("Illinois-Chicago")) {
                      e.currentTarget.src = "/attached_assets/Chicago_State_Cougars_logo.svg.png";
                    }
                  }}
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
          {game.links?.s_boxscore ? (
            <a 
              href={game.links.s_boxscore} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline font-medium flex items-center gap-1 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <ChevronRight size={12} />
              Box Score
            </a>
          ) : (
            <span className="text-blue-600 flex items-center gap-1 text-xs" onClick={(e) => {
              e.stopPropagation();
              setLocation(`/games/${game.id}`);
            }}>
              <ChevronRight size={12} />
              Game Stats
            </span>
          )}
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
