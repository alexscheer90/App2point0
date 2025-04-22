import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Spinner from './Spinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface LiveStatsDisplayProps {
  gameId: string;
}

interface DataSourceInfo {
  recommendedSource: 'sidearm' | 'espn' | 'mac';
  sidearmAvailable: boolean;
  espnAvailable: boolean;
  sidearmUrl?: string;
  espnUrl?: string;
}

const LiveStatsDisplay: React.FC<LiveStatsDisplayProps> = ({ gameId }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [liveData, setLiveData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Get the sport from the gameId (in a real app, this would be passed or stored)
  const sport = gameId.includes('football') ? 'football' : 
                gameId.includes('basketball') ? 'basketball' : 
                gameId.includes('baseball') ? 'baseball' : 'softball';
  
  // Query to check available data sources
  const dataSourceInfo = useQuery({
    queryKey: ['dataSource', gameId, sport],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/live-stats/data-sources/${gameId}/${sport}`);
        if (response.data.success) {
          return response.data.data as DataSourceInfo;
        }
        throw new Error('Failed to get data source info');
      } catch (error) {
        console.error('Error fetching data sources:', error);
        return null;
      }
    },
    refetchInterval: 30000, // Check data sources every 30 seconds
    refetchOnWindowFocus: true
  });
  
  // Effect to set up WebSocket connection for live updates
  useEffect(() => {
    // Only connect if we have a valid game ID
    if (!gameId) return;
    
    // Set up WebSocket connection
    const connectWebSocket = () => {
      setIsConnecting(true);
      
      // Determine WebSocket URL based on current protocol
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      console.log(`Connecting to WebSocket at ${wsUrl}`);
      
      const newSocket = new WebSocket(wsUrl);
      
      newSocket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        
        // Subscribe to updates for this game
        newSocket.send(JSON.stringify({
          type: 'subscribe',
          gameId
        }));
      };
      
      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          // Handle different message types
          if (data.type === 'gameUpdate' && data.gameId === gameId) {
            console.log('Game update data received:', {
              status: data.game?.status,
              homeTeamScore: data.game?.homeTeamScore,
              awayTeamScore: data.game?.awayTeamScore,
              period: data.game?.period,
              situation: data.game?.situation
            });
            setLiveData(data);
          } else if (data.type === 'subscribed' && data.gameId === gameId) {
            console.log(`Successfully subscribed to updates for game ${gameId}`);
          } else {
            console.log('Received message with type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          console.log('Raw message data:', event.data);
        }
      };
      
      newSocket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (socket) {
            connectWebSocket();
          }
        }, 5000);
      };
      
      newSocket.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Error connecting to live updates. Please try again later.');
        setIsConnected(false);
        setIsConnecting(false);
      };
      
      setSocket(newSocket);
    };
    
    connectWebSocket();
    
    // Clean up WebSocket on unmount
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        // Unsubscribe from game updates
        socket.send(JSON.stringify({
          type: 'unsubscribe',
          gameId
        }));
        
        // Close the connection
        socket.close();
      }
      setSocket(null);
    };
  }, [gameId]);
  
  // Ping the server every 30 seconds to keep the connection alive
  useEffect(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    
    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'PING' }));
      }
    }, 30000);
    
    return () => clearInterval(pingInterval);
  }, [socket]);
  
  if (dataSourceInfo.isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
        <span className="ml-2">Checking data sources...</span>
      </div>
    );
  }
  
  if (dataSourceInfo.isError || !dataSourceInfo.data) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Unable to check data sources. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  // If no data sources are available
  if (!dataSourceInfo.data.sidearmAvailable && !dataSourceInfo.data.espnAvailable) {
    return (
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>No live stats available</AlertTitle>
        <AlertDescription>
          Live statistics are not available for this game at the moment.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Render connection status
  const renderConnectionStatus = () => {
    if (isConnecting) {
      return (
        <div className="flex items-center text-blue-600">
          <Spinner size="sm" className="mr-2" />
          <span>Connecting to live updates...</span>
        </div>
      );
    }
    
    if (isConnected) {
      return (
        <div className="flex items-center text-green-600">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          <span>Connected to live updates</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-gray-600">
        <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
        <span>Not connected to live updates</span>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg p-4 shadow mb-4">
      <div className="mb-3 pb-2 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Live Game Stats</h3>
        {renderConnectionStatus()}
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-sm font-semibold">Data Source: </span>
          <span className="text-sm">
            {dataSourceInfo.data.recommendedSource === 'sidearm' 
              ? 'School SIDEARM Stats' 
              : dataSourceInfo.data.recommendedSource === 'espn'
                ? 'ESPN'
                : 'MAC Feed'}
          </span>
        </div>
        
        {dataSourceInfo.data.sidearmAvailable && (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Official School Data
          </span>
        )}
      </div>
      
      {/* Show live data if available */}
      {liveData ? (
        <div>
          {/* Score display */}
          <div className="flex justify-center items-center mb-4 bg-gray-50 p-4 rounded-lg">
            <div className="text-center flex-1">
              <p className="text-sm font-semibold">Home</p>
              <p className="text-3xl font-bold">{liveData.game?.homeTeamScore || 0}</p>
            </div>
            
            <div className="text-center px-4">
              <p className="text-sm font-semibold mb-1">Period</p>
              <p className="text-lg font-medium bg-gray-200 px-3 py-1 rounded">
                {liveData.game?.period || '-'}
              </p>
            </div>
            
            <div className="text-center flex-1">
              <p className="text-sm font-semibold">Away</p>
              <p className="text-3xl font-bold">{liveData.game?.awayTeamScore || 0}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-1">Game Status</h4>
              <p className="text-sm">
                {liveData.game?.status === 'live' ? (
                  <span className="text-green-600 font-semibold">LIVE</span>
                ) : liveData.game?.status === 'final' ? (
                  <span className="font-semibold">FINAL</span>
                ) : (
                  <span>{liveData.game?.status || 'Unknown'}</span>
                )}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-1">Last Updated</h4>
              <p className="text-sm">
                {liveData.timestamp ? new Date(liveData.timestamp).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
            
            {liveData.game?.situation && (
              <div className="col-span-2 mt-2">
                <h4 className="text-sm font-semibold text-gray-500 mb-1">Situation</h4>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  {liveData.game.situation}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          {isConnected ? (
            <p>Connected and waiting for live updates...</p>
          ) : (
            <p>Live updates will appear here once connected.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveStatsDisplay;