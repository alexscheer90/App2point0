import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '../hooks/useNotifications';
import { requestNotificationPermission } from '../services/notificationService';
import { webSocketService } from '../services/webSocketService';
import { Game, NewsItem } from '@shared/schema';
import NotificationSettingsModal from '../components/NotificationSettingsModal';
import { useNotificationManager } from '../contexts/NotificationContext';

const TestNotificationsPage: React.FC = () => {
  const { notifyGameScore, notifyGameStart, notifyNews } = useNotificationManager();
  const { isSupported, hasPermission, requestPermission } = useNotifications();
  const [wsStatus, setWsStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [logs, setLogs] = useState<string[]>([]);

  // Helper function to add logs
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Connect to WebSocket
  const connectWebSocket = () => {
    setWsStatus('connecting');
    addLog('Connecting to WebSocket...');

    webSocketService.connect({
      onOpen: () => {
        setWsStatus('connected');
        addLog('WebSocket connected');
      },
      onClose: () => {
        setWsStatus('disconnected');
        addLog('WebSocket disconnected');
      },
      onError: (error) => {
        setWsStatus('disconnected');
        addLog(`WebSocket error: ${error}`);
      },
      onGameUpdate: (game) => {
        addLog(`Game update received: ${game.homeTeamId} vs ${game.awayTeamId}`);
        // This is handled by the NotificationProvider in a real app
      },
      onNewsUpdate: (news) => {
        addLog(`News update received: ${news.title}`);
        // This is handled by the NotificationProvider in a real app
      }
    });
  };

  // Disconnect from WebSocket
  const disconnectWebSocket = () => {
    webSocketService.disconnect();
    setWsStatus('disconnected');
    addLog('WebSocket disconnected');
  };

  // Request notification permission
  const handleRequestPermission = async () => {
    addLog('Requesting notification permission...');
    const granted = await requestPermission();
    if (granted) {
      addLog('Notification permission granted');
      toast({
        title: 'Notifications Enabled',
        description: 'You will now receive notifications for game updates and news.',
      });
    } else {
      addLog('Notification permission denied');
      toast({
        title: 'Notifications Disabled',
        description: 'You will not receive notifications. You can change this in your browser settings.',
        variant: 'destructive',
      });
    }
  };

  // Test sending a game score notification
  const testGameScoreNotification = () => {
    if (!hasPermission) {
      toast({
        title: 'Permission Required',
        description: 'You need to enable notifications first.',
        variant: 'destructive',
      });
      return;
    }

    const testGame: Game = {
      id: 'test_game_1',
      sportId: 'football',
      homeTeamId: 'toledo',
      awayTeamId: 'bgsu',
      homeTeamScore: 27,
      awayTeamScore: 24,
      startTime: new Date().toISOString(),
      status: 'final',
      period: 4,
      clock: '0:00',
      venue: 'Glass Bowl',
      isRivalryGame: true,
    };

    const homeTeam = {
      id: 'toledo',
      name: 'Toledo Rockets',
      shortName: 'Toledo',
      mascot: 'Rockets',
      primaryColor: '#003E7E',
      secondaryColor: '#FFCE00',
      logoUrl: 'https://example.com/toledo.png',
    };

    const awayTeam = {
      id: 'bgsu',
      name: 'Bowling Green Falcons',
      shortName: 'BGSU',
      mascot: 'Falcons',
      primaryColor: '#FE5000',
      secondaryColor: '#4F2C1D',
      logoUrl: 'https://example.com/bgsu.png',
    };

    notifyGameScore(testGame, homeTeam, awayTeam);
    addLog('Test game score notification sent');
  };

  // Test sending a news notification
  const testNewsNotification = () => {
    if (!hasPermission) {
      toast({
        title: 'Permission Required',
        description: 'You need to enable notifications first.',
        variant: 'destructive',
      });
      return;
    }

    const testNews: NewsItem = {
      id: 'test_news_1',
      schoolId: 'toledo',
      title: 'Toledo Wins MAC Championship',
      summary: 'Rockets defeat Falcons in thrilling overtime game.',
      publishedAt: new Date().toISOString(),
      url: 'https://example.com/toledo-wins-mac',
    };

    notifyNews(testNews);
    addLog('Test news notification sent');
  };

  // Clean up WebSocket connection on component unmount
  useEffect(() => {
    return () => {
      if (webSocketService.isConnected()) {
        webSocketService.disconnect();
      }
    };
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <h1 className="text-2xl font-bold">
        <span className="text-green-600">Notification</span> Test
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>WebSocket Connection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  wsStatus === 'connected'
                    ? 'bg-green-500'
                    : wsStatus === 'connecting'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              />
              <span>Status: {wsStatus}</span>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={connectWebSocket}
                disabled={wsStatus === 'connected' || wsStatus === 'connecting'}
                className="bg-green-600 hover:bg-green-700"
              >
                Connect
              </Button>
              <Button
                onClick={disconnectWebSocket}
                disabled={wsStatus !== 'connected'}
                variant="destructive"
              >
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Permission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  hasPermission
                    ? 'bg-green-500'
                    : !isSupported
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
              />
              <span>
                Status:{' '}
                {!isSupported
                  ? 'Not Supported'
                  : hasPermission
                  ? 'Granted'
                  : 'Not Granted'}
              </span>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleRequestPermission}
                disabled={!isSupported || hasPermission}
                className="bg-green-600 hover:bg-green-700"
              >
                Request Permission
              </Button>
              
              <NotificationSettingsModal>
                <Button
                  disabled={!hasPermission}
                  variant="outline"
                >
                  Settings
                </Button>
              </NotificationSettingsModal>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button
              onClick={testGameScoreNotification}
              disabled={!hasPermission}
              variant="default"
            >
              Send Game Score
            </Button>
            <Button
              onClick={testNewsNotification}
              disabled={!hasPermission}
              variant="default"
            >
              Send News
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-md h-40 overflow-y-auto text-sm font-mono">
            {logs.length === 0 ? (
              <p className="text-gray-500">No activity yet...</p>
            ) : (
              logs.map((log, index) => <div key={index}>{log}</div>)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestNotificationsPage;