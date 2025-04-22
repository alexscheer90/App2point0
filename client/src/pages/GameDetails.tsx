import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Game } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '../components/Spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import LiveStatsDisplay from '../components/LiveStatsDisplay';
import { useMacSchools } from '../hooks/useSchool';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';

const GameDetails: React.FC = () => {
  const { gameId } = useParams();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const { data: game, isLoading, error } = useQuery({
    queryKey: [`/api/games/${gameId}`],
    enabled: !!gameId,
  });
  
  const { data: schools } = useMacSchools();
  
  // Check data source availability
  const { data: dataSourceInfo, isLoading: dataSourceLoading } = useQuery({
    queryKey: [`/api/live-stats/availability/${gameId}`],
    enabled: !!gameId && game?.status === 'live',
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="large" />
      </div>
    );
  }
  
  if (error || !game) {
    return (
      <Alert variant="destructive" className="mx-4 my-8">
        <AlertTitle>Error loading game</AlertTitle>
        <AlertDescription>
          We couldn't load this game. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  const homeSchool = schools?.find(s => s.id === game.homeTeamId);
  const awaySchool = schools?.find(s => s.id === game.awayTeamId);
  
  // Format school names
  const homeName = homeSchool?.name || game.homeTeamName || 'Home Team';
  const awayName = awaySchool?.name || game.awayTeamName || 'Away Team';
  
  // Format game date
  const gameDate = new Date(game.startTime);
  const formattedDate = gameDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = gameDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{awayName} at {homeName}</h1>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-gray-600">{formattedDate} • {formattedTime}</span>
          <GameStatusBadge status={game.status} />
        </div>
        <div className="text-sm text-gray-500">
          {game.venue && (
            <div>{game.venue}</div>
          )}
        </div>
      </header>
      
      {/* Data source availability info for live games */}
      {game.status === 'live' && dataSourceInfo && (
        <div className="mb-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Live Data Sources</AlertTitle>
            <AlertDescription>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-2">
                  <Badge variant={dataSourceInfo.data?.sidearmAvailable ? 'default' : 'outline'}>
                    SIDEARM Stats
                  </Badge>
                  <span className="text-sm">
                    {dataSourceInfo.data?.sidearmAvailable 
                      ? 'Available - Official school stats' 
                      : 'Not available'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={dataSourceInfo.data?.espnAvailable ? 'default' : 'outline'}>
                    ESPN Data
                  </Badge>
                  <span className="text-sm">
                    {dataSourceInfo.data?.espnAvailable 
                      ? 'Available' 
                      : 'Not available'}
                  </span>
                </div>
                {dataSourceInfo.data?.recommendedSource && (
                  <div className="text-sm mt-1">
                    <strong>Using:</strong> {dataSourceInfo.data.recommendedSource === 'sidearm' 
                      ? 'Official SIDEARM Stats' 
                      : 'ESPN Data'}
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="boxscore">Box Score</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="py-4">
          <div className="text-center mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-center w-1/3">
                <div className="font-semibold mb-2">{awayName}</div>
                {awaySchool?.logoUrl ? (
                  <img 
                    src={awaySchool.logoUrl} 
                    alt={`${awayName} logo`} 
                    className="h-24 mx-auto object-contain" 
                  />
                ) : (
                  <div 
                    className="h-24 w-24 rounded-full mx-auto flex items-center justify-center" 
                    style={{ 
                      backgroundColor: awaySchool?.primaryColor || '#ddd',
                      color: awaySchool?.secondaryColor || '#333'
                    }}
                  >
                    <span className="text-2xl font-bold">
                      {awayName.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="text-3xl font-bold mt-2">{game.awayTeamScore || 0}</div>
              </div>
              
              <div className="text-xl font-semibold">
                {game.status === 'live' && (
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-green-600 font-normal mb-1">
                      LIVE
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1 animate-pulse"></span>
                    </span>
                    {game.period && (
                      <span className="text-md font-normal">
                        {typeof game.period === 'number' 
                          ? `Period ${game.period}` 
                          : game.period}
                      </span>
                    )}
                    {game.clock && (
                      <span className="text-md font-normal">{game.clock}</span>
                    )}
                  </div>
                )}
                {game.status === 'final' && (
                  <span>Final</span>
                )}
                {game.status === 'scheduled' && (
                  <span>VS</span>
                )}
              </div>
              
              <div className="text-center w-1/3">
                <div className="font-semibold mb-2">{homeName}</div>
                {homeSchool?.logoUrl ? (
                  <img 
                    src={homeSchool.logoUrl} 
                    alt={`${homeName} logo`} 
                    className="h-24 mx-auto object-contain" 
                  />
                ) : (
                  <div 
                    className="h-24 w-24 rounded-full mx-auto flex items-center justify-center" 
                    style={{ 
                      backgroundColor: homeSchool?.primaryColor || '#ddd',
                      color: homeSchool?.secondaryColor || '#333'
                    }}
                  >
                    <span className="text-2xl font-bold">
                      {homeName.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="text-3xl font-bold mt-2">{game.homeTeamScore || 0}</div>
              </div>
            </div>
          </div>
          
          {/* Game situation */}
          {game.situation && (
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">Current Situation</h3>
              <p className="text-base">{game.situation}</p>
            </div>
          )}
          
          {/* Live stats component - if the game is live */}
          {game.status === 'live' && (
            <LiveStatsDisplay gameId={gameId || ''} />
          )}
          
          {/* Box score link - if game is completed */}
          {game.status === 'final' && game.links?.s_boxscore && (
            <div className="mt-4">
              <a
                href={game.links.s_boxscore}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                View Official Box Score
              </a>
            </div>
          )}
          
          {/* Game links */}
          {game.links && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Game Links</h3>
              <div className="flex flex-wrap gap-3">
                {game.links.s_livestats && (
                  <a 
                    href={game.links.s_livestats} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                  >
                    Live Stats
                  </a>
                )}
                {game.links.s_audio && (
                  <a 
                    href={game.links.s_audio} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Listen Live
                  </a>
                )}
                {game.links.s_video && (
                  <a 
                    href={game.links.s_video} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
                  >
                    Watch Live
                  </a>
                )}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="stats" className="py-4">
          {/* Stats will be implemented in future iterations */}
          <div className="text-center py-12 px-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Game Statistics</h3>
            <p className="text-gray-500">
              {game.status === 'scheduled' 
                ? 'Statistics will be available once the game starts.'
                : game.status === 'live'
                ? 'Live statistics are being collected.'
                : 'Full game statistics are being processed.'}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="boxscore" className="py-4">
          {/* Box score will be implemented in future iterations */}
          <div className="text-center py-12 px-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Box Score</h3>
            <p className="text-gray-500">
              {game.status === 'scheduled' 
                ? 'Box score will be available once the game starts.'
                : game.status === 'live'
                ? 'Live box score is being updated as the game progresses.'
                : game.status === 'final' && game.links?.s_boxscore
                ? 'Click the link below to view the official box score.'
                : 'Box score is being prepared.'}
            </p>
            
            {game.status === 'final' && game.links?.s_boxscore && (
              <div className="mt-4">
                <a
                  href={game.links.s_boxscore}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  View Official Box Score
                </a>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component to display game status
const GameStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let color = '';
  let label = '';
  
  switch (status) {
    case 'scheduled':
      color = 'bg-blue-100 text-blue-800';
      label = 'Upcoming';
      break;
    case 'live':
      color = 'bg-green-100 text-green-800';
      label = 'Live';
      break;
    case 'final':
      color = 'bg-gray-100 text-gray-800';
      label = 'Final';
      break;
    case 'postponed':
      color = 'bg-yellow-100 text-yellow-800';
      label = 'Postponed';
      break;
    case 'cancelled':
      color = 'bg-red-100 text-red-800';
      label = 'Cancelled';
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
      label = status;
  }
  
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
};

export default GameDetails;