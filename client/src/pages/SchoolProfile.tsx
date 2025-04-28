import { useParams, Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Star, Trophy, Music, Utensils, Headphones, Mic, Play, Pause, Users, BarChart, Ticket } from "lucide-react";

// Import school logo images
import akronLogo from "@assets/Akron.png";
import bgsuLogo from "@assets/BGSU.png";
import ballStateLogo from "@assets/Ball State.png";
import buffaloLogo from "@assets/Buffalo.png";
import cmuLogo from "@assets/CMU.png";
import emuLogo from "@assets/EMU.png";
import kentStateLogo from "@assets/Kent State.png";
import miamiLogo from "@assets/Miami.png";
import niuLogo from "@assets/NIU.png";
import ohioLogo from "@assets/Ohio.png";
import toledoLogo from "@assets/Toledo.png";
import wmuLogo from "@assets/WMU.png";
import { useSchool } from "../hooks/useSchool";
import { useSchoolGames } from "../hooks/useScores";
import { useSchoolNews } from "../hooks/useNews";
import { useSchoolStandings } from "../hooks/useStandings";
import { useSchoolRivalries } from "../hooks/useRivalries";
import { useSchoolSounds } from "../hooks/useSchoolSounds";
import { useLocalEats } from "../hooks/useLocalEats";
import { useTeamStats } from "../hooks/useTeamStats";
import { usePlayers } from "../hooks/usePlayers";
import GameScoreCard from "../components/GameScoreCard";
import UpcomingGameCard from "../components/UpcomingGameCard";
import CompletedGameCard from "../components/CompletedGameCard";
import NewsItem from "../components/NewsItem";
import StandingsTable from "../components/StandingsTable";
import RivalryCard from "../components/RivalryCard";
import SchoolSoundCard from "../components/SchoolSoundCard";
import LocalEatCard from "../components/LocalEatCard";
import TeamStatsCard from "../components/TeamStatsCard";
import PlayerRoster from "../components/PlayerRoster";
import { Skeleton } from "@/components/ui/skeleton";
import { setFavoriteSchool } from "../lib/api";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { NewsItem as NewsItemType } from "@shared/schema";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const SchoolProfile = () => {
  const { toast } = useToast();
  const { id } = useParams();
  const schoolId = id || "";
  const [selectedNews, setSelectedNews] = useState<NewsItemType | null>(null);
  const [showNewsDialog, setShowNewsDialog] = useState(false);
  const [selectedSportForStats, setSelectedSportForStats] = useState<string | null>(null);
  const [selectedSportForPlayers, setSelectedSportForPlayers] = useState<string | null>(null);
  
  const { data: school, isLoading: isSchoolLoading } = useSchool(schoolId);
  const { liveGames, upcomingGames, recentGames, isLoading: isGamesLoading } = useSchoolGames(schoolId);
  const { featuredNews, regularNews, isLoading: isNewsLoading } = useSchoolNews(schoolId);
  // Combine featured and regular news for display
  const news = [...(featuredNews || []), ...(regularNews || [])];
  const { data: standings, isLoading: isStandingsLoading } = useSchoolStandings(schoolId);
  const { data: rivalries, isLoading: isRivalriesLoading } = useSchoolRivalries(schoolId);
  const { data: schoolSounds, isLoading: isSchoolSoundsLoading } = useSchoolSounds(schoolId);
  const { data: localEats, isLoading: isLocalEatsLoading } = useLocalEats(schoolId);
  const { data: teamStats, isLoading: isTeamStatsLoading } = useTeamStats(schoolId);
  const { data: players, isLoading: isPlayersLoading } = usePlayers(schoolId);
  
  const { data: favoriteSchoolData } = useQuery<{ favoriteSchool: string | null }>({
    queryKey: ['/api/preferences/favorite-school'],
  });
  
  const isFavorite = favoriteSchoolData ? favoriteSchoolData.favoriteSchool === schoolId : false;
  
  const mutation = useMutation({
    mutationFn: setFavoriteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/preferences/favorite-school'] });
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite 
          ? "This school has been removed from your favorites." 
          : "This school has been added to your favorites.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was a problem updating your favorite school.",
        variant: "destructive",
      });
    }
  });
  
  const toggleFavorite = () => {
    mutation.mutate(isFavorite ? null : schoolId);
  };
  
  const handleNewsClick = (newsItem: NewsItemType) => {
    setSelectedNews(newsItem);
    setShowNewsDialog(true);
  };
  
  const handleCloseNewsDialog = () => {
    setShowNewsDialog(false);
  };
  
  // Function to get the school logo based on school ID
  const getSchoolLogo = (schoolId: string): string | undefined => {
    switch (schoolId) {
      case "akron":
        return akronLogo;
      case "ballstate":
        return ballStateLogo;
      case "bowlinggreen":
        return bgsuLogo;
      case "buffalo":
        return buffaloLogo;
      case "centralmichigan":
        return cmuLogo;
      case "easternmichigan":
        return emuLogo;
      case "kentstate":
        return kentStateLogo;
      case "miamioh": // Fixed Miami school ID
        return miamiLogo;
      case "northernillinois":
        return niuLogo;
      case "ohio":
        return ohioLogo;
      case "toledo":
        return toledoLogo;
      case "westernmichigan":
        return wmuLogo;
      default:
        return undefined;
    }
  };
  
  // Function to get the ticket website URL for each school
  const getTicketUrl = (schoolId: string): string => {
    switch (schoolId) {
      case "akron":
        return "https://gozips.evenue.net/list/GS";
      case "ballstate":
        return "https://ballstatesports.com/sports/2015/2/23/GEN_0223151523.aspx";
      case "bowlinggreen":
        return "https://bgsufalcons.com/sports/2018/7/27/tickets.aspx";
      case "buffalo":
        return "https://ubbulls.com/sports/2018/7/24/tickets.aspx";
      case "centralmichigan":
        return "https://cmuchippewas.com/sports/2018/6/8/tickets-centmic-tickets-html.aspx";
      case "easternmichigan":
        return "https://emueagles.com/sports/2018/7/26/tickets.aspx";
      case "kentstate":
        return "https://kentstatesports.com/sports/2018/7/24/tickets-kenst-tickets-html.aspx";
      case "miamioh":
        return "https://miamiredhawks.com/sports/2018/7/24/tickets-miami-tickets-html.aspx";
      case "northernillinois":
        return "https://niuhuskies.com/sports/2018/7/25/tickets.aspx";
      case "ohio":
        return "https://ohiobobcats.com/sports/2018/7/25/tickets.aspx";
      case "toledo":
        return "https://utrockets.com/sports/2018/7/26/tickets.aspx";
      case "westernmichigan":
        return "https://wmubroncos.com/sports/2018/7/26/tickets.aspx";
      default:
        return "";
    }
  };
  
  if (isSchoolLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-10 w-32 mb-4" />
        <Skeleton className="h-40 w-full mb-4" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }
  
  if (!school) {
    return (
      <div className="p-4">
        <Link href="/schools">
          <a className="flex items-center text-[#019E4F] mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Schools
          </a>
        </Link>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">School not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Link href="/schools">
          <a className="flex items-center" style={{ color: "#019E4F" }}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Schools
          </a>
        </Link>
        <Button 
          variant={isFavorite ? "secondary" : "outline"} 
          size="sm" 
          className={isFavorite ? "bg-[#019E4F] hover:bg-[#018C45] text-white" : ""}
          onClick={toggleFavorite}
        >
          <Star className={`h-4 w-4 mr-1 ${isFavorite ? "fill-white" : ""}`} />
          {isFavorite ? "Favorite" : "Add to Favorites"}
        </Button>
      </div>
      
      <Card 
        className="mb-4"
        style={{
          backgroundColor: school.id === "easternmichigan" ? "#777777" : "white"
        }}
      >
        <CardHeader 
          className="pb-2"
          style={{ 
            backgroundColor: 
              school.id === "buffalo" || 
              school.id === "centralmichigan" ? 
                "white" : 
              school.id === "easternmichigan" ?
                "#777777" : school.primaryColor, 
            color: 
              school.id === "buffalo" || 
              school.id === "easternmichigan" || 
              school.id === "centralmichigan" ? 
                school.primaryColor : school.secondaryColor 
          }}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div 
                className="w-16 h-16 flex items-center justify-center mr-3 overflow-hidden"
                style={{ 
                  backgroundColor: "transparent",
                  padding: "0"
                }}
              >
                {getSchoolLogo(school.id) ? (
                  <img 
                    src={getSchoolLogo(school.id)} 
                    alt={`${school.name} logo`} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="font-bold text-xl" style={{ color: school.primaryColor }}>
                    {school.shortName.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-xl italic">{school.name}</CardTitle>
                <CardDescription 
                  className="font-semibold"
                  style={{ 
                    color: 
                      school.id === "buffalo" || 
                      school.id === "easternmichigan" || 
                      school.id === "centralmichigan" ? 
                        school.primaryColor : school.secondaryColor 
                  }}
                >
                  {school.mascot}
                </CardDescription>
              </div>
            </div>
            
            <div>
              <a 
                href={getTicketUrl(school.id)} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-2 font-medium"
                  style={{
                    borderColor: 
                      school.id === "buffalo" || 
                      school.id === "easternmichigan" || 
                      school.id === "centralmichigan" ? 
                        school.primaryColor : school.secondaryColor,
                    color: 
                      school.id === "buffalo" || 
                      school.id === "easternmichigan" || 
                      school.id === "centralmichigan" ? 
                        school.primaryColor : school.secondaryColor
                  }}
                >
                  <Ticket className="h-4 w-4 mr-1" />
                  Buy Tickets
                </Button>
              </a>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="stats" className="w-full">
        <div className="mb-4">
          <Select
            onValueChange={(value) => {
              // Find the tab element and activate it
              const tabElement = document.querySelector(`[data-value="${value}"]`) as HTMLElement;
              if (tabElement) {
                tabElement.click();
              }
            }}
            defaultValue="stats"
          >
            <SelectTrigger 
              className="w-full bg-white border border-gray-300 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#019E4F]"
              style={{ backgroundColor: "#0B213E", color: "white", borderColor: "#0B213E" }}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stats">
                <div className="flex items-center gap-1">
                  <BarChart className="h-3 w-3" />
                  <span>Team Stats</span>
                </div>
              </SelectItem>
              <SelectItem value="players">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>Players</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Hidden TabsList for Tabs functionality to work properly */}
        <TabsList className="hidden">
          <TabsTrigger value="stats" data-value="stats">Team Stats</TabsTrigger>
          <TabsTrigger value="players" data-value="players">Players</TabsTrigger>
        </TabsList>
        
        <TabsContent value="games">
          {isGamesLoading ? (
            <>
              <Skeleton className="h-32 w-full mb-3" />
              <Skeleton className="h-32 w-full mb-3" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : (
            <>
              {liveGames.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#28A745] mr-2 animate-pulse"></div>
                    <h2 className="font-bold text-lg">Live Games</h2>
                  </div>
                  
                  {liveGames.map(game => (
                    <GameScoreCard key={game.id} game={game} />
                  ))}
                </div>
              )}
              
              {upcomingGames.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-bold text-lg mb-3">Upcoming Games</h2>
                  
                  {upcomingGames.map(game => (
                    <UpcomingGameCard key={game.id} game={game} />
                  ))}
                </div>
              )}
              
              {recentGames.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-bold text-lg mb-3">Recent Results</h2>
                  
                  {recentGames.map(game => (
                    <CompletedGameCard key={game.id} game={game} />
                  ))}
                </div>
              )}
              
              {liveGames.length === 0 && upcomingGames.length === 0 && recentGames.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
                  <p className="text-gray-500">No games found for {school.name}.</p>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="news">
          {isNewsLoading ? (
            <>
              <Skeleton className="h-28 w-full mb-3" />
              <Skeleton className="h-28 w-full mb-3" />
              <Skeleton className="h-28 w-full" />
            </>
          ) : news && news.length > 0 ? (
            news.map((item: NewsItemType) => (
              <NewsItem key={item.id} news={item} onClick={handleNewsClick} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No news available for {school.name}.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="standings">
          {isStandingsLoading ? (
            <Skeleton className="h-72 w-full" />
          ) : standings && standings.length > 0 ? (
            standings.map(standingGroup => (
              <div key={standingGroup.sportId} className="mb-4">
                <h3 className="font-semibold mb-2">
                  {standingGroup.sportId.charAt(0).toUpperCase() + standingGroup.sportId.slice(1)}
                </h3>
                <StandingsTable 
                  sport={standingGroup.sportId} 
                  entries={standingGroup.entries}
                  favoriteSchoolId={favoriteSchoolData?.favoriteSchool}
                />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No standings available for {school.name}.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="stats">
          {isTeamStatsLoading ? (
            <>
              <Skeleton className="h-48 w-full mb-3" />
              <Skeleton className="h-48 w-full mb-3" />
            </>
          ) : teamStats && teamStats.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                  Team Statistics
                </h3>
                
                {teamStats.length > 1 && (
                  <Select 
                    defaultValue={teamStats[0].sportId} 
                    value={selectedSportForStats || teamStats[0].sportId}
                    onValueChange={setSelectedSportForStats}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamStats.map(stat => (
                        <SelectItem key={stat.id} value={stat.sportId}>
                          {stat.sportId.charAt(0).toUpperCase() + stat.sportId.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              {teamStats
                .filter(stat => !selectedSportForStats || stat.sportId === selectedSportForStats)
                .map(stat => (
                  <TeamStatsCard key={stat.id} stats={stat} />
                ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No team statistics available for {school.name}.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="players">
          {isPlayersLoading ? (
            <>
              <Skeleton className="h-48 w-full mb-3" />
              <Skeleton className="h-48 w-full mb-3" />
            </>
          ) : players && players.length > 0 ? (
            <>
              {/* Sport filter for players */}
              {players.filter(player => player.sportId).length > 1 && (
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2 text-indigo-500" />
                    {school.name} Players
                  </h3>
                  
                  <Select 
                    defaultValue="all" 
                    value={selectedSportForPlayers || "all"}
                    onValueChange={setSelectedSportForPlayers}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Sports" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sports</SelectItem>
                      {Array.from(new Set(players.map(player => player.sportId))).map(sportId => (
                        <SelectItem key={sportId} value={sportId}>
                          {sportId.charAt(0).toUpperCase() + sportId.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <PlayerRoster 
                players={
                  selectedSportForPlayers && selectedSportForPlayers !== "all" 
                    ? players.filter(player => player.sportId === selectedSportForPlayers)
                    : players
                } 
                title={`${school.name} ${selectedSportForPlayers && selectedSportForPlayers !== "all" ? selectedSportForPlayers.charAt(0).toUpperCase() + selectedSportForPlayers.slice(1) : ""} Players`}
              />
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No player information available for {school.name}.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rivalries">
          {isRivalriesLoading ? (
            <>
              <Skeleton className="h-64 w-full mb-3" />
              <Skeleton className="h-64 w-full mb-3" />
            </>
          ) : rivalries && rivalries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rivalries.map(rivalry => (
                <RivalryCard key={rivalry.id} rivalry={rivalry} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No rivalries found for {school.name}.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sounds">
          {isSchoolSoundsLoading ? (
            <>
              <Skeleton className="h-40 w-full mb-3" />
              <Skeleton className="h-40 w-full mb-3" />
            </>
          ) : schoolSounds && schoolSounds.length > 0 ? (
            <div className="space-y-4">
              {schoolSounds.filter(sound => sound.type === "fight_song").length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-lg flex items-center">
                    <Music className="h-4 w-4 mr-2 text-amber-500" />
                    Fight Songs
                  </h3>
                  <div className="space-y-3">
                    {schoolSounds
                      .filter(sound => sound.type === "fight_song")
                      .map(sound => (
                        <SchoolSoundCard key={sound.id} sound={sound} />
                      ))}
                  </div>
                </div>
              )}
              
              {schoolSounds.filter(sound => sound.type === "alma_mater").length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-lg flex items-center">
                    <Music className="h-4 w-4 mr-2 text-blue-500" />
                    Alma Maters
                  </h3>
                  <div className="space-y-3">
                    {schoolSounds
                      .filter(sound => sound.type === "alma_mater")
                      .map(sound => (
                        <SchoolSoundCard key={sound.id} sound={sound} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No school sounds available for {school.name}.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="eats">
          {isLocalEatsLoading ? (
            <>
              <Skeleton className="h-48 w-full mb-3" />
              <Skeleton className="h-48 w-full mb-3" />
              <Skeleton className="h-48 w-full mb-3" />
            </>
          ) : localEats && localEats.length > 0 ? (
            <div>
              <h3 className="font-semibold mb-4 text-lg flex items-center">
                <Utensils className="h-4 w-4 mr-2 text-teal-500" />
                Local Restaurants in {school.city}, {school.state}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localEats.map(restaurant => (
                  <LocalEatCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No local restaurant recommendations found for {school.name}.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="podcast">
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="font-semibold mb-4 text-lg flex items-center">
                <Mic className="h-4 w-4 mr-2 text-purple-500" />
                MAC Sports Connection Podcast
              </h3>
              
              <div className="rounded-lg overflow-hidden bg-gradient-to-r from-[#0B213E] to-[#019E4F] p-4 text-white mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#9DA5A8] flex items-center justify-center mr-3">
                    <Headphones className="h-6 w-6 text-[#0B213E]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Latest Episode</h4>
                    <p className="text-sm text-gray-200">MAC Sports Connection</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5 className="text-md font-semibold mb-2">Season Preview: {school.name} {school.mascot}</h5>
                  <p className="text-sm text-gray-200 mb-2">
                    Our hosts break down what to expect from the {school.mascot} in the upcoming season. 
                    We discuss key players, coaching changes, and make our season predictions.
                  </p>
                  <p className="text-xs text-gray-300">Released: April 2, 2025 • 45 mins</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                    <Play className="h-4 w-4 mr-2" />
                    Play Episode
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Subscribe
                  </Button>
                </div>
              </div>
              
              <h4 className="font-semibold mb-3">Recent Episodes</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <div>
                    <h5 className="font-medium">Bowl Game Recap: {school.shortName} vs Toledo</h5>
                    <p className="text-sm text-gray-500">March 26, 2025 • 32 mins</p>
                  </div>
                  <Play className="h-4 w-4 text-gray-500" />
                </div>
                
                <div className="p-3 border rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <div>
                    <h5 className="font-medium">Rivalry Week: {school.shortName} Special Coverage</h5>
                    <p className="text-sm text-gray-500">March 19, 2025 • 38 mins</p>
                  </div>
                  <Play className="h-4 w-4 text-gray-500" />
                </div>
                
                <div className="p-3 border rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <div>
                    <h5 className="font-medium">Interview: {school.name} Head Coach</h5>
                    <p className="text-sm text-gray-500">March 12, 2025 • 41 mins</p>
                  </div>
                  <Play className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" className="text-sm">
                  View All Episodes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* News dialog */}
      <Dialog open={showNewsDialog} onOpenChange={handleCloseNewsDialog}>
        <DialogContent className="max-w-md" aria-describedby="news-dialog-description">
          <DialogHeader>
            <DialogTitle>{selectedNews?.title || "News"}</DialogTitle>
            <DialogDescription id="news-dialog-description" className="sr-only">
              News article details from {school?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedNews && (
            <div>
              {selectedNews.imageUrl && (
                <img 
                  src={selectedNews.imageUrl} 
                  alt={selectedNews.title} 
                  className="w-full h-48 object-cover rounded-md mb-4" 
                />
              )}
              
              <div className="flex items-center mb-3">
                <div 
                  className="w-6 h-6 mr-2 flex items-center justify-center overflow-hidden"
                  style={{ 
                    backgroundColor: "transparent",
                    padding: "0"
                  }}
                >
                  {getSchoolLogo(school.id) ? (
                    <img 
                      src={getSchoolLogo(school.id)} 
                      alt={`${school.name} logo`} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs font-bold" style={{ color: school.secondaryColor }}>
                      {school.shortName.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-600">
                  <span className="italic">{school.name}</span> • {new Date(selectedNews.publishedAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">{selectedNews.content || selectedNews.summary}</p>
              
              {selectedNews.url && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(selectedNews.url, "_blank")}
                >
                  Read Full Article
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolProfile;
