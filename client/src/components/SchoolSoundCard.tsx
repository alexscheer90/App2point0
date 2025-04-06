import React, { useState, useRef, useEffect } from 'react';
import { SchoolSound } from '@shared/schema';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, FileText, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useSchool } from '../hooks/useSchool';
import { formatTime } from '@/lib/utils';

interface SchoolSoundCardProps {
  sound: SchoolSound;
}

const SchoolSoundCard = ({ sound }: SchoolSoundCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { data: school } = useSchool(sound.schoolId);

  useEffect(() => {
    // Create new audio element if not already created
    if (!audioRef.current && sound.audioUrl) {
      const audio = new Audio();
      
      // Fix the audio path to use the correct full path from the server
      const audioPath = `/audio/sounds/${sound.audioUrl.split('/').pop()}`;
      audio.src = audioPath;
      
      console.log("Loading audio from path:", audioPath);
      
      // Set initial volume
      audio.volume = volume;
      
      // Set properties to help with iOS/Safari playback
      audio.preload = "metadata";
      
      // Store the audio element in the ref
      audioRef.current = audio;
    }
    
    const audio = audioRef.current;
    if (!audio) return;

    // Initialize audio duration when metadata is loaded
    const handleLoadedMetadata = () => {
      console.log("Audio metadata loaded, duration:", audio.duration);
      setDuration(audio.duration);
    };

    // Update current time during playback
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Reset when playback ends
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    
    // Handle play event
    const handlePlay = () => {
      console.log("Audio playing");
      setIsPlaying(true);
    };
    
    // Handle pause event
    const handlePause = () => {
      console.log("Audio paused");
      setIsPlaying(false);
    };
    
    // Handle errors
    const handleError = (e: Event) => {
      console.error("Audio error:", e);
    };

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    // Clean up event listeners and pause audio on unmount
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [sound.audioUrl, volume]);

  // Handle play/pause
  const handlePlayPause = () => {
    if (!sound.audioUrl || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Use promise to handle potential playback errors (common on mobile)
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            console.log("Audio playback started successfully");
          })
          .catch(error => {
            // Auto-play was blocked or other error
            console.error("Error playing audio:", error);
            setIsPlaying(false); // Reset state if playback fails
          });
      }
    }
    // Don't set isPlaying directly here, let the event handlers handle it
  };

  // Handle seeking
  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0];
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  // Handle restart
  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

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

  // Get progress color for slider
  const getProgressColor = () => {
    if (!school) return {};
    
    const color = sound.type === 'fight_song' 
      ? school.primaryColor 
      : (school.secondaryColor || school.primaryColor);
    
    return {
      '--progress-color': color,
    } as React.CSSProperties;
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
        
        {sound.audioUrl && (
          <div className="space-y-2">
            {/* Progress bar slider */}
            <div className="px-1">
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
                style={getProgressColor()}
              />
              
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Player controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRestart}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 w-20 justify-center"
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
                
                <div 
                  className="relative" 
                  onMouseEnter={() => setShowVolumeControl(true)}
                  onMouseLeave={() => setShowVolumeControl(false)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleMuteToggle}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {/* Volume slider */}
                  {showVolumeControl && (
                    <div className="absolute -left-12 bottom-full mb-2 bg-white shadow-md rounded-md p-2 w-32 z-10">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="cursor-pointer"
                        style={getProgressColor()}
                      />
                    </div>
                  )}
                </div>
              </div>
              
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SchoolSoundCard;