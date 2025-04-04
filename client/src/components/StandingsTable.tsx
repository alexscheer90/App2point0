import React from 'react';
import { StandingsEntry } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StandingsTableProps {
  sport: string;
  entries: StandingsEntry[];
  favoriteSchoolId?: string | null;
}

const StandingsTable = ({ sport, entries, favoriteSchoolId }: StandingsTableProps) => {
  const { data: schools } = useMacSchools();
  
  if (!schools) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }
  
  // Group entries by division
  const entriesByDivision: { [key: string]: StandingsEntry[] } = {};
  
  entries.forEach(entry => {
    const division = entry.division || "Division I";
    if (!entriesByDivision[division]) {
      entriesByDivision[division] = [];
    }
    entriesByDivision[division].push(entry);
  });
  
  // Sort entries in each division by winning percentage (descending)
  Object.keys(entriesByDivision).forEach(division => {
    entriesByDivision[division].sort((a, b) => 
      b.conference.winningPercentage - a.conference.winningPercentage
    );
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  W
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  L
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PCT
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.keys(entriesByDivision).map(division => (
                <React.Fragment key={division}>
                  <tr className="bg-gray-50">
                    <td className="px-3 py-3 text-sm font-medium" colSpan={4}>
                      {division}
                    </td>
                  </tr>
                  {entriesByDivision[division].map(entry => {
                    const school = schools.find(s => s.id === entry.schoolId);
                    if (!school) return null;
                    
                    const isFavorite = favoriteSchoolId === school.id;
                    
                    return (
                      <tr key={entry.schoolId} className={`hover:bg-gray-50 ${isFavorite ? 'bg-yellow-50' : ''}`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-6 h-6 mr-2 rounded-full flex items-center justify-center" 
                              style={{ backgroundColor: school.primaryColor }}
                            >
                              <span className="text-xs font-bold" style={{ color: school.secondaryColor }}>
                                {school.shortName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{school.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-center text-sm">
                          {entry.conference.wins}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-center text-sm">
                          {entry.conference.losses}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-center text-sm">
                          {entry.conference.winningPercentage.toFixed(3).replace(/^0+/, '')}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default StandingsTable;
