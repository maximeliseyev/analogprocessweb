import { DEFAULT_SETTINGS } from '../constants';

export interface Settings {
  baseMinutes: number;
  baseSeconds: number;
  coefficient: number;
  process: 'push' | 'pull';
  steps: number;
  film: string;
  developer: string;
  dilution: string;
  iso: number;
  temperature: number;
  agitationPreset?: string;
}

export interface TimeResult {
  label: string;
  time: number;
}

export interface ActiveTimer {
  timeInSeconds: number;
  title: string;
}

export const APP_CONFIG = {
  defaultSettings: DEFAULT_SETTINGS
}; 