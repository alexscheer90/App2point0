import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMacSports } from "../hooks/useStandings";
import { hasSportStandings } from "../data/availableSports";

interface Sport {
  id: string;
  name: string;
  gender: string;
  scheduleOnly?: boolean;
  displayName?: string;
  hidden?: boolean; // New property to hide items from dropdown but keep for data filtering
}

interface SportSelectorProps {
  selectedSport: string;
  onChange: (sportId: string) => void;
  showAllOption?: boolean;
  sports?: Sport[]; // Optional array of sports to show instead of fetching from API
  standingsView?: boolean; // If true, hide scheduleOnly sports
}

// Updated with gender-specific names to match our improved data structure
const SPORT_DISPLAY_NAMES: Record<string, string> = {
  // Men's sports
  "baseball": "Baseball",
  "football": "Football",
  "mbball": "Men's Basketball",
  "mgolf": "Men's Golf",
  "mtennis": "Men's Tennis",
  "mswimming": "Men's Swimming & Diving",
  "mtrack": "Men's Track & Field",
  "wrestling": "Wrestling",
  
  // Women's sports
  "field-hockey": "Field Hockey",
  "gymnastics": "Women's Gymnastics",
  "softball": "Softball",
  "volleyball": "Volleyball",
  "wbball": "Women's Basketball",
  "wgolf": "Women's Golf",
  "wlacrosse": "Women's Lacrosse",
  "wsoccer": "Women's Soccer",
  "wswimming": "Women's Swimming & Diving",
  "wtennis": "Women's Tennis",
  "wtrack": "Women's Track & Field",
  
  // Mixed/gender-neutral sports
  "cross-country": "Cross Country",
  
  // Legacy and compatibility IDs
  "lacrosse": "Women's Lacrosse",
  "soccer": "Women's Soccer",
  "xc": "Cross Country",
  "fhockey": "Field Hockey",
  "golf": "Golf",
  "gym": "Women's Gymnastics",
  "wlax": "Women's Lacrosse",
  "wsoc": "Women's Soccer",
  "swimming": "Swimming & Diving",
  "mswim": "Men's Swimming & Diving",
  "wswim": "Women's Swimming & Diving",
  "tennis": "Tennis",
  "mten": "Men's Tennis",
  "wten": "Women's Tennis",
  "track": "Track & Field",
  "wvball": "Volleyball"
};

const SportSelector = ({ 
  selectedSport, 
  onChange, 
  showAllOption = true,
  sports: providedSports,
  standingsView = false
}: SportSelectorProps) => {
  // If sports are provided, use them; otherwise, fetch from API
  const { data: apiSports, isLoading } = useMacSports();
  
  // Use provided sports if available, otherwise use API data
  let sports = providedSports || apiSports || [];
  
  // Filter out appropriate sports based on view, hidden property, and availability of standings data
  sports = sports.filter(sport => {
    // Filter out schedule-only sports in standings view
    if (standingsView && sport.scheduleOnly) {
      return false;
    }
    
    // Filter out hidden sports (used for maintaining legacy IDs)
    if (sport.hidden) {
      return false;
    }
    
    // In standings view, only show sports that have standings data in the Google Sheet
    if (standingsView && !hasSportStandings(sport.id)) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="relative">
      <Select
        value={selectedSport}
        onValueChange={onChange}
        disabled={!providedSports && isLoading}
      >
        <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#C8102E]">
          <SelectValue placeholder="Select a sport" />
        </SelectTrigger>
        <SelectContent>
          {/* Default "Pick a sport..." option */}
          <SelectItem value="none">Pick a sport...</SelectItem>
          
          {/* All Sports option removed per client request */}
          {sports?.map((sport) => (
            <SelectItem key={sport.id} value={sport.id}>
              {SPORT_DISPLAY_NAMES[sport.id] || sport.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SportSelector;
