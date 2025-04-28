import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMacSports } from "../hooks/useStandings";

interface Sport {
  id: string;
  name: string;
  gender: string;
  scheduleOnly?: boolean;
  displayName?: string;
  showInStandings?: boolean;
}

interface SportSelectorProps {
  selectedSport: string;
  onChange: (sportId: string) => void;
  showAllOption?: boolean;
  sports?: Sport[]; // Optional array of sports to show instead of fetching from API
  standingsView?: boolean; // If true, hide scheduleOnly sports
}

const SPORT_DISPLAY_NAMES: Record<string, string> = {
  "baseball": "Baseball",
  "mbball": "Basketball - Men",
  "wbball": "Basketball - Women",
  "xc": "Cross Country",
  "fhockey": "Field Hockey",
  "football": "Football",
  "golf": "Golf",
  "mgolf": "Golf",
  "wgolf": "Golf",
  "gym": "Gymnastics",
  "wlax": "Lacrosse",
  "wsoc": "Soccer - Women",
  "softball": "Softball",
  "swimming": "Swimming & Diving",
  "mswim": "Swimming & Diving",
  "wswim": "Swimming & Diving",
  "tennis": "Tennis",
  "mten": "Tennis",
  "wten": "Tennis",
  "track": "Track & Field",
  "wvball": "Volleyball",
  "wrestling": "Wrestling"
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
  
  // If in standings view, filter out scheduleOnly sports and sports flagged not to show in standings
  if (standingsView) {
    sports = sports.filter(sport => !sport.scheduleOnly && sport.showInStandings !== false);
  }
  
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
          {showAllOption && (
            <SelectItem value="all">All Sports</SelectItem>
          )}
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
