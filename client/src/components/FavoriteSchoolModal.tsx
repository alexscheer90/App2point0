import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { setFavoriteSchool, getFavoriteSchool } from "../lib/api";
import { queryClient } from "../lib/queryClient";
import { useMacSchools } from "../hooks/useSchool";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

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
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Select Favorite School</DialogTitle>
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
                schools?.map((school) => (
                  <button
                    key={school.id}
                    className="flex items-center justify-between w-full p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                    onClick={() => handleSetFavorite(school.id)}
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
                    {favoriteSchoolData?.favoriteSchool === school.id && (
                      <Check className="h-5 w-5 text-[#019E4F]" />
                    )}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemoveFavorite}
            disabled={!favoriteSchoolData?.favoriteSchool}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Remove Favorite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FavoriteSchoolModal;
