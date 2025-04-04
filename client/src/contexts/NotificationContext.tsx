import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { Game, NewsItem } from '@shared/schema';
import { useNotifications } from '../hooks/useNotifications';
import { webSocketService } from '../services/webSocketService';
import { sendGameScoreNotification, sendNewsNotification } from '../services/notificationService';
import { getFavoriteSchool } from '../lib/api';

interface NotificationContextType {
  notifyGameScore: (game: Game, homeTeam: any, awayTeam: any) => void;
  notifyGameStart: (game: Game, homeTeam: any, awayTeam: any) => void;
  notifyNews: (newsItem: NewsItem) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hasPermission, isNotificationEnabled } = useNotifications();
  const [favoriteSchoolId, setFavoriteSchoolId] = useState<string | null>(null);

  // Load favorite school
  useEffect(() => {
    const loadFavoriteSchool = async () => {
      try {
        const schoolId = await getFavoriteSchool();
        setFavoriteSchoolId(schoolId);
      } catch (error) {
        console.error('Error loading favorite school:', error);
      }
    };

    loadFavoriteSchool();
  }, []);

  // Check if a game involves the user's favorite school
  const isGameWithFavoriteSchool = useCallback((game: Game): boolean => {
    if (!favoriteSchoolId) return false;
    return game.homeTeamId === favoriteSchoolId || game.awayTeamId === favoriteSchoolId;
  }, [favoriteSchoolId]);

  // Check if a news item is about the user's favorite school
  const isNewsAboutFavoriteSchool = useCallback((newsItem: NewsItem): boolean => {
    if (!favoriteSchoolId) return false;
    return newsItem.schoolId === favoriteSchoolId;
  }, [favoriteSchoolId]);

  // Notify about game score updates
  const notifyGameScore = useCallback((game: Game, homeTeam: any, awayTeam: any) => {
    // Skip if notifications are not enabled
    if (!hasPermission) return;

    // Check notification preferences
    const isFavoriteSchool = isGameWithFavoriteSchool(game);
    const shouldNotify = isNotificationEnabled('gameScores') && 
                       (isFavoriteSchool || isNotificationEnabled('breakingNews'));

    if (shouldNotify) {
      sendGameScoreNotification(game, homeTeam, awayTeam);
    }
  }, [hasPermission, isNotificationEnabled, isGameWithFavoriteSchool]);

  // Notify about game start
  const notifyGameStart = useCallback((game: Game, homeTeam: any, awayTeam: any) => {
    // Skip if notifications are not enabled
    if (!hasPermission) return;

    // Check notification preferences
    const isFavoriteSchool = isGameWithFavoriteSchool(game);
    const shouldNotify = isNotificationEnabled('gameAlerts') && 
                       (isFavoriteSchool || isNotificationEnabled('breakingNews'));

    if (shouldNotify) {
      // Create a custom game start notification
      if (isFavoriteSchool) {
        const title = `Game Starting: ${homeTeam.shortName} vs ${awayTeam.shortName}`;
        const message = `Your favorite team is about to play!`;
        
        try {
          const notification = new Notification(title, {
            body: message,
            icon: favoriteSchoolId === homeTeam.id ? homeTeam.logoUrl : awayTeam.logoUrl,
            tag: `game_start_${game.id}`,
          });
        } catch (error) {
          console.error('Error sending game start notification:', error);
        }
      }
    }
  }, [hasPermission, isNotificationEnabled, isGameWithFavoriteSchool, favoriteSchoolId]);

  // Notify about news updates
  const notifyNews = useCallback((newsItem: NewsItem) => {
    // Skip if notifications are not enabled
    if (!hasPermission) return;

    // Check notification preferences
    const isFavoriteSchoolNews = isNewsAboutFavoriteSchool(newsItem);
    const shouldNotify = (isFavoriteSchoolNews && isNotificationEnabled('favoriteSchoolNews')) ||
                        isNotificationEnabled('breakingNews');

    if (shouldNotify) {
      sendNewsNotification(newsItem);
    }
  }, [hasPermission, isNotificationEnabled, isNewsAboutFavoriteSchool]);

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    if (!hasPermission) return;

    // Set up WebSocket connection
    const handleGameUpdate = async (game: Game) => {
      try {
        // Fetch the teams data (in a real app, this would come from a cache or API)
        // This is a simplified example
        const homeTeam = {
          id: game.homeTeamId,
          name: `${game.homeTeamId} Team`,
          shortName: game.homeTeamId,
          logoUrl: `/placeholder-logo.png`,
        };
        
        const awayTeam = {
          id: game.awayTeamId,
          name: `${game.awayTeamId} Team`,
          shortName: game.awayTeamId,
          logoUrl: `/placeholder-logo.png`,
        };

        if (game.status === 'live' || game.status === 'final') {
          notifyGameScore(game, homeTeam, awayTeam);
        } else if (game.status === 'scheduled') {
          // Game is about to start (within 15 min)
          const gameStartTime = new Date(game.startTime);
          const currentTime = new Date();
          const minutesUntilStart = (gameStartTime.getTime() - currentTime.getTime()) / (1000 * 60);
          
          if (minutesUntilStart <= 15 && minutesUntilStart >= 0) {
            notifyGameStart(game, homeTeam, awayTeam);
          }
        }
      } catch (error) {
        console.error('Error handling game update:', error);
      }
    };

    const handleNewsUpdate = (news: NewsItem) => {
      notifyNews(news);
    };

    webSocketService.connect({
      onOpen: () => {
        console.log('WebSocket connected in NotificationContext');
      },
      onGameUpdate: handleGameUpdate,
      onNewsUpdate: handleNewsUpdate,
    });

    // Clean up WebSocket connection
    return () => {
      webSocketService.disconnect();
    };
  }, [hasPermission, notifyGameScore, notifyGameStart, notifyNews]);

  const contextValue: NotificationContextType = {
    notifyGameScore,
    notifyGameStart,
    notifyNews,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationManager = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationManager must be used within a NotificationProvider');
  }
  return context;
};