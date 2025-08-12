import { useState, useCallback } from 'react';
import { Settings, APP_CONFIG } from '../types';
import { APP_CONFIG as CONSTANTS, ERROR_LOG_MESSAGES, LOG_MESSAGES } from '../constants';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(APP_CONFIG.defaultSettings);

  const loadSettings = useCallback(() => {
    try {
      const saved = localStorage.getItem(CONSTANTS.STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
        console.log(LOG_MESSAGES.SETTINGS_LOADED);
      }
    } catch (error) {
      console.error(ERROR_LOG_MESSAGES.SETTINGS_LOAD_FAILED, error);
    }
  }, []);

  const saveSettings = useCallback((newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    try {
      localStorage.setItem(CONSTANTS.STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
      console.log(LOG_MESSAGES.SETTINGS_SAVED);
    } catch (error) {
      console.error(ERROR_LOG_MESSAGES.SETTINGS_SAVE_FAILED, error);
    }
  }, [settings]);

  return {
    settings,
    setSettings,
    loadSettings,
    saveSettings
  };
}; 