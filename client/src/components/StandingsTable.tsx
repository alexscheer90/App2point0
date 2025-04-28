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

// Extend StandingsEntry to include division information for wrestling
// and metadata for special columns like points and goals in women's soccer
interface ExtendedStandingsEntry extends StandingsEntry {
  division?: 'East' | 'West';
  metadata?: {
    points?: number;
    goalsFor?: number;
    goalsAgainst?: number;
    [key: string]: any;
  };
}

const StandingsTable = ({ sport, entries, favoriteSchoolId }: StandingsTableProps) => {
  const { data: schools } = useMacSchools();
  
  // Handle loading state
  if (!schools) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }
  
  // Log the entries and school IDs for debugging
  console.log("Standings entries:", entries.map(e => `${e.schoolId} (${e.conference.wins}-${e.conference.losses})`));
  console.log("Available school IDs:", schools.map(s => s.id));
  
  // Check if this sport shows ties (soccer)
  const showTies = sport === 'soccer' || sport === 'wsoc' || sport === 'msoc';
  
  // Check if this is wrestling (which has East/West divisions)
  const hasEastWestDivision = sport === 'wrestling';
  
  // Check if this is women's soccer (has points & goals columns)
  const isWomensSoccer = sport === 'wsoc';
  
  // Process entries based on sport - create this variable first
  let processedEntries: ExtendedStandingsEntry[] = [...entries] as ExtendedStandingsEntry[];
  
  // Has soccer points? (Check if any entry has metadata.points)
  const hasPoints = isWomensSoccer && processedEntries.some(e => e.metadata?.points !== undefined);
  
  // Has goals data? (Check if any entry has metadata.goalsFor/goalsAgainst)
  const hasGoals = isWomensSoccer && processedEntries.some(e => 
    e.metadata?.goalsFor !== undefined || e.metadata?.goalsAgainst !== undefined
  );

  // Calculate column span for table headers
  // For women's soccer with points/goals, we add those columns to the standard layout
  let conferenceColSpan = showTies ? 4 : 3; // Base columns: W, L, [T], PCT
  
  // Add extra columns for women's soccer's special fields
  if (isWomensSoccer) {
    if (hasPoints) conferenceColSpan += 1;
    if (hasGoals) conferenceColSpan += 1;
  }
  
  const overallColSpan = showTies ? 4 : 3;
  
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
          return { ...entry, division: 'East' as const };
        } else if (westSchools.includes(entry.schoolId)) {
          return { ...entry, division: 'West' as const };
        }
        return entry;
      });
    }
    
    // Sort entries within each division by winning percentage
    const eastEntries = processedEntries
      .filter(entry => entry.division === 'East')
      .sort((a, b) => b.conference.winningPercentage - a.conference.winningPercentage);
    
    const westEntries = processedEntries
      .filter(entry => entry.division === 'West')
      .sort((a, b) => b.conference.winningPercentage - a.conference.winningPercentage);
    
    // Other entries that don't have a division
    const otherEntries = processedEntries
      .filter(entry => !entry.division)
      .sort((a, b) => b.conference.winningPercentage - a.conference.winningPercentage);
    
    // Combine entries in division order
    processedEntries = [...eastEntries, ...westEntries, ...otherEntries];
  } else {
    // For other sports, just sort by winning percentage
    processedEntries.sort((a, b) => b.conference.winningPercentage - a.conference.winningPercentage);
  }
  
  // Render team row
  const renderTeamRow = (entry: ExtendedStandingsEntry) => {
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
        
        {/* Women's Soccer Points (if available) */}
        {isWomensSoccer && hasPoints && (
          <td className="px-1 py-3 text-center text-sm font-semibold">
            {entry.metadata?.points || 0}
          </td>
        )}
        
        {/* Women's Soccer Goals (if available) */}
        {isWomensSoccer && hasGoals && (
          <td className="px-1 py-3 text-center text-sm">
            {entry.metadata?.goalsFor || 0}-{entry.metadata?.goalsAgainst || 0}
          </td>
        )}
        
        {/* Standard Conference Record (always shown) */}
        <td className="px-1 py-3 text-center text-sm">
          {entry.conference.wins}
        </td>
        <td className="px-1 py-3 text-center text-sm">
          {entry.conference.losses}
        </td>
        {showTies && (
          <td className="px-1 py-3 text-center text-sm">
            {entry.conference.ties || 0}
          </td>
        )}
        
        {/* Conference Percentage (shown for all sports) */}
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
        {showTies && (
          <td className="px-1 py-3 text-center text-sm">
            {entry.overall.ties || 0}
          </td>
        )}
        <td className="px-1 py-3 text-center text-sm">
          {entry.overall.winningPercentage.toFixed(3).replace(/^0+/, '')}
        </td>
      </tr>
    );
  };
  
  // Calculate the total number of columns in the table for colSpan values
  const getTotalColumns = () => {
    let columns = 1; // Team column
    
    // Conference columns (W, L, [T], PCT)
    columns += showTies ? 4 : 3;
    
    // Add special columns for women's soccer
    if (isWomensSoccer) {
      if (hasPoints) columns += 1;
      if (hasGoals) columns += 1;
    }
    
    // Overall columns (W, L, [T], PCT)
    columns += showTies ? 4 : 3;
    
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
              <th colSpan={overallColSpan} className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">
                Overall
              </th>
            </tr>
            <tr style={{ backgroundColor: MAC_NAVY }}>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-white"></th>
              
              {/* Women's Soccer Points (if available) */}
              {isWomensSoccer && hasPoints && (
                <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">PTS</th>
              )}
              
              {/* Women's Soccer Goals (if available) */}
              {isWomensSoccer && hasGoals && (
                <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">GOALS</th>
              )}
              
              {/* Standard W-L-T columns (always shown) */}
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">W</th>
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">L</th>
              {showTies && (
                <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">T</th>
              )}
              
              {/* PCT column shown for all */}
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">PCT</th>
              
              {/* Overall record columns */}
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">W</th>
              <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">L</th>
              {showTies && (
                <th className="px-1 py-2 text-center text-xs font-medium uppercase tracking-wider text-white">T</th>
              )}
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