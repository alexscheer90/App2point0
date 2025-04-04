import React, { useState } from 'react';
import { SchoolSound } from '@shared/schema';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface SchoolSoundCardProps {
  sound: SchoolSound;
}

const SchoolSoundCard = ({ sound }: SchoolSoundCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (!sound.audioUrl) return;
    
    if (!audioElement) {
      const audio = new Audio(sound.audioUrl);
      audio.addEventListener('ended', () => setIsPlaying(false));
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  React.useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  const getCardStyle = () => {
    return {
      borderLeft: sound.type === 'fight_song' 
        ? '4px solid #FFC107' // Gold border for fight songs
        : '4px solid #3F51B5'  // Blue border for alma maters
    };
  };

  return (
    <Card className="overflow-hidden" style={getCardStyle()}>
      <CardHeader className={cn(
        "pb-2",
        sound.type === 'fight_song' 
          ? "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10" 
          : "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10"
      )}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Music className="h-4 w-4" />
            {sound.title}
          </CardTitle>
          <span className="text-xs text-muted-foreground capitalize">
            {sound.type.replace("_", " ")}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 pb-2">
        {sound.description && (
          <p className="text-sm text-muted-foreground mb-4">{sound.description}</p>
        )}
        
        <div className="flex justify-between">
          {sound.audioUrl && (
            <Button 
              variant="outline" 
              size="sm"
              className={cn(
                "flex items-center gap-2",
                isPlaying ? "bg-primary/10" : ""
              )}
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
          )}
          
          {sound.lyrics && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Lyrics
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{sound.title} Lyrics</DialogTitle>
                </DialogHeader>
                <div className="mt-4 whitespace-pre-line">{sound.lyrics}</div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolSoundCard;