import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Game as BaseGame } from "@shared/schema";
import { Link } from "wouter";
import { findSchoolByName } from "../utils/findSchoolByName";
import { ExternalLink } from "lucide-react";
import { getSportDisplayName, getSportBadgeStyle, MAC_GREEN, MAC_NAVY } from "../utils/sportUtils";
import { getTeamLogo } from "../utils/teamLogoMap";

// Extended Game interface with additional properties used in the UI
interface Game extends BaseGame {
  isConference?: boolean;
  statsUrl?: string;
  videoUrl?: string;
  tvChannel?: string;
}

// Using MAC colors imported from sportUtils

interface TableScheduleViewProps {
  games: Game[];
  date: Date;
  showLogos?: boolean;
}

export default function TableScheduleView({ games, date, showLogos = false }: TableScheduleViewProps) {
  // Group games by sport
  const sportGroups = useMemo(() => {
    // Sort games by start time first
    const sortedGames = [...games].sort((a, b) => {
      // Parse time strings to Date objects for comparison
      const timeA = a.scheduledTime ? new Date(a.scheduledTime) : new Date(0);
      const timeB = b.scheduledTime ? new Date(b.scheduledTime) : new Date(0);
      return timeA.getTime() - timeB.getTime();
    });
    
    // Group by sport
    const groups: Record<string, Game[]> = {};
    
    sortedGames.forEach(game => {
      // Get normalized sport name
      const sportId = game.sportId || "unknown";
      const sportName = getSportDisplayName(sportId);
      
      // Create group if it doesn't exist
      if (!groups[sportName]) {
        groups[sportName] = [];
      }
      
      // Add game to group
      groups[sportName].push(game);
    });
    
    return groups;
  }, [games]);
  
  const formatLocation = (game: Game) => {
    if (!game.location) return "";
    
    let location = game.location;
    
    // Add conference indicator if available
    if (game.isConference) {
      location += " / (Conf.)";
    }
    
    return location;
  };
  
  const formatGameTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return "";
    
    try {
      const date = parseISO(dateTimeStr);
      return format(date, "h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateTimeStr;
    }
  };
  
  const renderLinks = (game: Game) => {
    const links: JSX.Element[] = [];
    
    if (game.statsUrl) {
      links.push(
        <a 
          key="stats" 
          href={game.statsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline inline-flex items-center mr-2"
        >
          Stats
        </a>
      );
    }
    
    if (game.videoUrl) {
      links.push(
        <a 
          key="video" 
          href={game.videoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline inline-flex items-center mr-2"
        >
          Video
        </a>
      );
    }
    
    if (game.tvChannel) {
      links.push(
        <span key="tv" className="text-gray-700 inline-flex items-center">
          TV: {game.tvChannel}
        </span>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {links}
      </div>
    );
  };
  
  const getTeamLogo = (teamName: string | null | undefined, teamId: string | null | undefined) => {
    if (!teamName) return null;
    
    const schoolInfo = findSchoolByName(teamName, teamId || undefined);
    // The logoPath comes from the findSchoolByName utility
    return schoolInfo?.logoPath;
  };
  
  const renderTeam = (teamName: string | null | undefined, teamId: string | null | undefined, isHome: boolean) => {
    if (!teamName) return <span>TBD</span>;
    
    const logo = showLogos ? getTeamLogo(teamName, teamId) : null;
    const schoolInfo = findSchoolByName(teamName, teamId || undefined);
    
    const displayName = schoolInfo?.name || teamName;
    
    // In findSchoolByName, MAC schools have the isMacSchool property
    // Used to determine if we should link to the school profile
    if (schoolInfo?.isMacSchool && teamId) {
      return (
        <Link to={`/schools/${teamId}`} className="hover:underline flex items-center">
          {logo && <img src={logo} alt={displayName} className="w-5 h-5 mr-2" />}
          <span>{displayName}</span>
        </Link>
      );
    }
    
    // Otherwise, just display the name
    return (
      <div className="flex items-center">
        {logo && <img src={logo} alt={displayName} className="w-5 h-5 mr-2" />}
        <span>{displayName}</span>
      </div>
    );
  };
  
  // If no games to display
  if (Object.keys(sportGroups).length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No games scheduled for {format(date, "MMMM d, yyyy")}</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden">
      {Object.entries(sportGroups).map(([sportName, sportGames]) => (
        <div key={sportName} className="mb-6 overflow-hidden rounded-lg shadow-sm border border-gray-200">
          <div 
            className="py-2 px-4 font-medium text-white"
            style={{ backgroundColor: MAC_GREEN }}
          >
            {format(date, "EEEE, MMMM d, yyyy")} — {sportName}
          </div>
          
          <div className="overflow-x-auto bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Away</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Home</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Time</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sportGames.map((game, index) => (
                  <tr 
                    key={game.id} 
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {renderTeam(game.awayTeamName, game.awayTeamId, false)}
                    </td>
                    <td className="px-4 py-3">
                      {renderTeam(game.homeTeamName, game.homeTeamId, true)}
                    </td>
                    <td className="px-4 py-3">
                      {formatGameTime(game.scheduledTime)}
                    </td>
                    <td className="px-4 py-3">
                      {formatLocation(game)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}