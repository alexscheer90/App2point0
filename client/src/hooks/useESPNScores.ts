import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Game, Sport } from '@shared/schema';
import ncaaScoreboardService from '../services/ncaaScoreboardService';

/**
 * Hook for fetching live scores from NCAA for a given sport
 */
export function useESPNScores(sportId: string) {
  // Use React Query to fetch and cache the scores
  return useQuery({ 
    queryKey: ['ncaa-scores', sportId],
    queryFn: async () => {
      try {
        const scores = await ncaaScoreboardService.getLiveScores(sportId);
        return scores;
      } catch (error) {
        console.error(`Error fetching NCAA scores for ${sportId}:`, error);
        // Instead of swallowing the error, propagate it so we can handle it in the UI
        throw error;
      }
    },
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Hook for real-time scores with WebSocket updates when available
 */
export function useLiveScores(sportId: string) {
  const [games, setGames] = useState<Game[]>([]);
  const { data: espnGames, isLoading, error } = useESPNScores(sportId);

  useEffect(() => {
    if (espnGames) {
      setGames(espnGames);
    }
  }, [espnGames]);

  // Listen for WebSocket updates as well (the server may broadcast updates)
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    let ws: WebSocket | null = null;
    
    try {
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('Connected to WebSocket for live score updates');
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle game updates from WebSocket
          if (data.type === 'game_update' && data.payload && data.payload.dataSource === 'ncaa') {
            // Update the game in our local state
            setGames(prevGames => {
              const updatedGames = [...prevGames];
              const index = updatedGames.findIndex(g => g.id === data.payload.id);
              
              if (index !== -1) {
                // Update existing game
                updatedGames[index] = {
                  ...updatedGames[index],
                  ...data.payload,
                };
              } else if (data.payload.sportId === sportId) {
                // Add new game if it matches our sport
                updatedGames.push(data.payload);
              }
              
              return updatedGames;
            });
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
    }
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [sportId]);

  return {
    games,
    isLoading,
    error,
  };
}

export default useLiveScores;
