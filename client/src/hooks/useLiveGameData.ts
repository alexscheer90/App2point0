import { useState, useEffect, useRef } from "react";
import { Game } from "@shared/schema";

interface LiveGameData {
  game: Game | null;
  dataSource: 'espn' | 'sidearm' | 'mac' | null;
  isConnected: boolean;
  isLoading: boolean;
}

/**
 * Hook to subscribe to real-time game updates via WebSocket
 */
export function useLiveGameData(gameId: string): LiveGameData {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [game, setGame] = useState<Game | null>(null);
  const [dataSource, setDataSource] = useState<'espn' | 'sidearm' | 'mac' | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    // Create WebSocket connection to our server
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    // Initialize WebSocket
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    // Setup event handlers
    socket.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected");
      
      // Subscribe to the game updates
      socket.send(JSON.stringify({
        type: 'subscribe',
        gameId
      }));
    };
    
    socket.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle different message types
        switch (data.type) {
          case 'gameUpdate':
            console.log(`Received game update for ${data.gameId}`, data);
            setGame(data.game);
            setDataSource(data.dataSource);
            setIsLoading(false);
            break;
            
          default:
            // Handle other message types
            break;
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    // Initial fetch of game data from the REST API
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`/api/live-stats/games/${gameId}`);
        const data = await response.json();
        
        if (data.success) {
          setGame(data.data);
          setDataSource(data.source);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching initial game data:", error);
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
    
    // Cleanup function to close the socket when component unmounts
    return () => {
      // Unsubscribe from game updates before disconnecting
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'unsubscribe',
          gameId
        }));
        
        socket.close();
      }
    };
  }, [gameId]);
  
  return {
    game,
    dataSource,
    isConnected,
    isLoading
  };
}