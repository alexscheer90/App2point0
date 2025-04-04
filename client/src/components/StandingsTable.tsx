import { StandingsEntry } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { ScrollArea } from "@/components/ui/scroll-area";

// MAC colors
const MAC_NAVY = "#0B213E";
const MAC_GREEN = "#019E4F";
const MAC_GRAY = "#9DA5A8";

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
  
  // Sort entries by winning percentage (descending)
  const sortedEntries = [...entries].sort((a, b) => 
    b.conference.winningPercentage - a.conference.winningPercentage
  );
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr style={{ backgroundColor: MAC_NAVY }}>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                  Team
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
                  W
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
                  L
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-white">
                  PCT
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEntries.map(entry => {
                const school = schools.find(s => s.id === entry.schoolId);
                if (!school) return null;
                
                const isFavorite = favoriteSchoolId === school.id;
                
                return (
                  <tr 
                    key={entry.schoolId} 
                    className={`hover:bg-gray-50 ${isFavorite ? '' : ''}`}
                    style={isFavorite ? { backgroundColor: `${MAC_GREEN}20` } : {}}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {school.logoUrl ? (
                          // When logo is available
                          <div className="w-6 h-6 mr-2 flex items-center justify-center">
                            <img 
                              src={school.logoUrl} 
                              alt={`${school.name} logo`} 
                              className="max-h-full max-w-full object-contain" 
                            />
                          </div>
                        ) : (
                          // Fallback to circular initial when no logo
                          <div 
                            className="w-6 h-6 mr-2 rounded-full flex items-center justify-center" 
                            style={{ backgroundColor: school.primaryColor }}
                          >
                            <span className="text-xs font-bold" style={{ color: school.secondaryColor }}>
                              {school.shortName.charAt(0)}
                            </span>
                          </div>
                        )}
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
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default StandingsTable;
