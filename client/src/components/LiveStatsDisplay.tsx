import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { XCircle, ArrowUpDown, Activity } from 'lucide-react';
import { useLiveGameData } from '../hooks/useLiveGameData';
import { Game } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LiveStatsDisplayProps {
  gameId: string;
}

const LiveStatsDisplay: React.FC<LiveStatsDisplayProps> = ({ gameId }) => {
  const { game, dataSource, isConnected, isLoading } = useLiveGameData(gameId);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-center text-gray-600">Loading live stats...</p>
      </div>
    );
  }
  
  if (!game) {
    return (
      <Alert variant="default" className="mt-4">
        <XCircle className="h-5 w-5" />
        <AlertTitle>Live Stats Unavailable</AlertTitle>
        <AlertDescription>
          Game has not yet started. Stats will populate when the game begins.
          <div className="mt-4 text-center text-sm text-gray-500">
            -- Mobile #MACtion --
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="live-stats-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Live Game Stats</h3>
        <DataSourceBadge source={dataSource} isConnected={isConnected} />
      </div>
      
      {/* Game situation info (specific to each sport) */}
      {game.situation && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Current Play:</span>
          </div>
          <p className="mt-1 text-sm text-gray-700">{game.situation}</p>
        </div>
      )}
      
      {/* Basic game stats */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Game Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <StatItem 
              label="Status" 
              value={game.status === 'live' ? 
                `Live - ${game.period || ''} ${game.clock || ''}` : 
                game.status} 
            />
            <StatItem 
              label="Score" 
              value={`${game.homeTeamScore}-${game.awayTeamScore}`} 
            />
            {game.clock && (
              <StatItem 
                label="Clock" 
                value={game.clock} 
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Team stats - simple version that works for most sports */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Team Stats</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Stat</TableHead>
                <TableHead>{game.awayTeamName}</TableHead>
                <TableHead>{game.homeTeamName}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* These are placeholders - in a real implementation, we'd use actual stats from the API */}
              <TableRow>
                <TableCell className="font-medium">Points</TableCell>
                <TableCell>{game.awayTeamScore}</TableCell>
                <TableCell>{game.homeTeamScore}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">FG%</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">3PT%</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              {/* These are always useful stats for any sport */}
              <TableRow>
                <TableCell className="font-medium">Timeouts</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Fouls/Penalties</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <div className="text-xs text-gray-500 mt-3 italic text-center">
            Data updates every 10 seconds or after major plays
          </div>
        </CardContent>
      </Card>
      
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

// Helper component for stats items
const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default LiveStatsDisplay;