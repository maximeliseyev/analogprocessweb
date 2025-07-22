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
  defaultSettings: {
    baseMinutes: 7,
    baseSeconds: 0,
    coefficient: 1.33,
    process: 'push' as const,
    steps: 3,
    film: 'ilford-hp5-plus',
    developer: 'kodak-d76',
    dilution: 'stock',
    iso: 400,
    temperature: 20
  }
}; 