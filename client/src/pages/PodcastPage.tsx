import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMacSchools } from '../hooks/useSchool';
import { 
  Headphones, Mic, Play, Pause, Share2, 
  ChevronDown, ChevronUp, Calendar, Clock, 
  Download, ExternalLink 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

// Mock podcast episodes - replace with real data from RSS feed 
const podcastEpisodes = [
  { 
    id: "ep1",
    title: "MAC Football Season Preview 2025", 
    date: "April 2, 2025",
    duration: "45 mins",
    description: "Our hosts break down what to expect from all MAC teams in the upcoming football season. We discuss key players, coaching changes, and make our season predictions.",
    featured: true,
    imageUrl: null
  },
  { 
    id: "ep2",
    title: "Bowl Game Recap: Toledo vs Miami", 
    date: "March 26, 2025",
    duration: "32 mins",
    description: "Analyzing the thrilling championship game between the Toledo Rockets and the Miami RedHawks.",
    featured: false
  },
  { 
    id: "ep3",
    title: "Rivalry Week: Special Coverage", 
    date: "March 19, 2025",
    duration: "38 mins",
    description: "The history and passion behind the MAC's biggest rivalries, including Battle of I-75 and more.",
    featured: false
  },
  { 
    id: "ep4",
    title: "Interview: Kent State Head Coach", 
    date: "March 12, 2025",
    duration: "41 mins",
    description: "An exclusive conversation with Kent State's head coach about rebuilding the program.",
    featured: false
  },
  { 
    id: "ep5",
    title: "MAC Basketball Tournament Preview", 
    date: "March 5, 2025",
    duration: "36 mins",
    description: "Breaking down the brackets and making predictions for who will cut down the nets.",
    featured: false
  },
  { 
    id: "ep6",
    title: "The History of #MACtion", 
    date: "February 26, 2025",
    duration: "39 mins",
    description: "How the Mid-American Conference became famous for its weeknight football games.",
    featured: false
  }
];

// Mock podcast categories
const podcastCategories = [
  "All Episodes", "Football", "Basketball", "Olympic Sports", "Interviews"
];

const PodcastPage = () => {
  const { data: schools } = useMacSchools();
  const [activeCategory, setActiveCategory] = useState("All Episodes");
  const [playingEpisode, setPlayingEpisode] = useState<string | null>(null);
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>("ep1");
  const [progress, setProgress] = useState(45); // Mock playback progress

  const featuredEpisode = podcastEpisodes.find(ep => ep.featured);
  const regularEpisodes = podcastEpisodes.filter(ep => !ep.featured);

  const togglePlay = (episodeId: string) => {
    if (playingEpisode === episodeId) {
      setPlayingEpisode(null);
    } else {
      setPlayingEpisode(episodeId);
    }
  };

  const toggleExpandEpisode = (episodeId: string) => {
    if (expandedEpisode === episodeId) {
      setExpandedEpisode(null);
    } else {
      setExpandedEpisode(episodeId);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#0C2340]">
        <span className="text-[#C8102E]">MAC</span> Sports Connection
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
                <Headphones className="h-4 w-4 mr-2 text-[#C8102E]" />
                Latest Episode
              </h2>
              
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-[#0C2340] to-[#2D4064] p-4 text-white">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-[#FFD100] flex items-center justify-center mr-4 shrink-0">
                      <Headphones className="h-8 w-8 text-[#0C2340]" />
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
                  
                  <div className="mb-3">
                    <Progress value={progress} className="h-2 bg-white/20" />
                    <div className="flex justify-between mt-1 text-xs text-gray-300">
                      <span>20:15</span>
                      <span>45:00</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                      onClick={() => togglePlay(featuredEpisode.id)}
                    >
                      {playingEpisode === featuredEpisode.id ? (
                        <><Pause className="h-4 w-4 mr-2" /> Pause</>
                      ) : (
                        <><Play className="h-4 w-4 mr-2" /> Play</>
                      )}
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {/* Episode Categories */}
          <div className="mb-4 overflow-x-auto">
            <div className="flex gap-2">
              {podcastCategories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  className={activeCategory === category ? "bg-[#C8102E]" : ""}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Episode List */}
          <div className="space-y-3">
            {regularEpisodes.map((episode) => (
              <Card key={episode.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0C2340]">{episode.title}</h3>
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
                        onClick={() => togglePlay(episode.id)}
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
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="about">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#0C2340] flex items-center justify-center mr-4 shrink-0">
                <Mic className="h-8 w-8 text-[#FFD100]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">MAC Sports Connection</h2>
                <p className="text-sm text-gray-500">The official podcast of #MACtion</p>
              </div>
            </div>
            
            <p className="mb-4 text-gray-700">
              MAC Sports Connection is your ultimate source for Mid-American Conference sports coverage.
              Each week, our hosts dive deep into football, basketball, and all MAC sports with game recaps,
              previews, interviews with coaches and players, and expert analysis.
            </p>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Hosts</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                  <div>
                    <p className="font-medium">Mike Johnson</p>
                    <p className="text-xs text-gray-500">Lead Host</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                  <div>
                    <p className="font-medium">Sarah Williams</p>
                    <p className="text-xs text-gray-500">Analyst</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Release Schedule</h3>
              <p className="text-sm text-gray-700">
                New episodes are released every Wednesday, with special episodes during championship weeks.
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
                <Button className="ml-auto" variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-[#1ED760] flex items-center justify-center mr-3">
                  <Headphones className="h-5 w-5 text-black" />
                </div>
                <span className="font-medium">Spotify</span>
                <Button className="ml-auto" variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-[#5000B9] flex items-center justify-center mr-3">
                  <Headphones className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">Google Podcasts</span>
                <Button className="ml-auto" variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-[#F43E37] flex items-center justify-center mr-3">
                  <Headphones className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">YouTube</span>
                <Button className="ml-auto" variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <Separator />
              
              <div className="pt-2">
                <h3 className="font-medium mb-2">RSS Feed</h3>
                <div className="flex">
                  <Input 
                    disabled
                    value="https://macsportsconnection.com/feed/podcast"
                    className="text-sm mr-2"
                  />
                  <Button variant="outline" size="sm">
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

// Add missing Input component
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

export default PodcastPage;