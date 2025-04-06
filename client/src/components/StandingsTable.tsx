import { StandingsEntry } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";

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
  
  // Sort entries by conference winning percentage (descending)
  const sortedEntries = [...entries].sort((a, b) => {
    return b.conference.winningPercentage - a.conference.winningPercentage;
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="w-full">
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr style={{ backgroundColor: MAC_NAVY }}>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                Team
              </th>
              <th colSpan={4} className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">
                Conference
              </th>
              <th colSpan={4} className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">
                Overall
              </th>
            </tr>
            <tr style={{ backgroundColor: MAC_NAVY }}>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-white"></th>
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">W</th>
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">L</th>
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">T</th>
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">PCT</th>
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">W</th>
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">L</th>
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">T</th>
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">PCT</th>
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
                  className={`hover:bg-gray-50`}
                  style={isFavorite ? { backgroundColor: `${MAC_GREEN}20` } : {}}
                >
                  <td className="px-2 py-3">
                    <div className="flex items-center">
                      {school.logoUrl ? (
                        // When logo is available
                        <div className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center">
                          <img 
                            src={school.logoUrl} 
                            alt={`${school.name} logo`} 
                            className="max-h-full max-w-full object-contain" 
                          />
                        </div>
                      ) : (
                        // Fallback to circular initial when no logo
                        <div 
                          className="w-6 h-6 mr-2 flex-shrink-0 rounded-full flex items-center justify-center" 
                          style={{ backgroundColor: school.primaryColor }}
                        >
                          <span className="text-xs font-bold" style={{ color: school.secondaryColor }}>
                            {school.shortName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900 truncate">{school.name}</span>
                    </div>
                  </td>
                  {/* Conference Record */}
                  <td className="px-1 py-3 text-center text-sm">
                    {entry.conference.wins}
                  </td>
                  <td className="px-1 py-3 text-center text-sm">
                    {entry.conference.losses}
                  </td>
                  <td className="px-1 py-3 text-center text-sm">
                    {entry.conference.ties || "-"}
                  </td>
                  <td className="px-1 py-3 text-center text-sm">
                    {entry.conference.winningPercentage.toFixed(3).replace(/^0+/, '')}
                  </td>
                  {/* Overall Record */}
                  <td className="px-1 py-3 text-center text-sm">
                    {entry.overall.wins}
                  </td>
                  <td className="px-1 py-3 text-center text-sm">
                    {entry.overall.losses}
                  </td>
                  <td className="px-1 py-3 text-center text-sm">
                    {entry.overall.ties || "-"}
                  </td>
                  <td className="px-1 py-3 text-center text-sm">
                    {entry.overall.winningPercentage.toFixed(3).replace(/^0+/, '')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsTable;
