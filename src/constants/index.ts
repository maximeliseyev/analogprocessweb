// App Configuration
export const APP_CONFIG = {
  VERSION: '2.0.0',
  NAME: 'Analog Process Lab',
  STORAGE_KEYS: {
    SETTINGS: 'filmDevSettings',
    LANGUAGE: 'filmDevLanguage'
  }
} as const;

// External Data Configuration
export const EXTERNAL_DATA_CONFIG = {
  BASE_URL: 'https://raw.githubusercontent.com/maximeliseyev/filmdevelopmentdata/main',
  FETCH_TIMEOUT: 10000, // 10 seconds
  ENDPOINTS: {
    FILMS: '/films.json',
    DEVELOPERS: '/developers.json',
    DEVELOPMENT_TIMES: '/development-times.json',
    TEMPERATURE_MULTIPLIERS: '/temperature-multipliers.json'
  }
} as const;

// Timer Configuration
export const TIMER_CONFIG = {
  UPDATE_INTERVAL: 100, // milliseconds
  CIRCLE_CIRCUMFERENCE: 283, // 2 * π * 45
  CIRCLE_RADIUS: 45,
  ANIMATION_DURATION: 100, // milliseconds for transitions
  PROGRESS_BAR_HEIGHT: 12, // pixels
} as const;

// Form Validation Limits
export const FORM_LIMITS = {
  BASE_TIME: {
    MINUTES: { MIN: 0, MAX: 59, DEFAULT: 7 },
    SECONDS: { MIN: 0, MAX: 59, DEFAULT: 0 }
  },
  COEFFICIENT: { MIN: 0.1, MAX: 10, DEFAULT: 1.33, STEP: 0.01 },
  STEPS: { MIN: 1, MAX: 5, DEFAULT: 3 },
  ISO: { MIN: 25, MAX: 12500 },
  TEMPERATURE: { MIN: 14, MAX: 25, DEFAULT: 20 }
} as const;

// Process Types
export const PROCESS_TYPES = {
  PUSH: 'push',
  PULL: 'pull'
} as const;

// Custom Values
export const CUSTOM_VALUES = {
  FILM: 'custom',
  DEVELOPER: 'custom'
} as const;

// Default Settings
export const DEFAULT_SETTINGS = {
  baseMinutes: FORM_LIMITS.BASE_TIME.MINUTES.DEFAULT,
  baseSeconds: FORM_LIMITS.BASE_TIME.SECONDS.DEFAULT,
  coefficient: FORM_LIMITS.COEFFICIENT.DEFAULT,
  process: PROCESS_TYPES.PUSH,
  steps: FORM_LIMITS.STEPS.DEFAULT,
  film: 'ilford-hp5-plus',
  developer: 'kodak-d76',
  dilution: 'stock',
  iso: 400,
  temperature: FORM_LIMITS.TEMPERATURE.DEFAULT
} as const;

// Fallback Temperature Multipliers
export const FALLBACK_TEMPERATURE_MULTIPLIERS = {
  '18': 1.25,
  '19': 1.12,
  '20': 1.0,
  '21': 0.89,
  '22': 0.79
} as const;

// Time Rounding Configuration
export const TIME_ROUNDING = {
  QUARTER_MINUTE_THRESHOLDS: {
    FIRST: 8,   // 0-7 seconds -> 0
    SECOND: 23, // 8-22 seconds -> 15
    THIRD: 38,  // 23-37 seconds -> 30
    FOURTH: 53  // 38-52 seconds -> 45
  },
  QUARTER_MINUTE_VALUES: {
    FIRST: 0,
    SECOND: 15,
    THIRD: 30,
    FOURTH: 45
  }
} as const;

// UI Configuration
export const UI_CONFIG = {
  COLORS: {
    PRIMARY: 'blue-500',
    SECONDARY: 'blue-600',
    SUCCESS: 'green-500',
    WARNING: 'yellow-500',
    ERROR: 'red-500',
    NEUTRAL: 'gray-500',
    WHITE: 'white',
    BLACK: 'black'
  },
  SPACING: {
    SMALL: '2',
    MEDIUM: '4',
    LARGE: '6',
    XLARGE: '8'
  },
  BORDER_RADIUS: {
    SMALL: 'xl',
    MEDIUM: '2xl',
    LARGE: '3xl'
  },
  SHADOWS: {
    SMALL: 'shadow-lg',
    MEDIUM: 'shadow-xl',
    LARGE: 'shadow-2xl'
  },
  BACKDROP_BLUR: 'backdrop-blur-sm',
  TRANSITIONS: {
    FAST: 'transition-all duration-100',
    MEDIUM: 'transition-all duration-200',
    SLOW: 'transition-all duration-300'
  }
} as const;

// Animation Configuration
export const ANIMATION_CONFIG = {
  PULSE_SLOW: 'animate-pulse-slow',
  FADE_IN: 'animate-fade-in',
  FADE_OUT: 'animate-fade-out',
  SLIDE_UP: 'animate-slide-up',
  SLIDE_DOWN: 'animate-slide-down'
} as const;

// Localization Configuration
export const LOCALIZATION_CONFIG = {
  SUPPORTED_LANGUAGES: ['en', 'ru'] as const,
  DEFAULT_LANGUAGE: 'en' as const,
  FALLBACK_LANGUAGE: 'en' as const
} as const;

// Data Source Types
export const DATA_SOURCE_TYPES = {
  EXTERNAL: 'external',
  LOCAL: 'local',
  FALLBACK: 'fallback'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_TIMEOUT: 'Request timeout',
  NETWORK_ERROR: 'Network error',
  PARSE_ERROR: 'Data parsing error',
  STORAGE_ERROR: 'Storage error',
  VALIDATION_ERROR: 'Validation error'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SETTINGS_SAVED: 'Settings saved successfully',
  TIMER_COMPLETED: 'Timer completed!',
  DATA_LOADED: 'Data loaded successfully'
} as const;

// Console Log Messages
export const LOG_MESSAGES = {
  APP_VERSION_SET: 'App version set to:',
  EXTERNAL_DATA_LOADED: 'Successfully loaded data from external repository',
  FALLBACK_DATA_USED: 'Using fallback data from local files',
  TIMER_COMPLETED: 'Timer completed!',
  SETTINGS_LOADED: 'Settings loaded from storage',
  SETTINGS_SAVED: 'Settings saved to storage'
} as const;

// Error Log Messages
export const ERROR_LOG_MESSAGES = {
  VERSION_LOAD_FAILED: 'Failed to load app version:',
  EXTERNAL_DATA_FAILED: 'Error loading data from external repository:',
  FALLBACK_DATA_FAILED: 'Fallback loading also failed:',
  SETTINGS_LOAD_FAILED: 'Error loading settings:',
  SETTINGS_SAVE_FAILED: 'Error saving settings:',
  BASE_TIME_ERROR: 'Error getting base time:',
  DILUTIONS_ERROR: 'Error getting available dilutions:',
  ISOS_ERROR: 'Error getting available ISOs:',
  COMBINATION_INFO_ERROR: 'Error getting combination info:',
  AGITATION_MODES_LOAD_FAILED: 'Failed to load agitation modes:'
} as const;


