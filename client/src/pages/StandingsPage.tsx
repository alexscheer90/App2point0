import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SportSelector from "../components/SportSelector";
import StandingsTable from "../components/StandingsTable";
import { useStandings, useMacSports } from "../hooks/useStandings";
import { Skeleton } from "@/components/ui/skeleton";
import { Sport } from "@shared/schema";
import macLogo from "@assets/IMG_0693.png";
import { useLocation } from "wouter";

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
  
  // Define a list of test sports to quickly check implementations
  const testSports = [
    { id: 'football', name: 'Football' },
    { id: 'baseball', name: 'Baseball' },
    { id: 'wrestling', name: 'Wrestling' },
    { id: 'wsoccer', name: 'Women\'s Soccer' }
  ];

  // Get selected sport data for mapping wsoc/wsoccer -> women's soccer in the UI
  const mapSportIdToName = (sportId: string) => {
    if (sportId === 'wsoc' || sportId === 'wsoccer') return 'Women\'s Soccer';
    return sportId.charAt(0).toUpperCase() + sportId.slice(1);
  };

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
        
        {/* Quick Test Navigation for Development */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Sport-Specific Implementations</h3>
          <div className="flex flex-wrap gap-2">
            {testSports.map(sport => (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`px-3 py-1 text-sm rounded-full transition-colors 
                  ${selectedSport === sport.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {sport.name}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Testing sport-specific column handling: 
            Women's Soccer (points, goals) | Wrestling (divisions)
          </p>
        </div>
      </div>
    </div>
  );
};

export default StandingsPage;
