import React, { useState, useRef, useEffect } from 'react';
import { SchoolSound } from '@shared/schema';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useSchool } from '../hooks/useSchool';
import { getOptimizedImagePath, handleImageError } from '../utils/imageOptimizer';

interface SchoolSoundCardProps {
  sound: SchoolSound;
}

const SchoolSoundCard = ({ sound }: SchoolSoundCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { data: school } = useSchool(sound.schoolId);

  const handlePlayPause = () => {
    if (!sound.audioUrl || !audioRef.current || audioError) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Reset the audio to the beginning if it ended
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0;
      }
      
      // Play with error handling
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Audio playback failed:", error);
            setIsPlaying(false);
            setAudioError(true);
          });
      } else {
        setIsPlaying(true);
      }
    }
  };

  // Handle audio end event
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    if (audio) {
      audio.addEventListener('ended', handleEnded);
      
      // Clean up
      return () => {
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

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

  return (
    <Card className="overflow-hidden" style={getCardStyle()}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          {school?.logoUrl && (
            <div className="w-8 h-8 flex-shrink-0">
              <img 
                src={school.logoUrl}
                alt={`${school.name} logo`} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = getOptimizedImagePath(school.name, true);
                  handleImageError(e);
                }}
                loading="lazy"
              />
            </div>
          )}
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Music className="h-4 w-4" />
            {sound.title}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 pb-2">
        {sound.description && (
          <p className="text-sm text-muted-foreground mb-4">{sound.description}</p>
        )}
        
        <div className="flex justify-between">
          {sound.audioUrl && (
            <>
              <audio 
                ref={audioRef} 
                src={sound.audioUrl} 
                preload="auto"
                onError={() => setAudioError(true)}
                aria-label={`${sound.title} audio`} 
              />
              {audioError ? (
                <div className="flex items-center text-sm text-red-500">
                  <span className="h-4 w-4 mr-1">⚠️</span>
                  Audio not available
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  style={getButtonStyle()}
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? `Pause ${sound.title}` : `Play ${sound.title}`}
                  aria-pressed={isPlaying}
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
              )}
            </>
          )}
          
          {sound.lyrics && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  style={getButtonStyle()}
                  aria-label={`View lyrics for ${sound.title}`}
                >
                  <FileText className="h-4 w-4" />
                  View Lyrics
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md" aria-describedby={`lyrics-description-${sound.id}`}>
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
                  <div className="text-sm text-muted-foreground" id={`lyrics-description-${sound.id}`}>
                    Lyrics for {sound.title}
                  </div>
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