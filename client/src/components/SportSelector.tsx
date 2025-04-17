import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMacSports } from "../hooks/useStandings";

interface SportSelectorProps {
  selectedSport: string;
  onChange: (sportId: string) => void;
  showAllOption?: boolean;
}

const SportSelector = ({ selectedSport, onChange, showAllOption = true }: SportSelectorProps) => {
  const { data: sports, isLoading } = useMacSports();
  
  return (
    <div className="relative">
      <Select
        value={selectedSport}
        onValueChange={onChange}
        disabled={isLoading}
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
              {sport.name} {sport.gender !== "mixed" ? `• ${sport.gender.charAt(0).toUpperCase() + sport.gender.slice(1)}` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SportSelector;
