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
  type?: 'basic' | 'step';
}

export interface ActiveTimer {
  timeInSeconds: number;
  title: string;
}

export const APP_CONFIG = {
  defaultSettings: DEFAULT_SETTINGS
}; 

export interface FilmData {
  [key: string]: {
    name: string;
    manufacturer: string;
    description?: string;
    defaultISO?: number;
  };
}

export interface DeveloperData {
  [key: string]: {
    name: string;
    manufacturer: string;
    description?: string;
  };
}

export interface DevelopmentTimeData {
  [key: string]: {
    [developerKey: string]: {
      [dilution: string]: {
        [iso: string]: number;
      };
    };
  };
}

export interface TemperatureMultipliers {
  [temperature: string]: number;
}

export interface CombinationInfo {
  film?: { name: string; manufacturer: string };
  developer?: { name: string; manufacturer: string };
  dilution: string;
  iso: number;
  temperature: number;
  calculatedTime?: number;
  formattedTime?: string;
  hasData: boolean;
}

export type AgitationAction = 'continuous' | 'still' | 'cycle' | 'periodic' | 'rotations';
export type ConditionType = 'exact_minutes' | 'minute_range' | 'first_minute' | 'last_minute' | 'every_n_minutes' | 'after_minute' | 'default';

export interface AgitationCondition {
  type: ConditionType;
  values: number[];
}

export interface AgitationRuleParameters {
  agitation_seconds?: number;
  rest_seconds?: number;
  rotations?: number;
  interval_seconds?: number;
}

export interface AgitationRule {
  id: string;
  priority: number;
  condition: AgitationCondition;
  action: AgitationAction;
  parameters: AgitationRuleParameters;
}

export interface AgitationMode {
  name: string;
  localizedNameKey: string;
  description: string;
  isBuiltIn: boolean;
  rules: AgitationRule[];
}

export interface AgitationModesData {
  [key: string]: AgitationMode;
}