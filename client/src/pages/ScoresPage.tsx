import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import GameScoreCard from "../components/GameScoreCard";
import UpcomingGameCard from "../components/UpcomingGameCard";
import CompletedGameCard from "../components/CompletedGameCard";
import { useScores } from "../hooks/useScores";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sport tabs for easy filtering (matching ESPN app style)
const SPORT_TABS = [
  { id: "all", name: "Top Events" },
  { id: "football", name: "Football" },
  { id: "mbball", name: "Men's Basketball" },
  { id: "wbball", name: "Women's Basketball" }
];

const ScoresPage = () => {
  const [selectedSport, setSelectedSport] = useState<string>("all");
  
  // Get favorite school from preferences
  const { data: favoriteSchoolData } = useQuery<{ favoriteSchool: string | null }>({
    queryKey: ['/api/preferences/favorite-school'],
  });
  const favoriteSchoolId = favoriteSchoolData?.favoriteSchool || null;

  // Get today's games with favorite school at top
  const { 
    liveGames, 
    upcomingGames, 
    recentGames, 
    isLoading 
  } = useScores(selectedSport, favoriteSchoolId);
  
  // Get today's date for header
  const today = useMemo(() => {
    return format(new Date(), 'EEEE, MMM d').toUpperCase();
  }, []);
  
  const renderLoadingState = () => (
    <>
      <div className="px-4 mb-6">
        <Skeleton className="w-full h-12 mb-3" />
        <Skeleton className="w-full h-32 mb-3" />
        <Skeleton className="w-full h-32 mb-3" />
      </div>
      
      <div className="px-4">
        <Skeleton className="w-full h-12 mb-3" />
        <Skeleton className="w-full h-24 mb-3" />
        <Skeleton className="w-full h-24 mb-3" />
      </div>
    </>
  );
  
  // Organize games by section like ESPN
  const hasFavoriteGames = useMemo(() => {
    if (!favoriteSchoolId) return false;
    return [...liveGames, ...upcomingGames, ...recentGames].some(
      game => game.homeTeamId === favoriteSchoolId || game.awayTeamId === favoriteSchoolId
    );
  }, [favoriteSchoolId, liveGames, upcomingGames, recentGames]);
  
  return (
    <div className="py-4">
      {/* Sport type tabs */}
      <div className="px-4 mb-4 overflow-x-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-flow-col auto-cols-max w-full justify-start gap-1 bg-transparent h-auto">
            {SPORT_TABS.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                onClick={() => setSelectedSport(tab.id)}
                className={`rounded-full text-sm px-4 py-2 ${
                  selectedSport === tab.id 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {isLoading ? (
        renderLoadingState()
      ) : (
        <>
          {/* Date header */}
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 font-medium text-sm mb-2">
            {today}
          </div>
          
          {/* Favorites section (if applicable) */}
          {hasFavoriteGames && favoriteSchoolId && (
            <div className="px-4 mb-4">
              <h2 className="font-bold text-lg mb-2">FAVORITES</h2>
              
              {liveGames
                .filter(game => game.homeTeamId === favoriteSchoolId || game.awayTeamId === favoriteSchoolId)
                .map(game => (
                  <GameScoreCard key={game.id} game={game} />
                ))}
              
              {recentGames
                .filter(game => game.homeTeamId === favoriteSchoolId || game.awayTeamId === favoriteSchoolId)
                .map(game => (
                  <CompletedGameCard key={game.id} game={game} />
                ))}
                
              {upcomingGames
                .filter(game => game.homeTeamId === favoriteSchoolId || game.awayTeamId === favoriteSchoolId)
                .map(game => (
                  <UpcomingGameCard key={game.id} game={game} />
                ))}
            </div>
          )}
          
          {/* Live games section */}
          {liveGames.length > 0 && (
            <div className="px-4 mb-4">
              {hasFavoriteGames && <h2 className="font-bold text-lg mb-2">{selectedSport === "all" ? "MAC" : selectedSport.toUpperCase()}</h2>}
              
              {liveGames
                .filter(game => !favoriteSchoolId || (game.homeTeamId !== favoriteSchoolId && game.awayTeamId !== favoriteSchoolId))
                .map(game => (
                  <GameScoreCard key={game.id} game={game} />
                ))}
            </div>
          )}
          
          {/* Recent games section */}
          {recentGames.length > 0 && (
            <div className="px-4 mb-4">
              {liveGames.length === 0 && hasFavoriteGames && 
                <h2 className="font-bold text-lg mb-2">{selectedSport === "all" ? "MAC" : selectedSport.toUpperCase()}</h2>
              }
              
              {recentGames
                .filter(game => !favoriteSchoolId || (game.homeTeamId !== favoriteSchoolId && game.awayTeamId !== favoriteSchoolId))
                .map(game => (
                  <CompletedGameCard key={game.id} game={game} />
                ))}
            </div>
          )}
          
          {/* Upcoming games section */}
          {upcomingGames.length > 0 && (
            <div className="px-4 mb-4">
              {liveGames.length === 0 && recentGames.length === 0 && hasFavoriteGames && 
                <h2 className="font-bold text-lg mb-2">{selectedSport === "all" ? "MAC" : selectedSport.toUpperCase()}</h2>
              }
              
              {upcomingGames
                .filter(game => !favoriteSchoolId || (game.homeTeamId !== favoriteSchoolId && game.awayTeamId !== favoriteSchoolId))
                .map(game => (
                  <UpcomingGameCard key={game.id} game={game} />
                ))}
            </div>
          )}
          
          {liveGames.length === 0 && upcomingGames.length === 0 && recentGames.length === 0 && (
            <div className="px-4 py-12 text-center">
              <div className="mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Games Today</h3>
              {selectedSport !== 'all' ? (
                <p className="text-gray-500 max-w-md mx-auto">
                  There are no {SPORT_TABS.find(tab => tab.id === selectedSport)?.name} games scheduled for today. Try selecting a different sport.
                </p>
              ) : (
                <p className="text-gray-500 max-w-md mx-auto">
                  There are no MAC games scheduled for today, or we couldn't retrieve the schedule data. Check back later or try refreshing.
                </p>
              )}
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScoresPage;
