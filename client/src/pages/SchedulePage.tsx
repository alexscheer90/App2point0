import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getMonth, getYear, addMonths, subMonths, isSameDay, getDay } from "date-fns";
import { Calendar, Clock, MapPin, CalendarIcon, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { Game } from "@shared/schema";
import { useGames } from "../hooks/useScores";
import { useMacSchools } from "../hooks/useSchool";
import { useMacCalendar } from "../hooks/useMacCalendar";
import { queryClient } from "../lib/queryClient";
import SportSelector from "../components/SportSelector";
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
  if (normalizedId === 'lacrosse' || normalizedId.includes('lacrosse')) return 'Lacrosse';
  
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
  
  // Golf - men's and women's versions in MAC
  if (normalizedId === 'mgolf' || normalizedId === 'm-golf' || 
    (normalizedId.includes('golf') && normalizedId.includes('men'))) {
    return "Men's Golf";
  }
  
  if (normalizedId === 'wgolf' || normalizedId === 'w-golf' || 
    (normalizedId.includes('golf') && normalizedId.includes('women'))) {
    return "Women's Golf";
  }
  
  // Tennis - men's and women's versions in MAC
  if (normalizedId === 'mtennis' || normalizedId === 'm-tennis' || 
    (normalizedId.includes('tennis') && normalizedId.includes('men'))) {
    return "Men's Tennis";
  }
  
  if (normalizedId === 'wtennis' || normalizedId === 'w-tennis' || 
    (normalizedId.includes('tennis') && normalizedId.includes('women'))) {
    return "Women's Tennis";
  }
  
  // Swimming - men's and women's versions in MAC
  if (normalizedId === 'mswim' || normalizedId === 'm-swimming' || 
    (normalizedId.includes('swimming') && normalizedId.includes('men'))) {
    return "Men's Swimming & Diving";
  }
  
  if (normalizedId === 'wswim' || normalizedId === 'w-swimming' || 
    (normalizedId.includes('swimming') && normalizedId.includes('women'))) {
    return "Women's Swimming & Diving";
  }
  
  // Other sports
  if (normalizedId === 'fieldhockey' || normalizedId.includes('field-hockey')) return 'Field Hockey';
  if (normalizedId === 'wrestling' || normalizedId.includes('wrestling')) return 'Wrestling';
  if (normalizedId === 'swimming' || normalizedId.includes('swimming')) return 'Swimming & Diving';
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
  
  // Football variants
  if (normalizedId === 'football' || normalizedId.includes('football')) {
    return 'bg-amber-50 text-amber-800 border-amber-200';
  }
  
  // Men's and women's basketball variants
  if (normalizedId === 'mbball' || normalizedId === 'm-basketball' || 
      (normalizedId.includes('basketball') && normalizedId.includes('men'))) {
    return 'bg-orange-50 text-orange-800 border-orange-200';
  }
  
  if (normalizedId === 'wbball' || normalizedId === 'w-basketball' || 
      (normalizedId.includes('basketball') && normalizedId.includes('women'))) {
    return 'bg-pink-50 text-pink-800 border-pink-200';
  }
  
  // Generic basketball
  if (normalizedId === 'basketball' || normalizedId.includes('basketball')) {
    return 'bg-orange-50 text-orange-800 border-orange-200';
  }
  
  // Baseball variants
  if (normalizedId === 'baseball' || normalizedId.includes('baseball')) {
    return 'bg-green-50 text-green-800 border-green-200';
  }
  
  // Softball variants
  if (normalizedId === 'softball' || normalizedId.includes('softball')) {
    return 'bg-yellow-50 text-yellow-800 border-yellow-200';
  }
  
  // Volleyball variants
  if (normalizedId === 'volleyball' || normalizedId.includes('volleyball')) {
    return 'bg-purple-50 text-purple-800 border-purple-200';
  }
  
  // Soccer variants
  if (normalizedId === 'msoccer' || normalizedId === 'm-soccer' || 
      (normalizedId.includes('soccer') && normalizedId.includes('men'))) {
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }
  
  if (normalizedId === 'wsoccer' || normalizedId === 'w-soccer' || 
      (normalizedId.includes('soccer') && normalizedId.includes('women'))) {
    return 'bg-emerald-100 text-emerald-900 border-emerald-300';
  }
  
  // Generic soccer
  if (normalizedId === 'soccer' || normalizedId.includes('soccer')) {
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }
  
  // Other sports
  if (normalizedId === 'fieldhockey' || normalizedId.includes('field-hockey')) {
    return 'bg-lime-50 text-lime-800 border-lime-200';
  }
  
  if (normalizedId === 'wrestling' || normalizedId.includes('wrestling')) {
    return 'bg-red-50 text-red-800 border-red-200';
  }
  
  if (normalizedId === 'swimming' || normalizedId.includes('swimming')) {
    return 'bg-sky-50 text-sky-800 border-sky-200';
  }
  
  if (normalizedId === 'track' || normalizedId.includes('track')) {
    return 'bg-indigo-50 text-indigo-800 border-indigo-200';
  }
  
  if (normalizedId === 'crosscountry' || normalizedId.includes('cross-country')) {
    return 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200';
  }
  
  if (normalizedId === 'golf' || normalizedId.includes('golf')) {
    return 'bg-teal-50 text-teal-800 border-teal-200';
  }
  
  if (normalizedId === 'tennis' || normalizedId.includes('tennis')) {
    return 'bg-cyan-50 text-cyan-800 border-cyan-200';
  }
  
  if (normalizedId === 'gymnastics' || normalizedId.includes('gymnastics')) {
    return 'bg-pink-50 text-pink-800 border-pink-200';
  }
  
  if (normalizedId === 'lacrosse' || normalizedId.includes('lacrosse')) {
    return 'bg-violet-50 text-violet-800 border-violet-200';
  }
  
  if (normalizedId === 'rowing' || normalizedId.includes('rowing')) {
    return 'bg-slate-50 text-slate-800 border-slate-200';
  }
  
  // Default style for unknown sports
  return 'bg-blue-50 text-blue-800 border-blue-200';
};

const SchedulePage = () => {
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [currentView, setCurrentView] = useState<"calendar" | "all">("calendar");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  // Always use "date" as our grouping method
  const groupBy = "date";
  
  // Effect to auto-refresh data when component mounts
  useEffect(() => {
    const loadData = () => {
      // Using the queryClient to invalidate and refetch data
      // This will cause a refresh of the calendar data
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
  
  // Only use MAC calendar data now
  const { data: macCalendarGames, isLoading: isMacCalendarLoading } = useMacCalendar(selectedSport, selectedTeam !== "all" ? selectedTeam : undefined);
  const { data: schools } = useMacSchools();
  const { data: favoriteSchoolData } = useQuery<{ favoriteSchool: string | null }>({
    queryKey: ['/api/preferences/favorite-school'],
    select: (data) => data || { favoriteSchool: null }
  });
  
  // Create a complete list of MAC sports for the SportSelector, regardless of calendar data
  const availableSports = useMemo(() => {
    // Complete list of MAC sports (gender only specified where both men's and women's versions exist)
    const allMacSports = [
      { id: "baseball", name: "Baseball", gender: "mens" },
      { id: "cross-country", name: "Cross Country", gender: "mixed" },
      { id: "field-hockey", name: "Field Hockey", gender: "womens" },
      { id: "football", name: "Football", gender: "mens" },
      { id: "gymnastics", name: "Gymnastics", gender: "womens" },
      { id: "mbball", name: "Men's Basketball", gender: "mens" },
      { id: "mgolf", name: "Men's Golf", gender: "mens" },
      { id: "msoccer", name: "Men's Soccer", gender: "mens" },
      { id: "mswim", name: "Men's Swimming & Diving", gender: "mens" },
      { id: "mtennis", name: "Men's Tennis", gender: "mens" },
      { id: "softball", name: "Softball", gender: "womens" },
      { id: "track", name: "Track and Field", gender: "mixed" },
      { id: "wbball", name: "Women's Basketball", gender: "womens" },
      { id: "wgolf", name: "Women's Golf", gender: "womens" },
      { id: "lacrosse", name: "Lacrosse", gender: "womens" },
      { id: "soccer", name: "Soccer", gender: "womens" },
      { id: "wswim", name: "Women's Swimming & Diving", gender: "womens" },
      { id: "wtennis", name: "Women's Tennis", gender: "womens" },
      { id: "volleyball", name: "Volleyball", gender: "womens" },
      { id: "wrestling", name: "Wrestling", gender: "mens" }
    ];
    
    // Log available sports from calendar data for debugging
    if (macCalendarGames) {
      const sportIdsMap: Record<string, boolean> = {};
      macCalendarGames.forEach(game => {
        if (game.sportId) {
          sportIdsMap[game.sportId] = true;
        }
      });
      
      console.log("Available sport IDs from calendar:", Object.keys(sportIdsMap));
      console.log("Calendar data sample:", macCalendarGames.slice(0, 5).map(g => ({
        id: g.id,
        sportId: g.sportId,
        homeTeam: g.homeTeamId,
        awayTeam: g.awayTeamId,
        time: g.scheduledTime
      })));
    }
    
    return allMacSports.sort((a, b) => a.name.localeCompare(b.name));
  }, [macCalendarGames]);
  
  const handleChangeSport = (sportId: string) => {
    setSelectedSport(sportId);
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  if (isMacCalendarLoading || !schools) {
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
  
  // Use MAC calendar data
  const activeGames = macCalendarGames;
  
  // Filter games based on selected team, sport, and view
  const filteredGames = activeGames?.filter((game: Game) => {
    // Filter by team
    const teamFilter = 
      selectedTeam === "all" || 
      game.homeTeamId === selectedTeam || 
      game.awayTeamId === selectedTeam;
    
    // Filter by sport - add more robust matching for all sports
    const sportFilter = selectedSport === "all" || (() => {
      // Debug info
      console.log(`Filtering: Selected sport="${selectedSport}", Game sport="${game.sportId}"`);
      
      // Normalize both sport IDs for consistent matching
      const normalizedSelectedSport = selectedSport.toLowerCase().trim();
      const normalizedGameSport = game.sportId?.toLowerCase()?.trim() || '';
      
      // Handle football
      if (normalizedSelectedSport === 'football') {
        return normalizedGameSport.includes('football');
      }
      
      // Handle basketball variants
      if (normalizedSelectedSport === 'mbball' || normalizedSelectedSport === 'basketball') {
        return (normalizedGameSport.includes('basketball') && normalizedGameSport.includes('men')) || 
               normalizedGameSport === 'mbball' || 
               normalizedGameSport === 'basketball';
      }
      
      if (normalizedSelectedSport === 'wbball') {
        return (normalizedGameSport.includes('basketball') && normalizedGameSport.includes('women')) || 
               normalizedGameSport === 'wbball';
      }
      
      // Handle soccer variants
      if (normalizedSelectedSport === 'msoccer' || normalizedSelectedSport === 'soccer') {
        return (normalizedGameSport.includes('soccer') && normalizedGameSport.includes('men')) || 
               normalizedGameSport === 'msoccer' || 
               normalizedGameSport === 'soccer';
      }
      
      if (normalizedSelectedSport === 'wsoccer') {
        return (normalizedGameSport.includes('soccer') && normalizedGameSport.includes('women')) || 
               normalizedGameSport === 'wsoccer';
      }
      
      // For all other sports, check for inclusion
      return normalizedGameSport.includes(normalizedSelectedSport) || normalizedGameSport === normalizedSelectedSport;
    })();
      
    // Filter by view (calendar view or all games)
    const viewFilter = 
      currentView === "all" || 
      currentView === "calendar"; // Show all games in calendar view
      
    return teamFilter && sportFilter && viewFilter;
  }).sort((a: Game, b: Game) => {
    // Sort by date - upcoming games sorted by ascending date, past games by descending date
    const dateA = new Date(a.scheduledTime);
    const dateB = new Date(b.scheduledTime);
    
    // In all views, sort chronologically
    return dateA.getTime() - dateB.getTime(); // Upcoming games: soonest first
  });
  
  // Group games by date - with improved timezone handling
  const gamesByDate: { [key: string]: Game[] } = {};
  
  filteredGames?.forEach((game: Game) => {
    // 1. Parse the ISO timestamp from the game data
    const gameDate = parseISO(game.scheduledTime);
    
    // 2. Format the date string using local timezone to ensure correct day-of-week
    const dateStr = format(gameDate, 'yyyy-MM-dd');
    
    // Log for debugging timezone issues
    console.log(`Game: ${game.homeTeamName} vs ${game.awayTeamName}, Date: ${dateStr}, Day: ${format(gameDate, 'EEEE')}`);
    
    if (!gamesByDate[dateStr]) {
      gamesByDate[dateStr] = [];
    }
    gamesByDate[dateStr].push(game);
  });
  
  // Create iCalendar file for a specific game
  const createCalendarFile = (game: Game) => {
    const homeTeam = schools.find(s => s.id === game.homeTeamId);
    const awayTeam = schools.find(s => s.id === game.awayTeamId);
    
    if (!homeTeam || !awayTeam) return '';
    
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
      `SUMMARY:${awayTeam.name} at ${homeTeam.name}`,
      `DESCRIPTION:${awayTeam.name} ${awayTeam.mascot} vs ${homeTeam.name} ${homeTeam.mascot}`,
      `LOCATION:${game.location || homeTeam.name + ' Stadium'}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    return icsContent;
  };
  
  // Function to download the calendar file
  const downloadCalendarEvent = (game: Game) => {
    const icsContent = createCalendarFile(game);
    const homeTeam = schools.find(s => s.id === game.homeTeamId);
    const awayTeam = schools.find(s => s.id === game.awayTeamId);
    
    if (!icsContent || !homeTeam || !awayTeam) return;
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${awayTeam.name}_at_${homeTeam.name}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Component to render each game card
  const GameCard = ({ game }: { game: Game }) => {
    // Get home and away teams - they may be null if not in the database
    const homeTeam = schools.find(s => s.id === game.homeTeamId);
    const awayTeam = schools.find(s => s.id === game.awayTeamId);
    
    // Extract team names from the game data
    const homeTeamName = game.homeTeamName || (homeTeam?.name) || game.homeTeamId || 'Unknown Team';
    const awayTeamName = game.awayTeamName || (awayTeam?.name) || game.awayTeamId || 'Unknown Team';
    
    // Log team names - for debugging MAC logo issue
    console.log(`Game ID: ${game.id}, Home: "${homeTeamName}", Away: "${awayTeamName}"`);
    
    // Get short names for the teams
    const homeShortName = homeTeamName.split(' ').pop() || 'UNK';
    const awayShortName = awayTeamName.split(' ').pop() || 'UNK';
    
    // Check if this is a MAC tournament/championship game
    const isMacConferenceGame = 
      homeTeamName.includes('Mid-American Conference') || 
      awayTeamName.includes('Mid-American Conference');
    
    // Check if teams are MAC Conference - looking for various patterns in both name and ID
    const isHomeTeamMacConference = 
      homeTeamName?.includes('Mid-American Conference') || 
      game.homeTeamId?.includes('mac-conference') || 
      game.homeTeamId?.includes('mid-american') ||
      (homeTeamName === 'MAC' || homeTeamName === 'MAC Championships');

    const isAwayTeamMacConference = 
      awayTeamName?.includes('Mid-American Conference') || 
      game.awayTeamId?.includes('mac-conference') || 
      game.awayTeamId?.includes('mid-american') ||
      (awayTeamName === 'MAC' || awayTeamName === 'MAC Championships');
    
    // Create placeholder objects for unknown teams
    const defaultHomeTeam = homeTeam || {
      id: game.homeTeamId || 'unknown',
      name: homeTeamName,
      shortName: isHomeTeamMacConference ? 'MAC' : homeShortName,
      mascot: '',
      primaryColor: isHomeTeamMacConference ? '#0B213E' : '#0099D8', // MAC navy or NCAA blue
      secondaryColor: '#ffffff',
      logoUrl: isHomeTeamMacConference
        ? '/mac-logo-official.png' // Official MAC logo
        : '/attached_assets/IMG_0788.png' // NCAA logo
    };
    
    const defaultAwayTeam = awayTeam || {
      id: game.awayTeamId || 'unknown',
      name: awayTeamName,
      shortName: isAwayTeamMacConference ? 'MAC' : awayShortName,
      mascot: '',
      primaryColor: isAwayTeamMacConference ? '#0B213E' : '#0099D8', // MAC navy or NCAA blue
      secondaryColor: '#ffffff',
      logoUrl: isAwayTeamMacConference
        ? '/mac-logo-official.png' // Official MAC logo
        : '/attached_assets/IMG_0788.png' // NCAA logo
    };
    
    // Special handling for Youngstown State logo if found in our assets
    if (defaultHomeTeam.name?.includes('Youngstown') || defaultHomeTeam.id?.includes('youngstown')) {
      defaultHomeTeam.logoUrl = '/attached_assets/Youngstown_State_Penguins_logo.svg.png';
    }
    
    if (defaultAwayTeam.name?.includes('Youngstown') || defaultAwayTeam.id?.includes('youngstown')) {
      defaultAwayTeam.logoUrl = '/attached_assets/Youngstown_State_Penguins_logo.svg.png';
    }
    
    // Special handling for Detroit logo if found in our assets
    if (defaultHomeTeam.name?.includes('Detroit') || defaultHomeTeam.id?.includes('detroit')) {
      defaultHomeTeam.logoUrl = '/attached_assets/Detroit_Titans_logo.svg.png';
    }
    
    if (defaultAwayTeam.name?.includes('Detroit') || defaultAwayTeam.id?.includes('detroit')) {
      defaultAwayTeam.logoUrl = '/attached_assets/Detroit_Titans_logo.svg.png';
    }
    
    // Special handling for UIC logo if found in our assets
    if (defaultHomeTeam.name?.includes('UIC') || defaultHomeTeam.id?.includes('uic')) {
      defaultHomeTeam.logoUrl = '/attached_assets/UIC_Flames_wordmark.svg.png';
    }
    
    if (defaultAwayTeam.name?.includes('UIC') || defaultAwayTeam.id?.includes('uic')) {
      defaultAwayTeam.logoUrl = '/attached_assets/UIC_Flames_wordmark.svg.png';
    }
    
    // Special handling for RMU logo if found in our assets
    if (defaultHomeTeam.name?.includes('Robert Morris') || defaultHomeTeam.id?.includes('robertmorris')) {
      defaultHomeTeam.logoUrl = '/attached_assets/rmu_logo_1.png';
    }
    
    if (defaultAwayTeam.name?.includes('Robert Morris') || defaultAwayTeam.id?.includes('robertmorris')) {
      defaultAwayTeam.logoUrl = '/attached_assets/rmu_logo_1.png';
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
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">
              {format(gameDate, 'h:mm a')}
            </span>
            
            {/* Sport Badge with different colors for each sport */}
            {game.sportId && (
              <Badge variant="outline" className={`text-xs ${getSportBadgeStyle(game.sportId)}`}>
                {getSportName(game.sportId)}
              </Badge>
            )}
          </div>
          
          {game.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm text-gray-600 truncate max-w-[150px]">
                {game.location}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          {/* Away Team */}
          <div className="flex items-center">
            <div className="w-8 h-8 flex-shrink-0 mr-2">
              {defaultAwayTeam.logoUrl ? (
                <img 
                  src={defaultAwayTeam.logoUrl} 
                  alt={`${defaultAwayTeam.name} logo`} 
                  className="w-full h-full object-contain"
                />
              ) : (
                // Fallback to initial when no logo
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: defaultAwayTeam.primaryColor }}
                >
                  <span className="text-xs font-bold" style={{ color: defaultAwayTeam.secondaryColor }}>
                    {defaultAwayTeam.shortName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{defaultAwayTeam.name}</p>
              {isPastGame && game.status === "final" && (
                <p className="text-sm font-bold">{game.awayScore}</p>
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 font-medium">
            {isPastGame ? 'FINAL' : 'AT'}
          </div>
          
          {/* Home Team */}
          <div className="flex items-center justify-end">
            <div>
              <p className="font-medium text-right">{defaultHomeTeam.name}</p>
              {isPastGame && game.status === "final" && (
                <p className="text-sm font-bold text-right">{game.homeScore}</p>
              )}
            </div>
            <div className="w-8 h-8 flex-shrink-0 ml-2">
              {defaultHomeTeam.logoUrl ? (
                <img 
                  src={defaultHomeTeam.logoUrl} 
                  alt={`${defaultHomeTeam.name} logo`} 
                  className="w-full h-full object-contain"
                />
              ) : (
                // Fallback to initial when no logo
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: defaultHomeTeam.primaryColor }}
                >
                  <span className="text-xs font-bold" style={{ color: defaultHomeTeam.secondaryColor }}>
                    {defaultHomeTeam.shortName.charAt(0)}
                  </span>
                </div>
              )}
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
                    {defaultAwayTeam.name} at {defaultHomeTeam.name} on {format(gameDate, 'MMMM d, yyyy')}
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
      
      {/* Game List or Calendar View */}
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
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 text-center mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="py-2 font-medium text-sm">
                  {day}
                </div>
              ))}
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
                    
                    {/* Game dots/indicators */}
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
                                  title={`${game.awayTeamName || game.awayTeamId} at ${game.homeTeamName || game.homeTeamId}`}
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
              <p className="text-sm text-gray-400 mt-2">
                Try selecting a different sport or team.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SchedulePage;