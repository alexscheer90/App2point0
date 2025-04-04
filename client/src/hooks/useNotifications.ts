import { useState, useEffect, useCallback } from 'react';
import { isNotificationSupported, requestNotificationPermission } from '../services/notificationService';

export interface NotificationPreferences {
  gameScores: boolean;
  gameAlerts: boolean;
  favoriteSchoolNews: boolean;
  breakingNews: boolean;
}

const defaultPreferences: NotificationPreferences = {
  gameScores: true,
  gameAlerts: true,
  favoriteSchoolNews: true,
  breakingNews: true,
};

const STORAGE_KEY = 'mac_notification_preferences';

export function useNotifications() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);

  // Check if notifications are supported and if permission is granted
  useEffect(() => {
    setIsSupported(isNotificationSupported());
    
    // Check current permission status
    if (isNotificationSupported()) {
      setHasPermission(Notification.permission === 'granted');
    }

    // Load saved preferences from localStorage
    const savedPrefs = localStorage.getItem(STORAGE_KEY);
    if (savedPrefs) {
      try {
        const parsedPrefs = JSON.parse(savedPrefs);
        setPreferences(parsedPrefs);
      } catch (e) {
        console.error('Failed to parse notification preferences:', e);
        // If parsing fails, reset to defaults
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Update preferences and save to localStorage
  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPreferences };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Reset preferences to defaults
  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPreferences));
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isNotificationSupported()) {
      return false;
    }

    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    return granted;
  }, []);

  // Check if a specific notification type is enabled
  const isNotificationEnabled = useCallback(
    (type: keyof NotificationPreferences): boolean => {
      return hasPermission && preferences[type];
    }, 
    [hasPermission, preferences]
  );

  return {
    isSupported,
    hasPermission,
    preferences,
    requestPermission,
    updatePreferences,
    isNotificationEnabled,
    resetPreferences,
  };
}