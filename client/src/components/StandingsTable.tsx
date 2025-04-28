import { StandingsEntry } from "@shared/schema";
import { useState } from "react";
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
  const { data: schools_data } = useMacSchools();
  
  // Handle loading state
  if (!schools_data) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }
  
  const [schools] = useState(() => schools_data);
  
  // Log the entries and school IDs for debugging
  console.log("Standings entries:", entries.map(e => `${e.schoolId} (${e.confWins}-${e.confLosses})`));
  console.log("Available school IDs:", schools.map(s => s.id));
  
  // Check if this is wrestling (which has East/West divisions)
  const hasEastWestDivision = sport === 'wrestling';
  
  // Check if this is women's soccer (has W-L-T format and possibly points columns)
  const isWomensSoccer = sport === 'wsoc' || sport === 'wsoccer';
  
  // Show ties if this is women's soccer or if any entry has ties
  const showTies = isWomensSoccer || entries.some(e => e.confTies !== undefined && e.confTies > 0);
  
  // Check if any entries have points data
  const hasPoints = entries.some(e => e.points !== undefined && e.points > 0);

  // Calculate column span for table headers
  // PTS (if applicable), W, L, [T], PCT
  // Adjust column count based on points and ties
  let columnCount = 3; // W, L, PCT by default
  if (showTies) columnCount++;
  if (hasPoints) columnCount++;
  const conferenceColSpan = columnCount;
  
  // Create a local copy of entries for processing
  let processedEntries = [...entries];
  
  if (hasEastWestDivision) {
    // Define East and West division schools for wrestling if not already specified in the data
    const eastSchools = ['lockhaven', 'georgemason', 'rider', 'edinboro', 'clevelandstate', 'clarion', 'bloomsburg'];
    const westSchools = ['northernillinois', 'centralmichigan', 'ohio', 'siuedwardsville', 'buffalo', 'kentstate'];
    
    // First check if division information is already in the entries
    const hasDivisionData = processedEntries.some(entry => entry.division !== undefined);
    
    if (!hasDivisionData) {
      // If division data is not available in the entries, set it based on school lists
      processedEntries = processedEntries.map(entry => {
        if (eastSchools.includes(entry.schoolId)) {
          return { ...entry, division: 'East' };
        } else if (westSchools.includes(entry.schoolId)) {
          return { ...entry, division: 'West' };
        }
        return entry;
      });
    }
    
    // Sort entries within each division by winning percentage
    const eastEntries = processedEntries
      .filter(entry => entry.division === 'East')
      .sort((a, b) => b.confWinPercentage - a.confWinPercentage);
    
    const westEntries = processedEntries
      .filter(entry => entry.division === 'West')
      .sort((a, b) => b.confWinPercentage - a.confWinPercentage);
    
    // Other entries that don't have a division
    const otherEntries = processedEntries
      .filter(entry => !entry.division)
      .sort((a, b) => b.confWinPercentage - a.confWinPercentage);
    
    // Combine entries in division order
    processedEntries = [...eastEntries, ...westEntries, ...otherEntries];
  } else {
    // For other sports, just sort by winning percentage
    processedEntries.sort((a, b) => b.confWinPercentage - a.confWinPercentage);
  }
  
  // Render team row
  const renderTeamRow = (entry: StandingsEntry) => {
    const school = schools.find(s => s.id === entry.schoolId);
    if (!school) return null;
    
    const isFavorite = favoriteSchoolId === school.id;
    
    return (
      <tr 
        key={entry.schoolId} 
        className="hover:bg-gray-50"
        style={isFavorite ? { backgroundColor: `${MAC_GREEN}20` } : {}}
      >
        <td className="px-2 py-3">
          <div className="flex items-center">
            {school.logoUrl ? (
              <div className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center">
                <img 
                  src={school.logoUrl} 
                  alt={`${school.name} logo`} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              <div 
                className="w-6 h-6 mr-2 flex-shrink-0 rounded-full flex items-center justify-center" 
                style={{ backgroundColor: school.primaryColor }}
              >
                <span className="text-xs font-bold" style={{ color: school.secondaryColor }}>
                  {school.shortName.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 truncate">{school.name}</span>
              {school.affiliate && (
                <span className="text-xs text-gray-500 italic">Affiliate Member</span>
              )}
            </div>
          </div>
        </td>
        
        {/* Points column for soccer if applicable */}
        {hasPoints && (
          <td className="px-1 py-3 text-center text-sm">
            {entry.points || 0}
          </td>
        )}
        
        {/* Conference Record (always shown) */}
        <td className="px-1 py-3 text-center text-sm">
          {entry.confWins}
        </td>
        <td className="px-1 py-3 text-center text-sm">
          {entry.confLosses}
        </td>
        {showTies && (
          <td className="px-1 py-3 text-center text-sm">
            {entry.confTies || 0}
          </td>
        )}
        
        {/* Conference Percentage */}
        <td className="px-1 py-3 text-center text-sm">
          {entry.confWinPercentage.toFixed(3).replace(/^0+/, '')}
        </td>
      </tr>
    );
  };
  
  // Calculate the total number of columns in the table for colSpan values
  const getTotalColumns = () => {
    let columns = 1; // Team column
    
    // Conference columns (W, L, [T], PCT)
    columns += showTies ? 4 : 3;
    
    // No longer counting Overall columns as they've been removed
    
    return columns;
  };
  
  // Render division header
  const renderDivisionHeader = (divisionName: string) => (
    <tr className="bg-gray-100">
      <td
        colSpan={getTotalColumns()}
        className="px-3 py-2 text-sm font-medium text-gray-700"
      >
        {divisionName} DIVISION
      </td>
    </tr>
  );
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="w-full">
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr style={{ backgroundColor: MAC_NAVY }}>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                Team
              </th>
              <th colSpan={conferenceColSpan} className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">
                Conference
              </th>
            </tr>
            <tr style={{ backgroundColor: MAC_NAVY }}>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-white"></th>
              
              {/* Points column for soccer if applicable */}
              {hasPoints && (
                <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">PTS</th>
              )}
              
              {/* Standard W-L-T columns (always shown) */}
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">W</th>
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">L</th>
              {showTies && (
                <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">T</th>
              )}
              
              {/* PCT column shown for all */}
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">PCT</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hasEastWestDivision ? (
              <>
                {/* East Division */}
                {renderDivisionHeader('EAST')}
                {processedEntries
                  .filter(entry => entry.division === 'East')
                  .map(entry => renderTeamRow(entry))}
                
                {/* West Division */}
                {renderDivisionHeader('WEST')}
                {processedEntries
                  .filter(entry => entry.division === 'West')
                  .map(entry => renderTeamRow(entry))}
                
                {/* Other entries (if any) */}
                {processedEntries
                  .filter(entry => !entry.division)
                  .length > 0 && (
                    <>
                      {renderDivisionHeader('OTHER')}
                      {processedEntries
                        .filter(entry => !entry.division)
                        .map(entry => renderTeamRow(entry))}
                    </>
                  )}
              </>
            ) : (
              // Regular standings without divisions
              processedEntries.map(entry => renderTeamRow(entry))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsTable;