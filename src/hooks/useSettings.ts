import { useState, useCallback } from 'react';
import { Settings, APP_CONFIG } from '../types';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(APP_CONFIG.defaultSettings);

  const loadSettings = useCallback(() => {
    try {
      const saved = localStorage.getItem('filmDevSettings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  const saveSettings = useCallback((newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    try {
      localStorage.setItem('filmDevSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings]);

  return {
    settings,
    setSettings,
    loadSettings,
    saveSettings
  };
}; 