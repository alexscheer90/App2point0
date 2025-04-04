import { Game } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { useMacSports } from "../hooks/useStandings";
import { format } from "date-fns";

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
  
  return (
    <div className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden border border-gray-200">
      <div className="bg-gray-100 text-xs font-semibold px-3 py-1 flex justify-between">
        <span>{sport.name} • {sport.gender !== "mixed" ? sport.gender.charAt(0).toUpperCase() + sport.gender.slice(1) : "Mixed"}</span>
        <span>{formattedDate}</span>
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
        </div>
        <div className="flex justify-between items-center">
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
        </div>
      </div>
      {game.venue && (
        <div className="bg-gray-100 text-xs px-3 py-2">
          <span>{game.venue}</span>
        </div>
      )}
    </div>
  );
};

export default UpcomingGameCard;
