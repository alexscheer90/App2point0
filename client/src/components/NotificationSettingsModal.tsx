import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNotifications } from '../hooks/useNotifications';
import { MAC_GREEN } from '../lib/constants';

interface NotificationSettingsModalProps {
  children?: React.ReactNode;
}

const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ children }) => {
  const {
    isSupported,
    hasPermission,
    preferences,
    updatePreferences,
    isNotificationEnabled,
    resetPreferences,
  } = useNotifications();

  const togglePreference = (key: keyof typeof preferences) => {
    updatePreferences({
      [key]: !preferences[key],
    });
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Dialog>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            Settings
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Customize which notifications you receive from Mobile #MACtion.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {!hasPermission ? (
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                You need to enable notifications in your browser settings to
                receive alerts.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="game-scores" className="flex flex-col space-y-1">
                  <span>Game Scores</span>
                  <span className="font-normal text-xs text-gray-500">
                    When games end or scores change
                  </span>
                </Label>
                <Switch
                  id="game-scores"
                  checked={isNotificationEnabled('gameScores')}
                  onCheckedChange={() => togglePreference('gameScores')}
                  style={{ 
                    backgroundColor: isNotificationEnabled('gameScores') ? MAC_GREEN : undefined 
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="game-alerts" className="flex flex-col space-y-1">
                  <span>Game Alerts</span>
                  <span className="font-normal text-xs text-gray-500">
                    When games start, end, or change periods
                  </span>
                </Label>
                <Switch
                  id="game-alerts"
                  checked={isNotificationEnabled('gameAlerts')}
                  onCheckedChange={() => togglePreference('gameAlerts')}
                  style={{ 
                    backgroundColor: isNotificationEnabled('gameAlerts') ? MAC_GREEN : undefined 
                  }}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="favorite-school" className="flex flex-col space-y-1">
                  <span>Favorite School</span>
                  <span className="font-normal text-xs text-gray-500">
                    News and updates about your favorite school
                  </span>
                </Label>
                <Switch
                  id="favorite-school"
                  checked={isNotificationEnabled('favoriteSchoolNews')}
                  onCheckedChange={() => togglePreference('favoriteSchoolNews')}
                  style={{ 
                    backgroundColor: isNotificationEnabled('favoriteSchoolNews') ? MAC_GREEN : undefined 
                  }}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="breaking-news" className="flex flex-col space-y-1">
                  <span>Breaking News</span>
                  <span className="font-normal text-xs text-gray-500">
                    Major MAC conference news and updates
                  </span>
                </Label>
                <Switch
                  id="breaking-news"
                  checked={isNotificationEnabled('breakingNews')}
                  onCheckedChange={() => togglePreference('breakingNews')}
                  style={{ 
                    backgroundColor: isNotificationEnabled('breakingNews') ? MAC_GREEN : undefined 
                  }}
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={resetPreferences}
            className="mr-2"
          >
            Reset to Default
          </Button>
          <DialogTrigger asChild>
            <Button>Done</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSettingsModal;