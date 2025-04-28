import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SportSelector from "../components/SportSelector";
import StandingsTable from "../components/StandingsTable";
import { useStandings, useMacSports } from "../hooks/useStandings";
import { Skeleton } from "@/components/ui/skeleton";
import { Sport } from "@shared/schema";
import macLogo from "@assets/IMG_0693.png";

const StandingsPage = () => {
  const [selectedSport, setSelectedSport] = useState<string>("football");
  
  const { data: standings, isLoading: isStandingsLoading } = useStandings(selectedSport);
  const { data: sports } = useMacSports();
  const { data: favoriteSchoolData } = useQuery<{ favoriteSchool: string | null }>({
    queryKey: ['/api/preferences/favorite-school'],
    select: (data) => data || { favoriteSchool: null }
  });
  
  const handleChangeSport = (sportId: string) => {
    setSelectedSport(sportId);
  };
  
  // Find the sport and format its display name
  const selectedSportObj = sports?.find((sport: Sport) => sport.id === selectedSport);
  const sportName = selectedSportObj 
    ? `${selectedSportObj.name}${selectedSportObj.gender !== "mixed" ? ` (${selectedSportObj.gender.charAt(0).toUpperCase() + selectedSportObj.gender.slice(1)})` : ""}`
    : selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1);
  
  return (
    <div className="py-4">
      <div className="px-4 mb-4">
        <SportSelector 
          selectedSport={selectedSport}
          onChange={handleChangeSport}
          standingsView={true}
        />
      </div>
      
      <div className="px-4 relative">
        <div className="flex items-center mb-3">
          <h2 className="font-bold text-xl mr-3">{sportName} Standings</h2>
          {/* MAC Logo next to title */}
          <div className="w-10 h-10">
            <img 
              src={macLogo} 
              alt="MAC Conference Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        {isStandingsLoading ? (
          <Skeleton className="w-full h-96" />
        ) : standings && standings.length > 0 ? (
          <div className="relative">
            <StandingsTable 
              sport={selectedSport}
              entries={standings}
              favoriteSchoolId={favoriteSchoolData?.favoriteSchool || null}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
            <p className="text-gray-500">No standings data available for {sportName}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StandingsPage;
