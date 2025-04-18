import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useMacSchools } from "../hooks/useSchool";
import { useMacSports } from "../hooks/useStandings";
import { Game } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share } from "lucide-react";
import { generateLiveStatsUrl } from "../utils/liveStatsUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GameStats {
  boxScore?: {
    homePoints: number[];
    awayPoints: number[];
    totalHome: number;
    totalAway: number;
  };
  leaders?: {
    home: {
      points?: { name: string; value: number };
      rebounds?: { name: string; value: number };
      assists?: { name: string; value: number };
    };
    away: {
      points?: { name: string; value: number };
      rebounds?: { name: string; value: number };
      assists?: { name: string; value: number };
    };
  };
  teamStats?: {
    home: Record<string, number>;
    away: Record<string, number>;
  };
}

const GameStatsPage = () => {
  const params = useParams();
  const [_, setLocation] = useLocation();
  const gameId = params.gameId;
  const [game, setGame] = useState<Game | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");
  
  const { data: schools } = useMacSchools();
  const { data: sports } = useMacSports();
  
  // Fetch game data
  useEffect(() => {
    const fetchGame = async () => {
      setIsLoading(true);
      try {
        // This would be a real API call in production
        // For demo, we'll use mock data
        const mockGame: Game = {
          id: gameId || "mock-game",
          sportId: "mbball",
          homeTeamId: "bowlinggreen",
          awayTeamId: "akron",
          homeTeamScore: 78,
          awayTeamScore: 72,
          startTime: new Date().toISOString(),
          scheduledTime: new Date().toISOString(),
          status: "final",
          period: 2,
          venue: "Stroh Center",
          location: "Bowling Green, OH",
          isRivalryGame: false,
          homeScore: 78,
          awayScore: 72,
        };
        
        setGame(mockGame);
        
        // Fetch stats data
        await fetchGameStats(mockGame);
      } catch (error) {
        console.error("Failed to fetch game:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (gameId) {
      fetchGame();
    }
  }, [gameId]);
  
  // Fetch game stats data
  const fetchGameStats = async (gameData: Game) => {
    // In a real implementation, this would fetch actual data from an API
    // For demo, we'll create mock data
    const mockStats: GameStats = {
      boxScore: {
        homePoints: [35, 43],
        awayPoints: [34, 38],
        totalHome: 78,
        totalAway: 72
      },
      leaders: {
        home: {
          points: { name: "M. Johnson", value: 22 },
          rebounds: { name: "D. Smith", value: 8 },
          assists: { name: "K. Williams", value: 7 }
        },
        away: {
          points: { name: "J. Davis", value: 18 },
          rebounds: { name: "R. Thompson", value: 9 },
          assists: { name: "C. Miller", value: 5 }
        }
      },
      teamStats: {
        home: {
          "FG%": 45.8,
          "3P%": 36.4,
          "FT%": 75.0,
          Rebounds: 38,
          Assists: 17,
          Steals: 7,
          Blocks: 3,
          Turnovers: 12
        },
        away: {
          "FG%": 42.6,
          "3P%": 33.3,
          "FT%": 72.7,
          Rebounds: 35,
          Assists: 14,
          Steals: 9,
          Blocks: 2,
          Turnovers: 14
        }
      }
    };
    
    setStats(mockStats);
  };
  
  const handleBack = () => {
    setLocation("/");
  };
  
  // Render loading state
  if (isLoading || !game || !schools || !sports) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  const homeTeam = schools.find(school => school.id === game.homeTeamId);
  const awayTeam = schools.find(school => school.id === game.awayTeamId);
  const sport = sports.find(sport => sport.id === game.sportId);
  
  if (!homeTeam || !awayTeam || !sport) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <p className="text-center py-8">Game data not found</p>
      </div>
    );
  }
  
  // For connecting to external data source in production
  const externalStatsUrl = game.liveStatsUrl || generateLiveStatsUrl(homeTeam, sport);
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-lg font-bold">{sport.name}</h1>
        <Button variant="ghost" className="p-2 opacity-0">
          <Share className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Game header */}
      <div className="bg-white rounded-lg shadow-md mb-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {homeTeam.logoUrl && (
              <div className="w-12 h-12 mr-3">
                <img
                  src={homeTeam.logoUrl}
                  alt={`${homeTeam.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <p className="font-semibold">{homeTeam.name}</p>
              <p className="text-2xl font-bold">{game.homeTeamScore}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">{game.status === "live" ? "LIVE" : "FINAL"}</div>
            <div className="text-xs px-3 py-1 bg-gray-100 rounded-full">{game.venue}</div>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-3">
              <p className="font-semibold">{awayTeam.name}</p>
              <p className="text-2xl font-bold">{game.awayTeamScore}</p>
            </div>
            {awayTeam.logoUrl && (
              <div className="w-12 h-12">
                <img
                  src={awayTeam.logoUrl}
                  alt={`${awayTeam.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats content */}
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="boxscore">Box Score</TabsTrigger>
          <TabsTrigger value="teamstats">Team Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          {stats?.leaders ? (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-3">Game Leaders</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-center" style={{ color: homeTeam.primaryColor }}>
                    {homeTeam.name}
                  </h3>
                  <div className="space-y-3">
                    {stats.leaders.home.points && (
                      <div className="flex justify-between">
                        <span className="text-sm">Points</span>
                        <span className="text-sm font-medium">{stats.leaders.home.points.name} ({stats.leaders.home.points.value})</span>
                      </div>
                    )}
                    {stats.leaders.home.rebounds && (
                      <div className="flex justify-between">
                        <span className="text-sm">Rebounds</span>
                        <span className="text-sm font-medium">{stats.leaders.home.rebounds.name} ({stats.leaders.home.rebounds.value})</span>
                      </div>
                    )}
                    {stats.leaders.home.assists && (
                      <div className="flex justify-between">
                        <span className="text-sm">Assists</span>
                        <span className="text-sm font-medium">{stats.leaders.home.assists.name} ({stats.leaders.home.assists.value})</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-center" style={{ color: awayTeam.primaryColor }}>
                    {awayTeam.name}
                  </h3>
                  <div className="space-y-3">
                    {stats.leaders.away.points && (
                      <div className="flex justify-between">
                        <span className="text-sm">Points</span>
                        <span className="text-sm font-medium">{stats.leaders.away.points.name} ({stats.leaders.away.points.value})</span>
                      </div>
                    )}
                    {stats.leaders.away.rebounds && (
                      <div className="flex justify-between">
                        <span className="text-sm">Rebounds</span>
                        <span className="text-sm font-medium">{stats.leaders.away.rebounds.name} ({stats.leaders.away.rebounds.value})</span>
                      </div>
                    )}
                    {stats.leaders.away.assists && (
                      <div className="flex justify-between">
                        <span className="text-sm">Assists</span>
                        <span className="text-sm font-medium">{stats.leaders.away.assists.name} ({stats.leaders.away.assists.value})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4 text-center py-6">
              <p className="text-gray-500">No leader stats available</p>
            </div>
          )}
          
          {/* Game Summary */}
          {stats?.boxScore && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-3">Game Summary</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-2">Team</th>
                    {stats.boxScore.homePoints.map((_, index) => (
                      <th key={index} className="pb-2 text-center">{index + 1}</th>
                    ))}
                    <th className="pb-2 text-center">Final</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium" style={{ color: homeTeam.primaryColor }}>{homeTeam.shortName}</td>
                    {stats.boxScore.homePoints.map((points, index) => (
                      <td key={index} className="py-2 text-center">{points}</td>
                    ))}
                    <td className="py-2 text-center font-bold">{stats.boxScore.totalHome}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium" style={{ color: awayTeam.primaryColor }}>{awayTeam.shortName}</td>
                    {stats.boxScore.awayPoints.map((points, index) => (
                      <td key={index} className="py-2 text-center">{points}</td>
                    ))}
                    <td className="py-2 text-center font-bold">{stats.boxScore.totalAway}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="boxscore">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3">Box Score</h2>
            <p className="text-center text-gray-500 py-4">
              Detailed player statistics will appear here in the production app.
            </p>
            <div className="border-t pt-4 mt-4">
              <p className="text-xs text-gray-500 text-center">
                Note: Individual player statistics would be scraped from the school's 
                Sidearm stats site or other data sources.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="teamstats">
          {stats?.teamStats ? (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-3">Team Statistics</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-sm border-b">
                    <th className="pb-2 text-left">Stat</th>
                    <th className="pb-2 text-center font-medium" style={{ color: homeTeam.primaryColor }}>{homeTeam.shortName}</th>
                    <th className="pb-2 text-center font-medium" style={{ color: awayTeam.primaryColor }}>{awayTeam.shortName}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.teamStats ? Object.entries(stats.teamStats.home).map(([key, value], index) => {
                    // Access teamStats safely since we've already checked it exists
                    const teamStats = stats.teamStats!;
                    const awayValue = teamStats.away[key];
                    return (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                        <td className="py-2 text-sm">{key}</td>
                        <td className="py-2 text-center">
                          {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}
                        </td>
                        <td className="py-2 text-center">
                          {typeof awayValue === 'number' && awayValue % 1 !== 0 
                            ? awayValue.toFixed(1) 
                            : awayValue}
                        </td>
                      </tr>
                    );
                  }) : null}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4 text-center py-6">
              <p className="text-gray-500">No team stats available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="my-4 text-center text-xs text-gray-500">
        <p>Data is for demonstration purposes only.</p>
        <p>In production, this would show real-time data from official sources.</p>
      </div>
    </div>
  );
};

export default GameStatsPage;