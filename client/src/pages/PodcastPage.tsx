import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePodcast } from '../hooks/usePodcast';
import { PodcastEpisode } from '../services/podcastFeedParser';
import { 
  Headphones, Mic, Play, Pause, Share2, 
  ChevronDown, ChevronUp, Calendar, Clock, 
  Download, ExternalLink, RefreshCw, Info
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Import podcast logo
import podcastLogoImg from '../assets/msc-podcast-logo.png';

// MAC colors for consistent theme
const MAC_NAVY = "#0B213E";
const MAC_GREEN = "#019E4F";
const MAC_GRAY = "#9DA5A8";

const PodcastPage = () => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // No longer using categories
  const [playingEpisode, setPlayingEpisode] = useState<string | null>(null);
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Get podcast data from RSS feed
  const { 
    info, 
    featuredEpisode, 
    regularEpisodes, 
    isLoading, 
    error 
  } = usePodcast();
  
  // Create audio element for playback
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      });
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setAudioDuration(audioRef.current.duration);
        }
      });
      
      audioRef.current.addEventListener('ended', () => {
        setPlayingEpisode(null);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Format time in minutes:seconds
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle play/pause for an episode
  const togglePlay = (episode: PodcastEpisode) => {
    if (playingEpisode === episode.id) {
      // Pause the current episode
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingEpisode(null);
    } else {
      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Start playing the new episode
      if (episode.audioUrl && audioRef.current) {
        audioRef.current.src = episode.audioUrl;
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          toast({
            title: "Playback Error",
            description: "Unable to play this episode. Please try again.",
            variant: "destructive"
          });
        });
        setPlayingEpisode(episode.id);
      }
    }
  };
  
  // Toggle episode details expansion
  const toggleExpandEpisode = (episodeId: string) => {
    if (expandedEpisode === episodeId) {
      setExpandedEpisode(null);
    } else {
      setExpandedEpisode(episodeId);
    }
  };
  
  // Share podcast
  const sharePodcast = (episode?: PodcastEpisode) => {
    const shareData = {
      title: episode ? `MAC Sports Connection - ${episode.title}` : 'MAC Sports Connection Podcast',
      text: episode ? episode.description : 'The official podcast for MAC sports fans',
      url: episode?.audioUrl || 'https://rss.art19.com/mac-sports-connection-podcast',
    };
    
    if (navigator.share) {
      navigator.share(shareData)
        .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareData.url)
        .then(() => {
          toast({
            title: "Link Copied",
            description: "Podcast link copied to clipboard",
          });
        })
        .catch(err => {
          console.error('Failed to copy:', err);
        });
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-[#0C2340]">
          <span className="text-[#C8102E]">MAC</span> Sports Connection
        </h1>
        
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-[#0C2340]">
          <span className="text-[#C8102E]">MAC</span> Sports Connection
        </h1>
        
        <Card className="p-6 text-center">
          <Info className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Unable to Load Podcast</h2>
          <p className="text-gray-600 mb-4">We couldn't load the podcast episodes. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: MAC_NAVY }}>
        <span style={{ color: MAC_GREEN }}>MAC</span> Sports Connection
      </h1>
      
      <Tabs defaultValue="episodes" className="w-full mb-6">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="episodes">Episodes</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="episodes">
          {/* Featured Episode */}
          {featuredEpisode && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <Headphones className="h-4 w-4 mr-2" style={{ color: MAC_GREEN }} />
                Latest Episode
              </h2>
              
              <Card className="overflow-hidden">
                <div style={{
                  background: `linear-gradient(to right, ${MAC_NAVY}, ${MAC_GREEN})`,
                  padding: '1rem',
                  color: 'white'
                }}>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mr-4 shrink-0">
                      {featuredEpisode.imageUrl ? (
                        <img 
                          src={featuredEpisode.imageUrl} 
                          alt="Episode artwork" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img 
                          src={podcastLogoImg} 
                          alt="MAC Sports Connection" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{featuredEpisode.title}</h3>
                      <p className="text-sm text-gray-200 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {featuredEpisode.date}
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        {featuredEpisode.duration}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-200 mb-4">
                    {featuredEpisode.description}
                  </p>
                  
                  {playingEpisode === featuredEpisode.id && (
                    <div className="mb-3">
                      <Progress value={progress} className="h-2 bg-white/20" />
                      <div className="flex justify-between mt-1 text-xs text-gray-300">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(audioDuration)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                      onClick={() => togglePlay(featuredEpisode)}
                    >
                      {playingEpisode === featuredEpisode.id ? (
                        <><Pause className="h-4 w-4 mr-2" /> Pause</>
                      ) : (
                        <><Play className="h-4 w-4 mr-2" /> Play</>
                      )}
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white hover:bg-white/10"
                        onClick={() => window.open(featuredEpisode.audioUrl, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white hover:bg-white/10"
                        onClick={() => sharePodcast(featuredEpisode)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          

          
          {/* Episode List */}
          <div className="space-y-3">
            {regularEpisodes && regularEpisodes.length > 0 ? (
              regularEpisodes.map((episode) => (
                <Card key={episode.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: MAC_NAVY }}>{episode.title}</h3>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {episode.date}
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          {episode.duration}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="rounded-full h-8 w-8 p-0"
                          onClick={() => togglePlay(episode)}
                        >
                          {playingEpisode === episode.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full h-8 w-8 p-0"
                          onClick={() => toggleExpandEpisode(episode.id)}
                        >
                          {expandedEpisode === episode.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {expandedEpisode === episode.id && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-3">
                          {episode.description}
                        </p>
                        
                        {playingEpisode === episode.id && (
                          <div className="mb-3">
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                              <span>{formatTime(currentTime)}</span>
                              <span>{formatTime(audioDuration)}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(episode.audioUrl, '_blank')}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => sharePodcast(episode)}
                          >
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No episodes available.</p>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="about">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 overflow-hidden mr-4 shrink-0">
                <img 
                  src={podcastLogoImg} 
                  alt="MAC Sports Connection" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">MAC Sports Connection</h2>
                <p className="text-sm text-gray-500">ALL #MACTION, ALL THE TIME</p>
              </div>
            </div>
            
            <p className="mb-4 text-gray-700">
              {info?.description || 
                `MAC Sports Connection is your ultimate source for Mid-American Conference sports coverage.
                Each week, our hosts dive deep into football, basketball, and all MAC sports with game recaps,
                previews, interviews with coaches and players, and expert analysis.`}
            </p>
            
            <div>
              <h3 className="font-semibold mb-2">Release Schedule</h3>
              <p className="text-sm text-gray-700">
                New episodes are released regularly, with special episodes during championship weeks.
              </p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscribe">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Subscribe to MAC Sports Connection</h2>
            
            <div className="space-y-4">
              <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-[#9933CC] flex items-center justify-center mr-3">
                  <Headphones className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">Apple Podcasts</span>
                <Button 
                  className="ml-auto" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open('https://podcasts.apple.com/search?term=mac%20sports%20connection', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-[#1ED760] flex items-center justify-center mr-3">
                  <Headphones className="h-5 w-5 text-black" />
                </div>
                <span className="font-medium">Spotify</span>
                <Button 
                  className="ml-auto" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open('https://open.spotify.com/search/mac%20sports%20connection', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-[#5000B9] flex items-center justify-center mr-3">
                  <Headphones className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">Google Podcasts</span>
                <Button 
                  className="ml-auto" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.open('https://podcasts.google.com/search/mac%20sports%20connection', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <h3 className="font-medium mb-2">RSS Feed</h3>
                <div className="flex">
                  <Input 
                    disabled
                    value="https://rss.art19.com/mac-sports-connection-podcast"
                    className="text-sm mr-2"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText('https://rss.art19.com/mac-sports-connection-podcast')
                        .then(() => {
                          toast({
                            title: "RSS Feed Copied",
                            description: "RSS feed URL copied to clipboard",
                          });
                        });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Input component
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

export default PodcastPage;