import React, { useState } from 'react';
import { Player } from '@shared/schema';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, User, MapPin, School, BarChart, Info } from 'lucide-react';
import { useSchool } from '@/hooks/useSchool';

interface PlayerCardProps {
  player: Player;
  compact?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, compact = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { data: school } = useSchool(player.schoolId);
  
  // Helper function to convert hex color to rgba with opacity
  const getBgColor = (hex: string, opacity: number = 0.15) => {
    if (hex?.startsWith('#')) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return hex || '#eee';
  };
  
  // Generate the avatar fallback based on player name
  const getNameInitials = (name: string) => {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Format stat key for display
  const formatStatKey = (key: string) => {
    // Convert camelCase to separate words
    const words = key.replace(/([A-Z])/g, ' $1').toLowerCase();
    // Capitalize first letter of each word
    return words
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Format the stat value based on its type
  const formatStatValue = (key: string, value: number) => {
    if (key.toLowerCase().includes('percentage')) {
      return `${value.toFixed(1)}%`;
    }
    if (key.toLowerCase().includes('per')) {
      return value.toFixed(1);
    }
    return value.toLocaleString();
  };

  const primaryColor = school?.primaryColor || '#0B213E';
  const secondaryColor = school?.secondaryColor || '#ddd';
  
  // Compact version (for list views)
  if (compact) {
    return (
      <Card className="mb-4 overflow-hidden border-l-4" style={{ borderLeftColor: primaryColor }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                {player.imageUrl ? (
                  <AvatarImage src={player.imageUrl} alt={player.name} />
                ) : (
                  <AvatarFallback style={{ backgroundColor: getBgColor(primaryColor, 0.2), color: primaryColor }}>
                    {getNameInitials(player.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="flex items-center">
                  {player.number && (
                    <Badge variant="outline" className="mr-2" style={{ borderColor: primaryColor, color: primaryColor }}>
                      #{player.number}
                    </Badge>
                  )}
                  <h3 className="font-semibold">{player.name}</h3>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  {player.position && <span className="mr-2">{player.position}</span>}
                  {player.year && <span>{player.year}</span>}
                </div>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">Details</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {player.number && <span>#{player.number}</span>}
                    {player.name}
                  </DialogTitle>
                  <DialogDescription>
                    {player.position && <span className="mr-2">{player.position}</span>}
                    {player.year && <span>{player.year}</span>}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {player.height && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Height:</span> {player.height}
                      </div>
                    )}
                    {player.weight && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Weight:</span> {player.weight}
                      </div>
                    )}
                  </div>
                  
                  {player.hometown && (
                    <div className="flex items-center text-sm gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{player.hometown}</span>
                    </div>
                  )}
                  
                  {player.previousSchool && (
                    <div className="flex items-center text-sm gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <span>{player.previousSchool}</span>
                    </div>
                  )}
                  
                  {player.bio && (
                    <div className="text-sm mt-2">
                      <p>{player.bio}</p>
                    </div>
                  )}
                  
                  {player.stats && Object.keys(player.stats).length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <BarChart className="h-4 w-4" />
                        Statistics
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {Object.entries(player.stats).map(([key, value]) => (
                          <div key={key} className="text-sm flex justify-between">
                            <span className="text-muted-foreground">{formatStatKey(key)}:</span>
                            <span className="font-medium">{formatStatValue(key, value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Full version (for detail views)
  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="pb-3" style={{ backgroundColor: getBgColor(primaryColor, 0.1) }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              {player.imageUrl ? (
                <AvatarImage src={player.imageUrl} alt={player.name} />
              ) : (
                <AvatarFallback style={{ backgroundColor: getBgColor(primaryColor, 0.2), color: primaryColor }}>
                  {getNameInitials(player.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {player.number && (
                  <span className="text-lg font-bold px-2 py-1 rounded" style={{ backgroundColor: getBgColor(primaryColor, 0.15), color: primaryColor }}>
                    #{player.number}
                  </span>
                )}
                {player.name}
              </CardTitle>
              <div className="flex items-center text-muted-foreground">
                {player.position && <span className="mr-2">{player.position}</span>}
                {player.year && <Badge variant="outline">{player.year}</Badge>}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {player.height && (
            <div>
              <span className="text-sm text-muted-foreground">Height</span>
              <p className="font-medium">{player.height}</p>
            </div>
          )}
          {player.weight && (
            <div>
              <span className="text-sm text-muted-foreground">Weight</span>
              <p className="font-medium">{player.weight} lbs</p>
            </div>
          )}
          {player.hometown && (
            <div className="col-span-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Hometown
              </span>
              <p className="font-medium">{player.hometown}</p>
            </div>
          )}
          {player.previousSchool && (
            <div className="col-span-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <School className="h-3 w-3" /> Previous School
              </span>
              <p className="font-medium">{player.previousSchool}</p>
            </div>
          )}
        </div>
        
        {player.bio && (
          <div className="mb-4">
            <span className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
              <Info className="h-3 w-3" /> Bio
            </span>
            <p className="text-sm">{player.bio}</p>
          </div>
        )}
        
        {player.stats && Object.keys(player.stats).length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                Statistics
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs"
              >
                {showDetails ? 'Show Less' : 'Show All'}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(player.stats)
                .slice(0, showDetails ? undefined : 6)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{formatStatKey(key)}</span>
                    <span className="font-medium">{formatStatValue(key, value)}</span>
                  </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerCard;