import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getMonth, getYear, addMonths, subMonths, isSameDay, getDay, addHours } from "date-fns";
import { Calendar, Clock, MapPin, CalendarIcon, Tag, ChevronLeft, ChevronRight, BarChart2 } from "lucide-react";
import { Game } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { useMacCalendar } from "../hooks/useMacCalendar";
import { useMacCalendarEvents } from "../hooks/useMacCalendarEvents";
import { queryClient } from "../lib/queryClient";
import SportSelector from "../components/SportSelector";
import { getTeamLogoUrl } from "../utils/teamLogoUtils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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

// Function to get sport name and handle all variants of IDs
const getSportName = (sportId: string): string => {
  // Normalize the sport ID for consistent matching
  const normalizedId = sportId.toLowerCase().trim();
  
  // Handle men's and women's basketball IDs (both genders exist in MAC)
  if (normalizedId === 'mbball' || normalizedId === 'm-basketball' || 
    (normalizedId.includes('basketball') && normalizedId.includes('men'))) {
    return "Men's Basketball";
  }
  
  if (normalizedId === 'wbball' || normalizedId === 'w-basketball' || 
    (normalizedId.includes('basketball') && normalizedId.includes('women'))) {
    return "Women's Basketball";
  }
  
  // Generic basketball (need specific gender)
  if (normalizedId === 'basketball' || normalizedId.includes('basketball')) {
    return "Basketball";
  }
  
  // Handle sports with no gender specification needed (only one gender in the MAC)
  if (normalizedId === 'football' || normalizedId.includes('football')) return 'Football';
  if (normalizedId === 'baseball' || normalizedId.includes('baseball')) return 'Baseball';
  if (normalizedId === 'softball' || normalizedId.includes('softball')) return 'Softball';
  if (normalizedId === 'volleyball' || normalizedId.includes('volleyball')) return 'Volleyball';
  
  // Handle lacrosse - only women's lacrosse in MAC, but the data might include "Women's" in the name
  if (normalizedId === 'wlacrosse' || normalizedId === 'w-lacrosse' || 
      (normalizedId.includes('lacrosse') && normalizedId.includes('women'))) {
    return "Women's Lacrosse";
  }
  
  if (normalizedId === 'lacrosse' || normalizedId.includes('lacrosse')) return "Women's Lacrosse";
  
  // Soccer - men's and women's versions in MAC
  if (normalizedId === 'msoccer' || normalizedId === 'm-soccer' || 
    (normalizedId.includes('soccer') && normalizedId.includes('men'))) {
    return "Men's Soccer";
  }
  
  if (normalizedId === 'wsoccer' || normalizedId === 'w-soccer' || 
    (normalizedId.includes('soccer') && normalizedId.includes('women'))) {
    return "Soccer";  // Women's soccer referred to as just "Soccer"
  }
  
  // Generic soccer (assumes women's in MAC context)
  if (normalizedId === 'soccer' || normalizedId.includes('soccer')) {
    return "Soccer";
  }
  
  // Consolidated sports - combining men's and women's variants
  if (normalizedId === 'golf' || normalizedId === 'mgolf' || normalizedId === 'wgolf' ||
      normalizedId.includes('golf')) {
    return "Golf";
  }
  
  if (normalizedId === 'tennis' || normalizedId === 'mtennis' || normalizedId === 'wtennis' ||
      normalizedId.includes('tennis')) {
    return "Tennis";
  }
  
  if (normalizedId === 'swimming' || normalizedId === 'mswim' || normalizedId === 'wswim' ||
      normalizedId.includes('swimming') || normalizedId.includes('swim')) {
    return "Swimming & Diving";
  }
  
  // Other sports
  if (normalizedId === 'fieldhockey' || normalizedId.includes('field-hockey')) return 'Field Hockey';
  if (normalizedId === 'wrestling' || normalizedId.includes('wrestling')) return 'Wrestling';
  if (normalizedId === 'track' || normalizedId.includes('track')) return 'Track & Field';
  if (normalizedId === 'crosscountry' || normalizedId.includes('cross-country')) return 'Cross Country';
  if (normalizedId === 'gymnastics' || normalizedId.includes('gymnastics')) return 'Gymnastics';
  if (normalizedId === 'rowing' || normalizedId.includes('rowing')) return 'Rowing';
  
  // Default formatting for unknown sports
  return sportId.charAt(0).toUpperCase() + sportId.slice(1);
};

// Function to get badge style based on sport
const getSportBadgeStyle = (sportId: string): string => {
  // Normalize the sport ID for consistent matching
  const normalizedId = sportId.toLowerCase().trim();
  
  // Football - Amber
  if (normalizedId === 'football' || normalizedId.includes('football')) {
    return 'bg-amber-50 text-amber-800 border-amber-200';
  }
  
  // Men's Basketball - Orange
  if (normalizedId === 'mbball' || normalizedId === 'm-basketball' || 
      (normalizedId.includes('basketball') && normalizedId.includes('men'))) {
    return 'bg-orange-50 text-orange-800 border-orange-200';
  }
  
  // Women's Basketball - Hot Pink
  if (normalizedId === 'wbball' || normalizedId === 'w-basketball' || 
      (normalizedId.includes('basketball') && normalizedId.includes('women'))) {
    return 'bg-pink-50 text-pink-800 border-pink-200';
  }
  
  // Baseball - Forest Green
  if (normalizedId === 'baseball' || normalizedId.includes('baseball')) {
    return 'bg-green-50 text-green-800 border-green-200';
  }
  
  // Softball - Yellow/Gold
  if (normalizedId === 'softball' || normalizedId.includes('softball')) {
    return 'bg-yellow-50 text-yellow-800 border-yellow-200';
  }
  
  // Volleyball - Lavender/Purple
  if (normalizedId === 'volleyball' || normalizedId.includes('volleyball')) {
    return 'bg-purple-50 text-purple-800 border-purple-200';
  }
  
  // Men's Soccer - Emerald Green (darker)
  if (normalizedId === 'msoccer' || normalizedId === 'm-soccer' || 
      (normalizedId.includes('soccer') && normalizedId.includes('men'))) {
    return 'bg-emerald-100 text-emerald-900 border-emerald-300';
  }
  
  // Women's Soccer - Light Green
  if (normalizedId === 'wsoccer' || normalizedId === 'w-soccer' || 
      (normalizedId.includes('soccer') && normalizedId.includes('women')) ||
      normalizedId === 'soccer') {
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }
  
  // Field Hockey - Lime Green
  if (normalizedId === 'fieldhockey' || normalizedId.includes('field-hockey')) {
    return 'bg-lime-50 text-lime-800 border-lime-200';
  }
  
  // Wrestling - Rich Red
  if (normalizedId === 'wrestling' || normalizedId.includes('wrestling')) {
    return 'bg-red-50 text-red-800 border-red-200';
  }
  
  // Swimming & Diving - Consolidated Blue Style
  if (normalizedId === 'swimming' || 
      normalizedId === 'mswim' || 
      normalizedId === 'wswim' || 
      normalizedId === 'm-swimming' || 
      normalizedId === 'w-swimming' ||
      normalizedId.includes('swimming') ||
      normalizedId.includes('swim')) {
    return 'bg-blue-50 text-blue-800 border-blue-200';
  }
  
  // Track & Field - Indigo
  if (normalizedId === 'track' || normalizedId.includes('track')) {
    return 'bg-indigo-50 text-indigo-800 border-indigo-200';
  }
  
  // Cross Country - Fuchsia
  if (normalizedId === 'crosscountry' || normalizedId.includes('cross-country')) {
    return 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200';
  }
  
  // Golf - Consolidated Teal Style
  if (normalizedId === 'golf' || 
      normalizedId === 'mgolf' || 
      normalizedId === 'wgolf' || 
      normalizedId === 'm-golf' || 
      normalizedId === 'w-golf' ||
      normalizedId.includes('golf')) {
    return 'bg-teal-50 text-teal-800 border-teal-200';
  }
  
  // Tennis - Consolidated Cyan Style 
  if (normalizedId === 'tennis' || 
      normalizedId === 'mtennis' || 
      normalizedId === 'wtennis' || 
      normalizedId === 'm-tennis' || 
      normalizedId === 'w-tennis' ||
      normalizedId.includes('tennis')) {
    return 'bg-cyan-50 text-cyan-800 border-cyan-200';
  }
  
  // Gymnastics - Rose
  if (normalizedId === 'gymnastics' || normalizedId.includes('gymnastics')) {
    return 'bg-rose-50 text-rose-800 border-rose-200';
  }
  
  // Women's Lacrosse - Violet
  if (normalizedId === 'wlacrosse' || normalizedId === 'w-lacrosse' || 
      normalizedId === 'lacrosse' || normalizedId.includes('lacrosse')) {
    return 'bg-violet-50 text-violet-800 border-violet-200';
  }
  
  // Rowing - Slate
  if (normalizedId === 'rowing' || normalizedId.includes('rowing')) {
    return 'bg-slate-50 text-slate-800 border-slate-200';
  }
  
  // Default style for unknown sports
  return 'bg-gray-50 text-gray-800 border-gray-200';
};

const SchedulePage = () => {
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [currentView, setCurrentView] = useState<"calendar" | "all">("calendar");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  // Use both MAC calendar data sources for comprehensive data
  const { data: macCalendarGames = [], isLoading: isMacCalendarLoading } = useMacCalendar(
    selectedSport, 
    selectedTeam !== "all" ? selectedTeam : undefined
  );
  
  // Get the enhanced calendar data with final scores
  const { data: enhancedMacEvents = [], isLoading: isEnhancedDataLoading } = useMacCalendarEvents();
  
  const { data: schools = [] } = useMacSchools();
  const { data: favoriteSchoolData } = useQuery<{ favoriteSchool: string | null }>({
    queryKey: ['/api/preferences/favorite-school'],
    select: (data) => data || { favoriteSchool: null }
  });

  // Effect to auto-refresh data when component mounts
  useEffect(() => {
    const loadData = () => {
      // Using the queryClient to invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/import/mac-calendar'] });
    };
    
    loadData();
    
    // Set up auto-refresh when app regains focus or visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Create a complete list of MAC sports for the SportSelector, regardless of calendar data
  const availableSports = useMemo(() => {
    // Complete list of MAC sports (gender only specified where multiple versions exist)
    const allMacSports = [
      { id: "baseball", name: "Baseball", gender: "mens" },
      { id: "cross-country", name: "Cross Country", gender: "mixed" },
      { id: "field-hockey", name: "Field Hockey", gender: "womens" },
      { id: "football", name: "Football", gender: "mens" },
      { id: "gymnastics", name: "Gymnastics", gender: "womens" },
      { id: "mbball", name: "Basketball", gender: "mens" },
      // Consolidated sports (no gender variants)
      { id: "golf", name: "Golf", gender: "mixed" },
      { id: "swimming", name: "Swimming & Diving", gender: "mixed" },
      { id: "tennis", name: "Tennis", gender: "mixed" },
      { id: "softball", name: "Softball", gender: "womens" },
      { id: "track", name: "Track and Field", gender: "mixed" },
      { id: "volleyball", name: "Volleyball", gender: "womens" },
      { id: "wbball", name: "Basketball", gender: "womens" },
      { id: "wrestling", name: "Wrestling", gender: "mens" },
      // MAC schools have both men's and women's soccer
      { id: "msoccer", name: "Soccer", gender: "mens" },
      { id: "wsoccer", name: "Soccer", gender: "womens" },
      // Only women's lacrosse in MAC
      { id: "wlacrosse", name: "Lacrosse", gender: "womens" }
    ];

    // Also extract any sport IDs present in the actual calendar data that might not be in our predefined list
    const sportIdsFromCalendar = new Set<string>();
    
    if (macCalendarGames) {
      macCalendarGames.forEach(game => {
        if (game.sportId) {
          sportIdsFromCalendar.add(game.sportId.toLowerCase());
        }
      });
    }
    
    if (enhancedMacEvents) {
      enhancedMacEvents.forEach(game => {
        if (game.sportId) {
          sportIdsFromCalendar.add(game.sportId.toLowerCase());
        }
      });
    }
    
    // Add any sports from the calendar data that aren't in our predefined list
    const additionalSports = Array.from(sportIdsFromCalendar)
      .filter(sportId => !allMacSports.some(s => s.id === sportId))
      .map(sportId => ({
        id: sportId,
        name: getSportName(sportId),
        gender: sportId.includes('women') || sportId.includes('w-') ? 'womens' :
                sportId.includes('men') || sportId.includes('m-') ? 'mens' : 'mixed'
      }));
    
    return [...allMacSports, ...additionalSports];
  }, [macCalendarGames, enhancedMacEvents]);
  
  // Combine data from both sources for the most complete information
  const combinedGames = useMemo(() => {
    if (!macCalendarGames || !enhancedMacEvents) return [];
    
    // Create a map of enhanced events by ID for quick lookup
    const enhancedEventsMap = new Map();
    enhancedMacEvents.forEach(event => {
      enhancedEventsMap.set(event.id, event);
    });
    
    // Merge the data, prioritizing enhanced data when available
    return macCalendarGames.map(game => {
      const enhancedGame = enhancedEventsMap.get(game.id);
      if (enhancedGame) {
        // Merge the objects, with enhanced game taking precedence
        return { ...game, ...enhancedGame };
      }
      return game;
    });
  }, [macCalendarGames, enhancedMacEvents]);
  
  // Helper function to detect and extract sport info from game data
  const extractSportFromGame = (game: Game): string | undefined => {
    return game.sportId || undefined;
  };
  
  // Filter games based on selected sport and team
  const filteredGames = useMemo(() => {
    if (!combinedGames) return [];
    
    return combinedGames.filter(game => {
      // Filter by sport if not "all"
      if (selectedSport !== "all") {
        const gameSport = extractSportFromGame(game);
        if (!gameSport) return false;
        
        // Normalize sport IDs for more flexible matching
        const normalizedSelectedSport = selectedSport.toLowerCase();
        const normalizedGameSport = gameSport.toLowerCase();
        
        // Special handling for basketball (men's/women's)
        if (normalizedSelectedSport === "mbball" || normalizedSelectedSport === "m-basketball") {
          if (!normalizedGameSport.includes("men") && !normalizedGameSport.includes("m-") && 
              normalizedGameSport.includes("basketball")) {
            return false;
          }
        } else if (normalizedSelectedSport === "wbball" || normalizedSelectedSport === "w-basketball") {
          if (!normalizedGameSport.includes("women") && !normalizedGameSport.includes("w-") && 
              normalizedGameSport.includes("basketball")) {
            return false;
          }
        }
        
        // If the normalized sport IDs don't match, filter this game out
        if (normalizedGameSport !== normalizedSelectedSport && 
            !normalizedGameSport.includes(normalizedSelectedSport) && 
            !normalizedSelectedSport.includes(normalizedGameSport)) {
          return false;
        }
      }
      
      // Filter by team if not "all"
      if (selectedTeam !== "all") {
        if (game.homeTeamId !== selectedTeam && game.awayTeamId !== selectedTeam) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
    });
  }, [combinedGames, selectedSport, selectedTeam]);
  
  // Group games by date for display
  const gamesByDate = useMemo(() => {
    if (!filteredGames) return {};
    
    return filteredGames.reduce<{ [key: string]: Game[] }>((acc, game) => {
      // Format date as YYYY-MM-DD for grouping
      const dateKey = format(parseISO(game.scheduledTime), 'yyyy-MM-dd');
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      
      acc[dateKey].push(game);
      return acc;
    }, {});
  }, [filteredGames]);
  
  // Calendar navigation functions
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Handle sport selection change
  const handleChangeSport = (sportId: string) => {
    setSelectedSport(sportId);
  };
  
  // Generate calendar .ics file
  const createCalendarFile = (game: Game) => {
    const gameDate = parseISO(game.scheduledTime);
    
    // End time is always 2 hours after start time
    const endTime = addHours(gameDate, 2); // 2 hours later
    
    const formatDate = (date: Date) => {
      // Format for iCalendar: YYYYMMDDTHHMMSSZ
      return format(date, "yyyyMMdd'T'HHmmss'Z'");
    };
    
    // Default team names if not provided
    const homeTeamName = game.homeTeamName || game.homeTeamId || "Home Team";
    const awayTeamName = game.awayTeamName || game.awayTeamId || "Away Team";
    const sportName = game.sportId ? getSportName(game.sportId) : "Game";
    
    // Build iCalendar content
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MAC Sports//MACtion Mobile App//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${game.id}@macsports.com`,
      `DTSTART:${formatDate(gameDate)}`,
      `DTEND:${formatDate(endTime)}`,
      `DTSTAMP:${formatDate(new Date())}`,
      `SUMMARY:${sportName}: ${awayTeamName} at ${homeTeamName}`,
      `DESCRIPTION:${awayTeamName} vs ${homeTeamName}${game.location ? ` at ${game.location}` : ''}`,
      game.location ? `LOCATION:${game.location}` : '',
      "END:VEVENT",
      "END:VCALENDAR"
    ].filter(Boolean).join("\n");
    
    return icsContent;
  };
  
  // Download calendar event
  const downloadCalendarEvent = (game: Game) => {
    const icsContent = createCalendarFile(game);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    
    // Create a link and trigger download
    const link = document.createElement("a");
    const homeTeam = game.homeTeamName || game.homeTeamId || "home";
    const awayTeam = game.awayTeamName || game.awayTeamId || "away";
    
    link.href = window.URL.createObjectURL(blob);
    link.download = `${awayTeam}-vs-${homeTeam}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Individual game card component
  const GameCard = ({ game }: { game: Game }) => {
    // Parse game date and determine if it's in the past
    const gameDate = parseISO(game.scheduledTime);
    const now = new Date();
    const isPastGame = gameDate < now;
    
    // Find team names (default to ID if name not available)
    const defaultHomeTeam = {
      id: game.homeTeamId || "",
      name: game.homeTeamName || game.homeTeamId || "Home Team"
    };
    
    const defaultAwayTeam = {
      id: game.awayTeamId || "",
      name: game.awayTeamName || game.awayTeamId || "Away Team"
    };
    
    // Get sport information for the badge
    const sportName = game.sportId ? getSportName(game.sportId) : "";
    const sportBadgeStyle = game.sportId ? getSportBadgeStyle(game.sportId) : "";
    
    return (
      <div className="border rounded-lg p-4 shadow-sm bg-white">
        <div className="flex justify-between items-start">
          <div>
            {/* Sport badge */}
            {sportName && (
              <Badge variant="outline" className={`mb-2 ${sportBadgeStyle}`}>
                {sportName}
              </Badge>
            )}
            
            {/* Home vs Away teams with logos */}
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {/* Team logo */}
                <img 
                  src={getTeamLogoUrl(defaultAwayTeam.id)} 
                  alt={defaultAwayTeam.name} 
                  className="w-6 h-6 mr-1 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.log(`Failed to load logo for ${defaultAwayTeam.name}: ${target.src}`);
                    target.style.display = 'none';
                  }}
                />
                <span className="font-medium">{defaultAwayTeam.name}</span>
              </div>
              <span className="mx-2 text-gray-400">at</span>
              <div className="flex items-center">
                {/* Team logo */}
                <img 
                  src={getTeamLogoUrl(defaultHomeTeam.id)} 
                  alt={defaultHomeTeam.name} 
                  className="w-6 h-6 mr-1 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.log(`Failed to load logo for ${defaultHomeTeam.name}: ${target.src}`);
                    target.style.display = 'none';
                  }}
                />
                <span className="font-medium">{defaultHomeTeam.name}</span>
              </div>
            </div>
            
            {/* Date and time */}
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock className="h-3 w-3 mr-1" />
              {format(gameDate, 'EEEE, MMMM d • h:mm a')}
            </div>
            
            {/* Location if available */}
            {game.location && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                {game.location}
              </div>
            )}
          </div>
          
          {/* Score for completed games */}
          {isPastGame && game.homeScore !== undefined && game.awayScore !== undefined && (
            <div className="text-right">
              <div className="text-lg font-bold">
                {game.homeScore} - {game.awayScore}
              </div>
              <div className="text-xs text-gray-500">Final</div>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between flex-wrap">
          {/* Left side buttons */}
          <div className="flex items-center space-x-2">
            {/* Calendar button for all games */}
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
                    {defaultAwayTeam.name} vs {defaultHomeTeam.name} on {format(gameDate, 'MMMM d, yyyy')}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-3 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => downloadCalendarEvent(game)}
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
            
            {/* Only show tickets for upcoming games */}
            {!isPastGame && game.ticketUrl && (
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
          
          {/* Right side links */}
          <div className="flex items-center mt-2 sm:mt-0 space-x-2">
            {/* Box score for completed games */}
            {isPastGame && game.links?.s_boxscore && (
              <a 
                href={game.links.s_boxscore} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
              >
                <BarChart2 className="h-3 w-3 mr-1" />
                Box Score
              </a>
            )}
          </div>
        </div>
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
          sports={availableSports}
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
            {/* Filter out affiliate members */}
            {schools.filter(school => !school.affiliate).map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* View Tabs - Calendar View/All Games */}
      <div className="mb-4">
        <Tabs
          defaultValue="calendar"
          value={currentView}
          onValueChange={(value) => setCurrentView(value as "all" | "calendar")}
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="all">All Games</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Data Source Badge */}
      <div className="mb-4">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span>Official MAC Calendar Data</span>
        </div>
      </div>
      
      {/* Loading state */}
      {(isMacCalendarLoading || isEnhancedDataLoading) && (
        <div className="space-y-3">
          <Skeleton className="h-[140px] w-full rounded-lg" />
          <Skeleton className="h-[140px] w-full rounded-lg" />
          <Skeleton className="h-[140px] w-full rounded-lg" />
        </div>
      )}
      
      {/* Game List or Calendar View */}
      {!isMacCalendarLoading && !isEnhancedDataLoading && (
        <div>
          {currentView === "calendar" ? (
            // Calendar View
            <div className="calendar-view">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center" 
                  onClick={prevMonth}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <h2 className="text-lg font-medium">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center" 
                  onClick={nextMonth}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {/* Day of week headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
                  <div key={dayName} className="text-center text-xs font-medium text-gray-500">
                    {dayName}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {/* Add empty cells for days before the first of the month */}
                {Array.from({ length: getDay(startOfMonth(currentMonth)) }).map((_, index) => (
                  <div key={`empty-start-${index}`} className="min-h-[90px] p-1 border border-gray-100 rounded bg-gray-50 opacity-50"></div>
                ))}
                
                {/* Actual days of the month */}
                {eachDayOfInterval({
                  start: startOfMonth(currentMonth),
                  end: endOfMonth(currentMonth)
                }).map(day => {
                  // Find games for this day
                  const dayStr = format(day, 'yyyy-MM-dd');
                  const gamesOnThisDay = gamesByDate[dayStr] || [];
                  
                  // Determine if there are games from the favorite team today
                  const hasFavoriteTeamGames = favoriteSchoolData?.favoriteSchool && gamesOnThisDay.some(
                    game => game.homeTeamId === favoriteSchoolData.favoriteSchool || 
                            game.awayTeamId === favoriteSchoolData.favoriteSchool
                  );
                  
                  // Check if this day is currently selected
                  const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
                  
                  // Create day cell with appropriate styling
                  return (
                    <div 
                      key={dayStr}
                      onClick={() => setSelectedDay(gamesOnThisDay.length > 0 ? day : null)}
                      className={`
                        min-h-[90px] p-1 border rounded relative cursor-pointer transition-all
                        ${gamesOnThisDay.length ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white'} 
                        ${hasFavoriteTeamGames ? 'border-green-500' : 'border-gray-200'}
                        ${isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''}
                      `}
                    >
                      <div className="text-right text-sm p-1">
                        {format(day, 'd')}
                      </div>
                      
                      {/* Game indicators */}
                      <div className="absolute bottom-1 left-1 right-1">
                        {gamesOnThisDay.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {gamesOnThisDay.length <= 3 ? (
                              // Show individual mini-indicators for each game
                              gamesOnThisDay.map(game => {
                                const sportColor = getSportBadgeStyle(game.sportId || "");
                                const isFavTeamGame = favoriteSchoolData?.favoriteSchool && 
                                  (game.homeTeamId === favoriteSchoolData.favoriteSchool || 
                                  game.awayTeamId === favoriteSchoolData.favoriteSchool);
                                
                                return (
                                  <div 
                                    key={game.id} 
                                    className={`
                                      text-xs px-1 truncate rounded-sm
                                      ${sportColor}
                                      ${isFavTeamGame ? 'font-bold' : ''}
                                    `}
                                    title={`${game.awayTeamName || game.awayTeamId} vs ${game.homeTeamName || game.homeTeamId}`}
                                  >
                                    {format(parseISO(game.scheduledTime), 'h:mm')}
                                  </div>
                                );
                              })
                            ) : (
                              // Show count of games when there are many
                              <div className="text-xs font-semibold text-blue-600">
                                {gamesOnThisDay.length} games
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* Add empty cells for days after the end of the month to complete the grid */}
                {Array.from(
                  { length: (7 - getDay(endOfMonth(currentMonth))) % 7 },
                  (_, index) => (
                    <div 
                      key={`empty-end-${index}`} 
                      className="min-h-[90px] p-1 border border-gray-100 rounded bg-gray-50 opacity-50"
                    ></div>
                  )
                )}
              </div>
              
              {/* Game details for selected day - shown when clicking on a day */}
              {selectedDay && gamesByDate[format(selectedDay, 'yyyy-MM-dd')] ? (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-medium text-gray-800">
                      Games on {format(selectedDay, 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedDay(null)}
                    >
                      Close
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {gamesByDate[format(selectedDay, 'yyyy-MM-dd')].map(game => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                </div>
              ) : (
                selectedDay ? (
                  <div className="text-center py-8 mt-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No games found for {format(selectedDay, 'MMMM d, yyyy')}.</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Try selecting a different day.
                    </p>
                  </div>
                ) : null
              )}
            </div>
          ) : (
            // Regular Game List View
            filteredGames && filteredGames.length > 0 ? (
              // Group by date
              Object.keys(gamesByDate)
                .sort((a, b) => parseISO(a).getTime() - parseISO(b).getTime())
                .map(dateStr => (
                  <div key={dateStr} className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      {format(parseISO(dateStr), 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <div className="space-y-3">
                      {gamesByDate[dateStr].map(game => (
                        <GameCard key={game.id} game={game} />
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No games found for the selected filters.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Try selecting a different sport or team.
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SchedulePage;