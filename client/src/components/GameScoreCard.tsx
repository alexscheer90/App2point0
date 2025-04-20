import { Game } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { useMacSports } from "../hooks/useStandings";
import ShareButton from "./ShareButton";
import { format } from "date-fns";
import { shouldShowLiveStats } from "../utils/liveStatsUtils";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { findSchoolByName, getTeamColors } from "../utils/teamLogoUtils";

// Sport display name mapping for consistent naming across the application
const SPORT_DISPLAY_NAMES: Record<string, string> = {
  "baseball": "Baseball",
  "mbball": "Basketball - Men",
  "wbball": "Basketball - Women",
  "xc": "Cross Country",
  "fhockey": "Field Hockey",
  "football": "Football",
  "golf": "Golf",
  "mgolf": "Golf",
  "wgolf": "Golf",
  "gym": "Gymnastics",
  "wlax": "Lacrosse",
  "wsoc": "Soccer - Women",
  "softball": "Softball",
  "swimming": "Swimming & Diving",
  "mswim": "Swimming & Diving",
  "wswim": "Swimming & Diving",
  "tennis": "Tennis",
  "mten": "Tennis",
  "wten": "Tennis",
  "track": "Track & Field",
  "wvball": "Volleyball",
  "wrestling": "Wrestling"
};

// Helper function to get the display name for a sport
const getSportDisplayName = (sportId: string): string => {
  return SPORT_DISPLAY_NAMES[sportId] || "";
};

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
  
  // Extract team names from the game data
  const homeTeamName = game.homeTeamName || (homeTeam?.name) || game.homeTeamId || 'Unknown Team';
  const awayTeamName = game.awayTeamName || (awayTeam?.name) || game.awayTeamId || 'Unknown Team';
  
  // Get short names for the teams
  const homeShortName = homeTeamName.split(' ').pop() || 'UNK';
  const awayShortName = awayTeamName.split(' ').pop() || 'UNK';
  
  // Check if this is a MAC tournament/championship game
  const isMacConferenceGame = 
    homeTeamName.includes('Mid-American Conference') || 
    awayTeamName.includes('Mid-American Conference');
  
  // Use the findSchoolByName utility to get team data
  const foundHomeTeam = !homeTeam ? findSchoolByName(homeTeamName) : null;
  const foundAwayTeam = !awayTeam ? findSchoolByName(awayTeamName) : null;
  
  // Create placeholder objects for unknown teams if needed
  const defaultHomeTeam = homeTeam || foundHomeTeam || {
    id: game.homeTeamId || 'unknown',
    name: homeTeamName,
    shortName: homeShortName,
    primaryColor: isMacConferenceGame ? '#0B213E' : '#0099D8', // MAC navy or NCAA blue
    secondaryColor: '#ffffff',
    logoUrl: isMacConferenceGame && homeTeamName.includes('Mid-American Conference') 
      ? '/mac-logo.png' // MAC logo
      : '/attached_assets/IMG_0788.png' // NCAA logo
  };
  
  const defaultAwayTeam = awayTeam || foundAwayTeam || {
    id: game.awayTeamId || 'unknown',
    name: awayTeamName,
    shortName: awayShortName,
    primaryColor: isMacConferenceGame ? '#0B213E' : '#0099D8', // MAC navy or NCAA blue 
    secondaryColor: '#ffffff',
    logoUrl: isMacConferenceGame && awayTeamName.includes('Mid-American Conference') 
      ? '/mac-logo.png' // MAC logo
      : '/attached_assets/IMG_0788.png' // NCAA logo
  };
  
  if (!sport) {
    return null;
  }
  
  // Create a share URL for the game
  const shareUrl = `/games/${game.id}`;
  
  // Create a share title based on the game status
  let shareTitle = '';
  let description = '';
  
  if (game.status === 'final') {
    shareTitle = `Final: ${defaultHomeTeam.name} ${game.homeTeamScore}, ${defaultAwayTeam.name} ${game.awayTeamScore}`;
    description = `Check out the final score of this ${sport.name} game from Mobile #MACtion!`;
  } else if (game.status === 'live') {
    shareTitle = `LIVE: ${defaultHomeTeam.name} ${game.homeTeamScore}, ${defaultAwayTeam.name} ${game.awayTeamScore}`;
    description = `Watch this ${sport.name} game live on Mobile #MACtion!`;
  } else {
    const gameDate = game.startTime ? format(new Date(game.startTime), 'MMM d, yyyy') : '';
    shareTitle = `${defaultHomeTeam.name} vs ${defaultAwayTeam.name} - ${gameDate}`;
    description = `Don't miss this upcoming ${sport.name} matchup on Mobile #MACtion!`;
  }
  
  const handleShareClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent any parent onClick from firing
    e.stopPropagation();
  };
  
  // Set up navigation
  const [_, setLocation] = useLocation();
  
  // Check if stats are available for this game
  const hasStats = shouldShowLiveStats(game.status);
  
  // Check if the home team has a Sidearm URL for fetching live stats
  const hasSidearmStats = Boolean(
    (homeTeam?.sidearmUrl || homeTeam?.sidearmScoresApi) &&
    hasStats
  );
  
  // Handle click to navigate to game stats page
  const handleGameClick = () => {
    if (hasStats) {
      setLocation(`/games/${game.id}`);
    }
  };
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md mb-3 overflow-hidden border border-gray-200 ${hasStats ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`} 
      onClick={hasStats ? handleGameClick : undefined}
    >
      <div className="bg-[#0C2340] text-white text-xs font-semibold px-3 py-1 flex justify-between">
        <span>
          {getSportDisplayName(sport.id) || sport.name}
        </span>
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
        <div className="flex justify-between items-center">
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
      </div>
      {game.situation ? (
        <div className="bg-gray-100 text-xs px-3 py-2 flex justify-between">
          <span>{game.situation}</span>
          <div className="flex items-center gap-2">
            {game.status === 'final' && game.links?.s_boxscore && (
              <a 
                href={game.links.s_boxscore} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline font-medium flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <ChevronRight size={12} />
                Box Score
              </a>
            )}
            {hasStats && (
              <span 
                className={`${hasSidearmStats ? 'text-green-600' : 'text-blue-600'} flex items-center gap-1`} 
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation(`/games/${game.id}`);
                }}
              >
                <ChevronRight size={12} />
                {hasSidearmStats ? 'Live Stats' : 'Stats'}
              </span>
            )}
            <div onClick={handleShareClick} className="hidden md:block">
              <ShareButton 
                url={shareUrl}
                title={shareTitle}
                description={description}
                compact={true}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 text-xs px-3 py-2 flex flex-col">
          <div className="flex justify-between items-center">
            {hasStats && (
              <span 
                className={`${hasSidearmStats ? 'text-green-600' : 'text-blue-600'} flex items-center gap-1`} 
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation(`/games/${game.id}`);
                }}
              >
                <ChevronRight size={12} />
                {hasSidearmStats ? 'Live Stats' : 'View Stats'}
              </span>
            )}
            <div onClick={handleShareClick} className="hidden md:block">
              <ShareButton 
                url={shareUrl}
                title={shareTitle}
                description={description}
                compact={true}
              />
            </div>
          </div>
          
          {/* Links section */}
          {game.links && (Object.values(game.links).some(Boolean)) && (
            <div className="pt-2 mt-1 border-t border-gray-200 flex gap-3">
              {game.status === 'final' && game.links.s_boxscore && (
                <a 
                  href={game.links.s_boxscore} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Box Score
                </a>
              )}
              {game.links.s_livestats && (
                <a 
                  href={game.links.s_livestats} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Live Stats
                </a>
              )}
              {game.links.s_audio && (
                <a 
                  href={game.links.s_audio} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Audio
                </a>
              )}
              {game.links.s_video && (
                <a 
                  href={game.links.s_video} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Video
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameScoreCard;
