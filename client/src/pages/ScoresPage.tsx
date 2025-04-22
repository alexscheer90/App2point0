import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SportSelector from "../components/SportSelector";
import GameScoreCard from "../components/GameScoreCard";
import UpcomingGameCard from "../components/UpcomingGameCard";
import CompletedGameCard from "../components/CompletedGameCard";
import { useScores } from "../hooks/useScores";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const ScoresPage = () => {
  const [selectedSport, setSelectedSport] = useState<string>("all");
  
  const { 
    liveGames, 
    upcomingGames, 
    recentGames, 
    isLoading,
    refreshScores
  } = useScores(selectedSport);
  
  const { data: favoriteSchoolData } = useQuery({
    queryKey: ['/api/preferences/favorite-school'],
  });
  
  const handleChangeSport = (sportId: string) => {
    setSelectedSport(sportId);
  };
  
  const renderLoadingState = () => (
    <>
      <div className="px-4 mb-6">
        <div className="flex items-center mb-3">
          <Skeleton className="w-6 h-6 rounded-full mr-2" />
          <Skeleton className="w-32 h-6" />
        </div>
        
        <Skeleton className="w-full h-32 mb-3" />
        <Skeleton className="w-full h-32 mb-3" />
      </div>
      
      <div className="px-4 mb-6">
        <Skeleton className="w-32 h-6 mb-3" />
        <Skeleton className="w-full h-24 mb-3" />
        <Skeleton className="w-full h-24 mb-3" />
      </div>
      
      <div className="px-4">
        <Skeleton className="w-32 h-6 mb-3" />
        <Skeleton className="w-full h-24 mb-3" />
      </div>
    </>
  );
  
  return (
    <div className="py-4">
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <SportSelector
              selectedSport={selectedSport}
              onChange={handleChangeSport}
              showAllOption={true}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2 flex items-center gap-1" 
            onClick={() => refreshScores()}
            disabled={isLoading}
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        renderLoadingState()
      ) : (
        <>
          {liveGames.length > 0 && (
            <div className="px-4 mb-6">
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
            <div className="px-4 mb-6">
              <h2 className="font-bold text-lg mb-3">Upcoming Games</h2>
              
              {upcomingGames.map(game => (
                <UpcomingGameCard key={game.id} game={game} />
              ))}
            </div>
          )}
          
          {recentGames.length > 0 && (
            <div className="px-4 mb-6">
              <h2 className="font-bold text-lg mb-3">Recent Results</h2>
              
              {recentGames.map(game => (
                <CompletedGameCard key={game.id} game={game} />
              ))}
            </div>
          )}
          
          {liveGames.length === 0 && upcomingGames.length === 0 && recentGames.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-gray-500 mb-2">No games found for the selected criteria.</p>
              <p className="text-sm text-gray-400">
                Live data from ESPN may not be available for some sports or dates.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScoresPage;
