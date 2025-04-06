import React, { useState } from 'react';
import { SchoolSound } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useSchool } from '../hooks/useSchool';

interface SchoolSoundCardProps {
  sound: SchoolSound;
}

const SchoolSoundCard = ({ sound }: SchoolSoundCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: school } = useSchool(sound.schoolId);
  
  // Helper function to convert hex color to rgba with opacity
  const getBgColor = (hex: string, opacity: number = 0.15) => {
    if (hex.startsWith('#')) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return hex;
  };

  // Generate styles based on school colors
  const getCardStyle = () => {
    if (!school) return {};
    
    // Get the appropriate color based on sound type
    const color = sound.type === 'fight_song' 
      ? school.primaryColor
      : (school.secondaryColor || school.primaryColor);
    
    // Return the card style with background color
    return {
      backgroundColor: sound.type === 'fight_song'
        ? getBgColor(school.primaryColor, 0.15)
        : getBgColor(school.secondaryColor || school.primaryColor, 0.15),
      borderLeft: `4px solid ${color}`
    };
  };

  // Create color for text and button elements
  const getTextStyle = () => {
    if (!school) return {};
    
    return {
      color: sound.type === 'fight_song'
        ? school.primaryColor
        : (school.secondaryColor || school.primaryColor)
    };
  };
  
  // Style for the play/pause button
  const getButtonStyle = () => {
    if (!school) return {};
    
    const color = sound.type === 'fight_song' 
      ? school.primaryColor 
      : (school.secondaryColor || school.primaryColor);
    
    return {
      borderColor: color,
      color: color
    };
  };

  // Handle play/pause action
  const handlePlayPause = () => {
    // For now, just toggle the button state without playing audio
    setIsPlaying(!isPlaying);
    
    // In the future, this will play/pause actual audio
    console.log(`${isPlaying ? 'Pausing' : 'Playing'} ${sound.title}`);
  };

  return (
    <Card className="overflow-hidden" style={getCardStyle()}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {school?.logoUrl && (
              <div className="w-8 h-8 flex-shrink-0">
                <img 
                  src={school.logoUrl} 
                  alt={`${school.name} logo`} 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Music className="h-4 w-4" />
              {sound.title}
            </CardTitle>
          </div>
          <span 
            className="text-xs font-medium capitalize px-2 py-1 rounded-full"
            style={{
              backgroundColor: school ? getBgColor(school.primaryColor, 0.12) : '#f1f1f1',
              color: school ? school.primaryColor : 'inherit'
            }}
          >
            {sound.type.replace("_", " ")}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 pb-3">
        {sound.description && (
          <p className="text-sm text-muted-foreground mb-4">{sound.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 w-24 justify-center"
            style={getButtonStyle()}
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Play
              </>
            )}
          </Button>
          
          {sound.lyrics && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  style={getButtonStyle()}
                >
                  <FileText className="h-4 w-4" />
                  View Lyrics
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle 
                    className="flex items-center gap-2"
                    style={getTextStyle()}
                  >
                    {school?.logoUrl && (
                      <div className="w-6 h-6 flex-shrink-0">
                        <img 
                          src={school.logoUrl} 
                          alt={`${school.name} logo`} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    {sound.title} Lyrics
                  </DialogTitle>
                  <DialogDescription>
                    Lyrics for {school?.name || ""} {sound.type.replace("_", " ")}
                  </DialogDescription>
                </DialogHeader>
                <div 
                  className="mt-4 whitespace-pre-line p-4 rounded-md"
                  style={{
                    backgroundColor: school 
                      ? sound.type === 'fight_song'
                        ? getBgColor(school.primaryColor, 0.1)
                        : getBgColor(school.secondaryColor || school.primaryColor, 0.1)
                      : 'inherit',
                    borderLeft: school 
                      ? `3px solid ${sound.type === 'fight_song' 
                          ? school.primaryColor 
                          : (school.secondaryColor || school.primaryColor)}`
                      : 'none'
                  }}
                >
                  {sound.lyrics}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolSoundCard;