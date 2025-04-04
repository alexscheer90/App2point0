import React from 'react';
import { LocalEats } from '@shared/schema';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Star } from 'lucide-react';

interface LocalEatCardProps {
  restaurant: LocalEats;
}

const LocalEatCard = ({ restaurant }: LocalEatCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/10 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{restaurant.name}</CardTitle>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="bg-white/50 dark:bg-black/20">
                {restaurant.cuisine}
              </Badge>
              {restaurant.rating && (
                <div className="flex items-center text-amber-500 text-sm">
                  <Star className="h-3 w-3 fill-amber-500 mr-0.5" />
                  {restaurant.rating.toFixed(1)}
                </div>
              )}
            </div>
          </div>
          {restaurant.distanceFromCampus && (
            <div className="text-xs text-muted-foreground flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {restaurant.distanceFromCampus}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-3">
        <p className="text-sm text-muted-foreground">{restaurant.description}</p>
        
        {restaurant.address && (
          <div className="mt-3 text-xs text-muted-foreground flex items-start">
            <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
            <span>{restaurant.address}</span>
          </div>
        )}
      </CardContent>
      
      {restaurant.websiteUrl && (
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => window.open(restaurant.websiteUrl, '_blank')}
          >
            <span>Visit Website</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LocalEatCard;