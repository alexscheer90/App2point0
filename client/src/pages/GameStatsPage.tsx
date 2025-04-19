import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useMacSchools } from "../hooks/useSchool";
import { useMacSports } from "../hooks/useStandings";
import { Game } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { generateLiveStatsUrl } from "../utils/liveStatsUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGame } from "../lib/api";
import { fetchSidearmStats } from "../services/sidearmStatsService";

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
  
  // Fetch game data using our API
  useEffect(() => {
    const fetchGame = async () => {
      setIsLoading(true);
      try {
        // Use the getGame API function to fetch the game data by ID
        const fetchedGame = await getGame(gameId || "");
        
        if (fetchedGame) {
          console.log("Found game:", fetchedGame);
          setGame(fetchedGame);
          
          // Fetch stats data for the game
          await fetchGameStats(fetchedGame);
        } else {
          console.error(`Game with ID ${gameId} not found`);
        }
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
    if (!schools) return;
    
    const homeTeam = schools.find(school => school.id === gameData.homeTeamId);
    const sport = sports?.find(sport => sport.id === gameData.sportId);
    
    if (!homeTeam || !sport) {
      console.error("Could not find home team or sport data");
      return;
    }
    
    try {
      // Try to fetch stats from the Sidearm stats service
      const sidearmStats = await fetchSidearmStats(homeTeam, sport, gameData.id);
      
      if (sidearmStats) {
        // If we got stats from Sidearm, use them
        console.log("Fetched stats from Sidearm service");
        setStats(sidearmStats);
        return;
      }
    } catch (error) {
      console.error("Error fetching Sidearm stats:", error);
    }
    
    // If we couldn't get stats from Sidearm or there was an error, use fallback stats
    console.log("Using fallback stats data");
    
    let fallbackStats: GameStats;
    
    if (gameData.sportId === "baseball") {
      // Baseball fallback stats
      fallbackStats = {
        boxScore: {
          homePoints: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          awayPoints: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          totalHome: gameData.homeTeamScore || 0,
          totalAway: gameData.awayTeamScore || 0
        },
        leaders: {
          home: {
            points: { name: "N/A", value: 0 }, // RBIs
            rebounds: { name: "N/A", value: 0 }, // Hits
            assists: { name: "N/A", value: 0 }  // Stolen bases
          },
          away: {
            points: { name: "N/A", value: 0 }, // RBIs
            rebounds: { name: "N/A", value: 0 }, // Hits
            assists: { name: "N/A", value: 0 }  // Stolen bases
          }
        },
        teamStats: {
          home: {
            "Hits": 0,
            "Errors": 0,
            "LOB": 0
          },
          away: {
            "Hits": 0,
            "Errors": 0,
            "LOB": 0
          }
        }
      };
    } else if (gameData.sportId === "softball") {
      // Softball fallback stats
      fallbackStats = {
        boxScore: {
          homePoints: [0, 0, 0, 0, 0, 0, 0], // 7 innings
          awayPoints: [0, 0, 0, 0, 0, 0, 0], // 7 innings
          totalHome: gameData.homeTeamScore || 0,
          totalAway: gameData.awayTeamScore || 0
        },
        leaders: {
          home: {
            points: { name: "N/A", value: 0 }, // RBIs
            rebounds: { name: "N/A", value: 0 }, // Hits
            assists: { name: "N/A", value: 0 }  // Stolen bases
          },
          away: {
            points: { name: "N/A", value: 0 }, // RBIs
            rebounds: { name: "N/A", value: 0 }, // Hits
            assists: { name: "N/A", value: 0 }  // Stolen bases
          }
        },
        teamStats: {
          home: {
            "Hits": 0,
            "Errors": 0,
            "LOB": 0
          },
          away: {
            "Hits": 0,
            "Errors": 0,
            "LOB": 0
          }
        }
      };
    } else {
      // Default basketball fallback stats
      fallbackStats = {
        boxScore: {
          homePoints: [0, 0],
          awayPoints: [0, 0],
          totalHome: gameData.homeTeamScore || 0,
          totalAway: gameData.awayTeamScore || 0
        },
        leaders: {
          home: {
            points: { name: "N/A", value: 0 },
            rebounds: { name: "N/A", value: 0 },
            assists: { name: "N/A", value: 0 }
          },
          away: {
            points: { name: "N/A", value: 0 },
            rebounds: { name: "N/A", value: 0 },
            assists: { name: "N/A", value: 0 }
          }
        },
        teamStats: {
          home: {
            "FG%": 0,
            "3P%": 0,
            "FT%": 0,
            "Rebounds": 0,
            "Assists": 0,
            "Steals": 0,
            "Blocks": 0,
            "Turnovers": 0
          },
          away: {
            "FG%": 0,
            "3P%": 0,
            "FT%": 0,
            "Rebounds": 0,
            "Assists": 0,
            "Steals": 0,
            "Blocks": 0,
            "Turnovers": 0
          }
        }
      };
    }
    
    setStats(fallbackStats);
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
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={handleBack} className="px-2 mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Baseball</h1>
      </div>
      
      {/* Game header - Based on the screenshots */}
      <div className="bg-white rounded-lg shadow-md mb-4 p-4">
        <div className="flex justify-between items-center">
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
            <div className="text-sm font-medium mb-1">FINAL</div>
            <div className="text-xs px-3 py-1 bg-gray-100 rounded-full">
              McKie Field at Hayden Park
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-3">
              <p className="font-semibold">Central Michigan</p>
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
      
      {/* Stats content - Tabs design from screenshot */}
      <div className="bg-blue-100 rounded-lg mb-4 flex overflow-hidden">
        <button 
          className={`flex-1 py-3 text-center ${activeTab === "summary" ? "bg-blue-400 text-white" : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </button>
        <button 
          className={`flex-1 py-3 text-center ${activeTab === "boxscore" ? "bg-blue-400 text-white" : ""}`}
          onClick={() => setActiveTab("boxscore")}
        >
          Box Score
        </button>
        <button 
          className={`flex-1 py-3 text-center ${activeTab === "teamstats" ? "bg-blue-400 text-white" : ""}`}
          onClick={() => setActiveTab("teamstats")}
        >
          Team Stats
        </button>
      </div>
      
      {activeTab === "summary" && (
        <div className="space-y-4">
          {/* Game Leaders - Redesigned to match screenshot */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3">Game Leaders</h2>
            <div className="w-full">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <h3 className="font-medium text-red-700 mb-2">Miami</h3>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-red-800 mb-2">Central Michigan</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-3">
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm">RBIs</span>
                    <span className="text-sm font-medium">
                      {stats?.leaders?.home?.points ? 
                       `${stats.leaders.home.points.name} (${stats.leaders.home.points.value})` : 
                       'N/A'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm">RBIs</span>
                    <span className="text-sm font-medium">
                      {stats?.leaders?.away?.points ? 
                       `${stats.leaders.away.points.name} (${stats.leaders.away.points.value})` : 
                       'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-3">
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm">Hits</span>
                    <span className="text-sm font-medium">
                      {stats?.leaders?.home?.rebounds ? 
                       `${stats.leaders.home.rebounds.name} (${stats.leaders.home.rebounds.value})` : 
                       'N/A'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm">Hits</span>
                    <span className="text-sm font-medium">
                      {stats?.leaders?.away?.rebounds ? 
                       `${stats.leaders.away.rebounds.name} (${stats.leaders.away.rebounds.value})` : 
                       'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm">Stolen Bases</span>
                    <span className="text-sm font-medium">
                      {stats?.leaders?.home?.assists ? 
                       `${stats.leaders.home.assists.name} (${stats.leaders.home.assists.value})` : 
                       'N/A'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm">Stolen Bases</span>
                    <span className="text-sm font-medium">
                      {stats?.leaders?.away?.assists ? 
                       `${stats.leaders.away.assists.name} (${stats.leaders.away.assists.value})` : 
                       'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Game Summary */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3">Game Summary</h2>
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-2">Team</th>
                  <th className="pb-2 text-center">1</th>
                  <th className="pb-2 text-center">2</th>
                  <th className="pb-2 text-center">3</th>
                  <th className="pb-2 text-center">4</th>
                  <th className="pb-2 text-center">5</th>
                  <th className="pb-2 text-center">6</th>
                  <th className="pb-2 text-center">7</th>
                  <th className="pb-2 text-center">8</th>
                  <th className="pb-2 text-center">9</th>
                  <th className="pb-2 text-center">Final</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium text-red-700">Miami</td>
                  {stats?.boxScore?.homePoints.map((score, index) => (
                    <td key={`home-${index}`} className="py-2 text-center">
                      {score}
                    </td>
                  ))}
                  <td className="py-2 text-center font-bold">
                    {stats?.boxScore?.totalHome || 0}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-red-800">CMU</td>
                  {stats?.boxScore?.awayPoints.map((score, index) => (
                    <td key={`away-${index}`} className="py-2 text-center">
                      {score}
                    </td>
                  ))}
                  <td className="py-2 text-center font-bold">
                    {stats?.boxScore?.totalAway || 0}
                  </td>
                </tr>
              </tbody>
            </table>
            
            {/* Add "View Full Stats" link using the actual game's live stats URL */}
            <div className="mt-4 text-center">
              <a 
                href={game.links?.s_livestats || externalStatsUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                View Full Stats on {homeTeam.name} Official Site
                <svg 
                  className="w-3 h-3 ml-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                  />
                </svg>
              </a>
            </div>
            
            {/* Add the data disclaimer from screenshot */}
            <div className="mt-2 text-xs text-gray-500 text-center">
              <p>Data is for demonstration purposes only.</p>
              <p>In production, this would show real-time data from official sources.</p>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === "boxscore" && (
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
      )}
      
      {activeTab === "teamstats" && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3">Team Statistics</h2>
          <table className="w-full">
            <thead>
              <tr className="text-sm border-b">
                <th className="pb-2 text-left">Stat</th>
                <th className="pb-2 text-center font-medium text-red-700">Miami</th>
                <th className="pb-2 text-center font-medium text-red-800">CMU</th>
              </tr>
            </thead>
            <tbody>
              {/* Dynamically generate team stats rows from the data */}
              {stats?.teamStats && stats.teamStats.home ? (
                Object.keys(stats.teamStats.home).map((stat, index) => (
                  <tr key={stat} className="border-b">
                    <td className="py-2 text-sm">{stat}</td>
                    <td className="py-2 text-center">{stats.teamStats?.home[stat]}</td>
                    <td className="py-2 text-center">{stats.teamStats?.away && stat in stats.teamStats.away ? stats.teamStats.away[stat] : 0}</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="border-b">
                    <td className="py-2 text-sm">Hits</td>
                    <td className="py-2 text-center">0</td>
                    <td className="py-2 text-center">0</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-sm">Errors</td>
                    <td className="py-2 text-center">0</td>
                    <td className="py-2 text-center">0</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-sm">LOB</td>
                    <td className="py-2 text-center">0</td>
                    <td className="py-2 text-center">0</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GameStatsPage;