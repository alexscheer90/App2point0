import React, { useState, useEffect } from 'react';
import { Bell, BellRing, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import NotificationSettingsModal from './NotificationSettingsModal';
import { useNotifications } from '../hooks/useNotifications';
import { MAC_GREEN } from '../lib/constants';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  icon?: string;
  read: boolean;
  timestamp: Date;
  url?: string;
  type: 'game' | 'news' | 'other';
}

interface NotificationBellProps {
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const { isSupported, hasPermission, requestPermission } = useNotifications();
  const [showSettings, setShowSettings] = useState(false);

  // Request permission when the bell is clicked if not already granted
  const handleBellClick = async () => {
    if (isSupported && !hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        console.log('Notification permission denied');
      }
    } else {
      setShowSettings(true);
    }
  };

  return (
    <div className={className}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative"
              onClick={handleBellClick}
            >
              {!isSupported ? (
                <BellOff className="h-5 w-5 text-gray-500" />
              ) : !hasPermission ? (
                <Bell className="h-5 w-5 text-gray-500" />
              ) : (
                <BellRing className="h-5 w-5" style={{ color: MAC_GREEN }} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {!isSupported
              ? 'Notifications not supported'
              : !hasPermission
              ? 'Enable notifications'
              : 'Notification settings'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Settings modal */}
      <NotificationSettingsModal />
    </div>
  );
};

export default NotificationBell;