import { useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { setFavoriteSchool, getFavoriteSchool } from "../lib/api";
import { queryClient } from "../lib/queryClient";
import { useMacSchools, useSchool } from "../hooks/useSchool";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { School } from "@shared/schema";

interface FavoriteSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoriteSchoolModal = ({ isOpen, onClose }: FavoriteSchoolModalProps) => {
  const { toast } = useToast();
  const { data: favoriteSchoolData } = useQuery<{ favoriteSchool: string | null }>({
    queryKey: ['/api/preferences/favorite-school'],
    select: (data) => data || { favoriteSchool: null }
  });
  
  const { data: schools, isLoading } = useMacSchools();
  
  // Get the favorite school details
  const favoriteSchool = useMemo(() => {
    if (!favoriteSchoolData?.favoriteSchool || !schools) return null;
    return schools.find(school => school.id === favoriteSchoolData.favoriteSchool) || null;
  }, [favoriteSchoolData?.favoriteSchool, schools]);
  
  const mutation = useMutation({
    mutationFn: setFavoriteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/preferences/favorite-school'] });
      toast({
        title: "Favorite school updated",
        description: "Your favorite school preference has been saved.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update favorite school. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSetFavorite = (schoolId: string) => {
    mutation.mutate(schoolId);
  };
  
  const handleRemoveFavorite = () => {
    mutation.mutate(null);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white" aria-describedby="favorite-school-description">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-xl font-bold flex items-center">
            <span className="text-[#019E4F] mr-1">Select</span> 
            <span>Favorite School</span>
            {favoriteSchool && (
              <div 
                className="w-6 h-6 ml-2 rounded-full" 
                style={{ backgroundColor: favoriteSchool.primaryColor }}
              />
            )}
          </DialogTitle>
          <DialogDescription id="favorite-school-description">
            Choose your favorite MAC school to personalize your experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-1">
          <p className="text-sm text-gray-600 mb-4">
            Your favorite school will appear at the top of your feed and you'll receive notifications about their games.
          </p>
          
          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-2">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8102E]"></div>
                </div>
              ) : (
                schools?.map((school) => {
                  const isSelected = favoriteSchoolData?.favoriteSchool === school.id;
                  const bgColor = isSelected ? `bg-opacity-10 bg-[${school.primaryColor}]` : "bg-white";
                  const borderColor = isSelected ? `border-[${school.primaryColor}]` : "border-gray-200";
                  
                  return (
                    <button
                      key={school.id}
                      className={`flex items-center justify-between w-full p-3 border rounded-lg transition-all duration-200`}
                      onClick={() => handleSetFavorite(school.id)}
                      style={{ 
                        backgroundColor: isSelected ? `${school.primaryColor}10` : "white", 
                        borderColor: isSelected ? school.primaryColor : "#e5e7eb",
                        boxShadow: isSelected ? `0 0 0 1px ${school.primaryColor}20` : "none"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = isSelected ? `${school.primaryColor}20` : "#f9fafb";
                        e.currentTarget.style.boxShadow = isSelected ? `0 0 0 2px ${school.primaryColor}30` : "none";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = isSelected ? `${school.primaryColor}10` : "white";
                        e.currentTarget.style.boxShadow = isSelected ? `0 0 0 1px ${school.primaryColor}20` : "none";
                      }}
                      aria-label={`Select ${school.name} ${school.mascot} as favorite school`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center mr-3 overflow-hidden">
                          <img 
                            src={school.logoUrl} 
                            alt={`${school.name} logo`} 
                            className="w-9 h-9 object-contain"
                          />
                        </div>
                        <span className="font-medium">{school.name} {school.mascot}</span>
                      </div>
                      {isSelected && (
                        <Check 
                          className="h-5 w-5" 
                          style={{ color: school.primaryColor }}
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
            aria-label="Cancel favorite school selection"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemoveFavorite}
            disabled={!favoriteSchoolData?.favoriteSchool}
            className="w-full transition-all duration-200"
            style={{ 
              backgroundColor: favoriteSchool ? favoriteSchool.primaryColor : "#ef4444",
              color: favoriteSchool ? favoriteSchool.secondaryColor || "white" : "white"
            }}
            aria-label={favoriteSchool ? `Remove ${favoriteSchool.name} as favorite school` : `Remove favorite school`}
            onMouseOver={(e) => {
              if (favoriteSchool) {
                // Darken the primary color by 10% for hover
                const darkenColor = (color: string) => {
                  // Simple function to darken a hex color
                  const hex = color.replace('#', '');
                  let r = parseInt(hex.substring(0, 2), 16);
                  let g = parseInt(hex.substring(2, 4), 16);
                  let b = parseInt(hex.substring(4, 6), 16);
                  
                  r = Math.max(0, Math.floor(r * 0.9));
                  g = Math.max(0, Math.floor(g * 0.9));
                  b = Math.max(0, Math.floor(b * 0.9));
                  
                  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                };
                
                e.currentTarget.style.backgroundColor = darkenColor(favoriteSchool.primaryColor);
              } else {
                e.currentTarget.style.backgroundColor = "#dc2626"; // Darker red
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = favoriteSchool ? favoriteSchool.primaryColor : "#ef4444";
            }}
          >
            Remove Favorite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FavoriteSchoolModal;
