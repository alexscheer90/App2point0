import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SportSelector from "../components/SportSelector";
import StandingsTable from "../components/StandingsTable";
import { useStandings, useMacSports } from "../hooks/useStandings";
import { Skeleton } from "@/components/ui/skeleton";
import { Sport } from "@shared/schema";

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
        />
      </div>
      
      <div className="px-4">
        <h2 className="font-bold text-lg mb-3">{sportName} Standings</h2>
        
        {isStandingsLoading ? (
          <Skeleton className="w-full h-96" />
        ) : standings && standings.length > 0 ? (
          <StandingsTable 
            sport={selectedSport}
            entries={standings}
            favoriteSchoolId={favoriteSchoolData?.favoriteSchool || null}
          />
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
