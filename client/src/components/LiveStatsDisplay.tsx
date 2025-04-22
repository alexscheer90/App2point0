import React from 'react';
import { useLiveGameData } from '../hooks/useLiveGameData';
import { Skeleton } from '@/components/ui/skeleton';
import { Game } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, RotateCw, CheckCircle, XCircle } from 'lucide-react';
import { useMacSchools } from '../hooks/useSchool';

interface LiveStatsDisplayProps {
  gameId: string;
}

const LiveStatsDisplay: React.FC<LiveStatsDisplayProps> = ({ gameId }) => {
  const { game, dataSource, isConnected, isLoading } = useLiveGameData(gameId);
  const { data: schools } = useMacSchools();
  
  if (isLoading) {
    return (
      <div className="space-y-3 py-4">
        <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }
  
  if (!game) {
    return (
      <Alert className="my-4">
        <InfoIcon className="h-5 w-5" />
        <AlertTitle>No live data available</AlertTitle>
        <AlertDescription>
          We couldn't find live statistics for this game.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Get school information
  const homeSchool = schools?.find(s => s.id === game.homeTeamId);
  const awaySchool = schools?.find(s => s.id === game.awayTeamId);
  
  // Format school names
  const homeName = homeSchool?.name || game.homeTeamName || 'Home Team';
  const awayName = awaySchool?.name || game.awayTeamName || 'Away Team';
  
  return (
    <div className="space-y-4 py-2">
      {/* Data source badge */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Live Game Stats</h2>
        <DataSourceBadge source={dataSource} isConnected={isConnected} />
      </div>
      
      {/* Score display */}
      <div className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
        <div className="text-center">
          <div className="font-semibold">{awayName}</div>
          <div className="text-3xl font-bold">{game.awayTeamScore || 0}</div>
        </div>
        
        <div className="text-xl font-semibold">
          {game.status === 'final' ? 'Final' : 'VS'}
        </div>
        
        <div className="text-center">
          <div className="font-semibold">{homeName}</div>
          <div className="text-3xl font-bold">{game.homeTeamScore || 0}</div>
        </div>
      </div>
      
      {/* Game situation */}
      {game.situation && (
        <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Current Situation</h3>
          <p className="text-base">{game.situation}</p>
        </div>
      )}
      
      {/* Period and clock */}
      {(game.period || game.clock) && (
        <div className="grid grid-cols-2 gap-4">
          {game.period && (
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">Period</h3>
              <p className="text-base">{game.period}</p>
            </div>
          )}
          
          {game.clock && (
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">Clock</h3>
              <p className="text-base">{game.clock}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Dynamic stats based on what's available */}
      {game.status === 'live' && dataSource === 'sidearm' && (
        <Alert>
          <InfoIcon className="h-5 w-5" />
          <AlertTitle>Enhanced Stats Available</AlertTitle>
          <AlertDescription>
            You're viewing official school statistics powered by SIDEARM.
          </AlertDescription>
        </Alert>
      )}
      
      {!isConnected && (
        <Alert variant="destructive" className="mt-4">
          <XCircle className="h-5 w-5" />
          <AlertTitle>Connection Lost</AlertTitle>
          <AlertDescription>
            The live stats connection has been lost. We'll try to reconnect automatically.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Helper component for showing the data source
const DataSourceBadge: React.FC<{ source: 'espn' | 'sidearm' | 'mac' | null, isConnected: boolean }> = ({ source, isConnected }) => {
  if (!source) return null;
  
  let badgeText = 'Unknown Source';
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
  
  switch (source) {
    case 'espn':
      badgeText = 'ESPN';
      badgeVariant = 'default';
      break;
    case 'sidearm':
      badgeText = 'SIDEARM (Official)';
      badgeVariant = 'secondary';
      break;
    case 'mac':
      badgeText = 'MAC Calendar';
      badgeVariant = 'outline';
      break;
  }
  
  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      ) : (
        <span className="h-2 w-2 rounded-full bg-red-500"></span>
      )}
      <Badge variant={badgeVariant}>
        {badgeText}
      </Badge>
    </div>
  );
};

export default LiveStatsDisplay;