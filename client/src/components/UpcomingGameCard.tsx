import { Game } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { useMacSports } from "../hooks/useStandings";
import { format } from "date-fns";
import ShareButton from "./ShareButton";
import { generateLiveStatsUrl } from "../utils/liveStatsUtils";
import { ExternalLink, Ticket } from "lucide-react";
import { findSchoolByName, getTeamColors } from "../utils/teamLogoUtils";

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
  
  // Get team data, first try to match by ID from our MAC schools
  let homeTeam = schools.find(school => school.id === game.homeTeamId);
  let awayTeam = schools.find(school => school.id === game.awayTeamId);
  const sport = sports.find(sport => sport.id === game.sportId);
  
  // For non-MAC teams, try to find by name using the logo utility
  if (!homeTeam && game.homeTeamName) {
    homeTeam = findSchoolByName(game.homeTeamName);
  }
  
  if (!awayTeam && game.awayTeamName) {
    awayTeam = findSchoolByName(game.awayTeamName);
  }
  
  if (!sport) {
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
  const shareTitle = `${homeTeam?.name || game.homeTeamName || 'Home Team'} vs ${awayTeam?.name || game.awayTeamName || 'Away Team'} - ${readableDate}`;
  const description = `Don't miss this upcoming ${sport.name} matchup on Mobile #MACtion!`;
  
  const handleShareClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent any parent onClick from firing
    e.stopPropagation();
  };
  
  // Generate live stats URL for using on game day
  const liveStatsUrl = game.liveStatsUrl || (homeTeam ? generateLiveStatsUrl(homeTeam, sport) : '');
  
  // Handle click to open tickets or game info in a new tab
  const handleGameClick = () => {
    if (game.ticketUrl) {
      window.open(game.ticketUrl, '_blank', 'noopener,noreferrer');
    } else if (liveStatsUrl) {
      window.open(liveStatsUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  const isClickable = game.ticketUrl || liveStatsUrl;
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm mb-3 overflow-hidden border border-gray-200 ${isClickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={isClickable ? handleGameClick : undefined}
    >
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
            {homeTeam && homeTeam.logoUrl ? (
              // When logo is available
              <div className="w-8 h-8 mr-3 flex items-center justify-center">
                <img 
                  src={homeTeam.logoUrl} 
                  alt={`${homeTeam.name} logo`} 
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    console.log(`Failed to load logo for: ${homeTeam.name} from ${homeTeam.logoUrl}`);
                    e.currentTarget.onerror = null; // Prevent infinite error loop
                    
                    // Explicit handling for Michigan schools
                    if (homeTeam.name === "Central Michigan" || 
                        homeTeam.id === "centralmichigan" || 
                        homeTeam.name.includes("Central Michigan")) {
                      e.currentTarget.src = "/school-logos/centralmichigan.png";
                      return;
                    } else if (homeTeam.name === "Eastern Michigan" || 
                               homeTeam.id === "easternmichigan" || 
                               homeTeam.name.includes("Eastern Michigan")) {
                      e.currentTarget.src = "/school-logos/easternmichigan.png";
                      return;
                    } else if (homeTeam.name === "Western Michigan" || 
                               homeTeam.id === "westernmichigan" || 
                               homeTeam.name.includes("Western Michigan")) {
                      e.currentTarget.src = "/school-logos/westernmichigan.png";
                      return;
                    } else if (homeTeam.name === "Michigan" || 
                               homeTeam.id === "michigan" || 
                               homeTeam.name.includes("University of Michigan")) {
                      e.currentTarget.src = "/school-logos/non-mac/michigan.png";
                      return;
                    }
                    
                    // Other special cases
                    if (homeTeam.name?.toLowerCase().includes("mid-american conference")) {
                      e.currentTarget.src = "/school-logos/mac-conference.png";
                    } else if (homeTeam.name === "Bowling Green") {
                      e.currentTarget.src = "/school-logos/bowlinggreen.png";
                    } else if (homeTeam.name?.includes("Illinois-Chicago")) {
                      e.currentTarget.src = "/school-logos/affiliate/uic.png";
                    } else {
                      // Generic fallback to NCAA logo
                      e.currentTarget.src = "/school-logos/ncaa.png";
                    }
                  }}
                />
              </div>
            ) : homeTeam ? (
              // Fallback to circular initial when no logo
              <div 
                className="w-8 h-8 rounded-full mr-3 flex items-center justify-center" 
                style={{ backgroundColor: homeTeam.primaryColor }}
              >
                <span className="text-xs font-bold" style={{ color: homeTeam.secondaryColor }}>
                  {homeTeam.shortName.charAt(0)}
                </span>
              </div>
            ) : (
              // Generic placeholder when no team info
              <div className="w-8 h-8 rounded-full mr-3 bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">?</span>
              </div>
            )}
            <span className="font-semibold text-sm">{homeTeam?.name || game.homeTeamName || 'Home Team'}</span>
          </div>
          {game.isRivalryGame && (
            <span className="text-xs font-semibold text-[#C8102E] flex items-center">
              <span className="inline-block mr-1">🏆</span> Rivalry Game
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            {awayTeam && awayTeam.logoUrl ? (
              // When logo is available
              <div className="w-8 h-8 mr-3 flex items-center justify-center">
                <img 
                  src={awayTeam.logoUrl} 
                  alt={`${awayTeam.name} logo`} 
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    console.log(`Failed to load logo for: ${awayTeam.name} from ${awayTeam.logoUrl}`);
                    e.currentTarget.onerror = null; // Prevent infinite error loop
                    
                    // Explicit handling for Michigan schools
                    if (awayTeam.name === "Central Michigan" || 
                        awayTeam.id === "centralmichigan" || 
                        awayTeam.name.includes("Central Michigan")) {
                      e.currentTarget.src = "/school-logos/centralmichigan.png";
                      return;
                    } else if (awayTeam.name === "Eastern Michigan" || 
                               awayTeam.id === "easternmichigan" || 
                               awayTeam.name.includes("Eastern Michigan")) {
                      e.currentTarget.src = "/school-logos/easternmichigan.png";
                      return;
                    } else if (awayTeam.name === "Western Michigan" || 
                               awayTeam.id === "westernmichigan" || 
                               awayTeam.name.includes("Western Michigan")) {
                      e.currentTarget.src = "/school-logos/westernmichigan.png";
                      return;
                    } else if (awayTeam.name === "Michigan" || 
                               awayTeam.id === "michigan" || 
                               awayTeam.name.includes("University of Michigan")) {
                      e.currentTarget.src = "/school-logos/non-mac/michigan.png";
                      return;
                    }
                    
                    // Other special cases
                    if (awayTeam.name?.toLowerCase().includes("mid-american conference")) {
                      e.currentTarget.src = "/school-logos/mac-conference.png";
                    } else if (awayTeam.name === "Bowling Green") {
                      e.currentTarget.src = "/school-logos/bowlinggreen.png";
                    } else if (awayTeam.name?.includes("Illinois-Chicago")) {
                      e.currentTarget.src = "/school-logos/affiliate/uic.png";
                    } else {
                      // Generic fallback to NCAA logo
                      e.currentTarget.src = "/school-logos/ncaa.png";
                    }
                  }}
                />
              </div>
            ) : awayTeam ? (
              // Fallback to circular initial when no logo
              <div 
                className="w-8 h-8 rounded-full mr-3 flex items-center justify-center" 
                style={{ backgroundColor: awayTeam.primaryColor }}
              >
                <span className="text-xs font-bold" style={{ color: awayTeam.secondaryColor }}>
                  {awayTeam.shortName.charAt(0)}
                </span>
              </div>
            ) : (
              // Generic placeholder when no team info
              <div className="w-8 h-8 rounded-full mr-3 bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">?</span>
              </div>
            )}
            <span className="font-semibold text-sm">{awayTeam?.name || game.awayTeamName || 'Away Team'}</span>
          </div>
        </div>
        
        <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
          <div className="flex items-center gap-3">
            {game.ticketUrl && (
              <span className="text-green-600 flex items-center gap-1 text-xs" onClick={(e) => {
                e.stopPropagation();
                window.open(game.ticketUrl, '_blank', 'noopener,noreferrer');
              }}>
                <Ticket size={12} />
                Tickets
              </span>
            )}
            {liveStatsUrl && (
              <span className="text-blue-600 flex items-center gap-1 text-xs" onClick={(e) => {
                e.stopPropagation();
                window.open(liveStatsUrl, '_blank', 'noopener,noreferrer');
              }}>
                <ExternalLink size={12} />
                Game Info
              </span>
            )}
          </div>
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
