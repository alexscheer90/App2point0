import { useQuery, useMutation } from "@tanstack/react-query";
import { getFavoriteSchool } from "../lib/api";
import { queryClient } from "../lib/queryClient";
import { useMacSchools } from "../hooks/useSchool";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FavoriteSchoolBannerProps {
  onChangeFavorite: () => void;
}

const FavoriteSchoolBanner = ({ onChangeFavorite }: FavoriteSchoolBannerProps) => {
  const { data: favoriteSchoolId, isLoading: isFavoriteLoading } = useQuery({
    queryKey: ['/api/preferences/favorite-school'],
  });
  
  const { data: schools, isLoading: areSchoolsLoading } = useMacSchools();
  
  if (isFavoriteLoading || areSchoolsLoading) {
    return null;
  }
  
  // If there's no favorite school, don't render the banner
  if (!favoriteSchoolId?.favoriteSchool) {
    return null;
  }
  
  const favoriteSchool = schools?.find(school => school.id === favoriteSchoolId.favoriteSchool);
  
  if (!favoriteSchool) {
    return null;
  }
  
  return (
    <div className="bg-[#FFD100] px-4 py-2 flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-6 h-6 rounded-full mr-2 flex items-center justify-center bg-[#0C2340]">
          <span className="text-xs text-white font-bold">{favoriteSchool.shortName.charAt(0)}</span>
        </div>
        <p className="text-sm text-[#0C2340] font-semibold">
          {favoriteSchool.name} {favoriteSchool.mascot}
        </p>
      </div>
      <Button 
        variant="secondary" 
        size="sm" 
        className="text-xs bg-[#0C2340] text-white hover:bg-[#0a1d36]"
        onClick={onChangeFavorite}
      >
        Change
      </Button>
    </div>
  );
};

export default FavoriteSchoolBanner;
