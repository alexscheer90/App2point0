import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Game } from "@shared/schema";
import { useGames } from "../hooks/useScores";
import { useMacSchools } from "../hooks/useSchool";
import SportSelector from "../components/SportSelector";
import GenericGameCard from "../components/GenericGameCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// MAC colors
const MAC_NAVY = "#0B213E";
const MAC_GREEN = "#019E4F";

const SchedulePage = () => {
  const [selectedSport, setSelectedSport] = useState<string>("football");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [currentView, setCurrentView] = useState<"all" | "upcoming" | "past">("upcoming");
  
  const { data: games, isLoading: isGamesLoading } = useGames(selectedSport);
  const { data: schools } = useMacSchools();
  const { data: favoriteSchoolData } = useQuery<{ favoriteSchool: string | null }>({
    queryKey: ['/api/preferences/favorite-school'],
    select: (data) => data || { favoriteSchool: null }
  });
  
  const handleChangeSport = (sportId: string) => {
    setSelectedSport(sportId);
  };
  
  if (isGamesLoading || !schools) {
    return (
      <div className="py-4 px-4">
        <div className="mb-4">
          <Skeleton className="h-10 w-full max-w-xs" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  // Filter games based on selected team and view
  const filteredGames = games?.filter((game: Game) => {
    // Filter by team
    const teamFilter = 
      selectedTeam === "all" || 
      game.homeTeamId === selectedTeam || 
      game.awayTeamId === selectedTeam;
      
    // Filter by past, upcoming, or all
    const now = new Date();
    const gameDate = new Date(game.scheduledTime);
    
    const viewFilter = 
      currentView === "all" || 
      (currentView === "upcoming" && gameDate >= now) || 
      (currentView === "past" && gameDate < now);
      
    return teamFilter && viewFilter;
  }).sort((a: Game, b: Game) => {
    // Sort by date - upcoming games sorted by ascending date, past games by descending date
    const dateA = new Date(a.scheduledTime);
    const dateB = new Date(b.scheduledTime);
    
    return currentView === "past" 
      ? dateB.getTime() - dateA.getTime() // Past games: most recent first
      : dateA.getTime() - dateB.getTime(); // Upcoming games: soonest first
  });
  
  // Group games by date for better visual organization
  const gamesByDate: { [key: string]: Game[] } = {};
  
  filteredGames?.forEach((game: Game) => {
    const dateStr = format(parseISO(game.scheduledTime), 'yyyy-MM-dd');
    if (!gamesByDate[dateStr]) {
      gamesByDate[dateStr] = [];
    }
    gamesByDate[dateStr].push(game);
  });
  
  // Create iCalendar file for a specific game
  const createCalendarFile = (game: Game, homeTeamName: string, awayTeamName: string) => {
    const gameDate = new Date(game.scheduledTime);
    // End time is 3 hours after start for calendar purposes
    const endDate = new Date(gameDate.getTime() + 3 * 60 * 60 * 1000);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MAC Sports//MACtion App//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${game.id}@macsports.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(gameDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${awayTeamName} at ${homeTeamName}`,
      `DESCRIPTION:${awayTeamName} vs ${homeTeamName} - MAC Sports game`,
      `LOCATION:${game.venue || 'TBD'}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    return icsContent;
  };
  
  // Function to download the calendar file
  const downloadCalendarEvent = (game: Game, homeTeamName: string, awayTeamName: string) => {
    const icsContent = createCalendarFile(game, homeTeamName, awayTeamName);
    
    if (!icsContent) return;
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${awayTeamName}_at_${homeTeamName}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Component to render each game card
  const GameCard = ({ game }: { game: Game }) => {
    const homeTeam = schools.find(s => s.id === game.homeTeamId);
    const awayTeam = schools.find(s => s.id === game.awayTeamId);
    
    // Check if we have at least one MAC team in the game
    // If not both teams are MAC teams, use the GenericGameCard which can handle non-MAC teams
    if (!homeTeam || !awayTeam) {
      return <GenericGameCard game={game} />;
    }

    const gameDate = parseISO(game.scheduledTime);
    const isPastGame = gameDate < new Date();
    const isFavoriteTeamGame = favoriteSchoolData?.favoriteSchool && 
      (game.homeTeamId === favoriteSchoolData.favoriteSchool || 
       game.awayTeamId === favoriteSchoolData.favoriteSchool);
    
    return (
      <div 
        className={`p-4 mb-3 rounded-lg shadow-sm border ${isFavoriteTeamGame ? 'border-green-500' : 'border-gray-200'}`}
        style={{ backgroundColor: isFavoriteTeamGame ? `${MAC_GREEN}10` : 'white' }}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">
              {format(gameDate, 'h:mm a')}
            </span>
          </div>
          
          {game.venue && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm text-gray-600 truncate max-w-[150px]">
                {game.venue}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          {/* Away Team */}
          <div className="flex items-center">
            <div className="w-8 h-8 flex-shrink-0 mr-2">
              <img 
                src={awayTeam.logoUrl} 
                alt={`${awayTeam.name} logo`} 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-medium">{awayTeam.name}</p>
              {isPastGame && game.status === "final" && (
                <p className="text-sm font-bold">{game.awayTeamScore}</p>
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 font-medium">
            {isPastGame ? 'FINAL' : 'AT'}
          </div>
          
          {/* Home Team */}
          <div className="flex items-center justify-end">
            <div>
              <p className="font-medium text-right">{homeTeam.name}</p>
              {isPastGame && game.status === "final" && (
                <p className="text-sm font-bold text-right">{game.homeTeamScore}</p>
              )}
            </div>
            <div className="w-8 h-8 flex-shrink-0 ml-2">
              <img 
                src={homeTeam.logoUrl} 
                alt={`${homeTeam.name} logo`} 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
        
        {!isPastGame && (
          <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Add to Calendar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add to Calendar</DialogTitle>
                  <DialogDescription>
                    {awayTeam.name} at {homeTeam.name} on {format(gameDate, 'MMMM d, yyyy')}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-3 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => downloadCalendarEvent(game, homeTeam.name, awayTeam.name)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Download .ics File
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    The .ics file works with most calendar apps including Google Calendar, Apple Calendar, and Outlook.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            
            {game.ticketUrl && (
              <Button 
                variant="default" 
                size="sm" 
                className="text-xs" 
                style={{ backgroundColor: MAC_GREEN }}
                onClick={() => window.open(game.ticketUrl, '_blank')}
              >
                Get Tickets
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="py-4 px-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4">
        <SportSelector 
          selectedSport={selectedSport}
          onChange={handleChangeSport}
        />
        
        <Select value={selectedTeam} onValueChange={(value) => setSelectedTeam(value)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            {favoriteSchoolData?.favoriteSchool && (
              <SelectItem value={favoriteSchoolData.favoriteSchool}>
                My Team
              </SelectItem>
            )}
            {schools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* View Tabs */}
      <Tabs
        defaultValue="upcoming"
        value={currentView}
        onValueChange={(value) => setCurrentView(value as "all" | "upcoming" | "past")}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-3 w-full md:w-[360px]">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Completed</TabsTrigger>
          <TabsTrigger value="all">All Games</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Game List */}
      <div>
        {Object.keys(gamesByDate).length > 0 ? (
          Object.keys(gamesByDate).map(dateStr => (
            <div key={dateStr} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {format(parseISO(dateStr), 'EEEE, MMMM d, yyyy')}
              </h3>
              <div>
                {gamesByDate[dateStr].map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No games found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;