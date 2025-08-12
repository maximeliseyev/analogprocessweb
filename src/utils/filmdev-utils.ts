import { 
  EXTERNAL_DATA_CONFIG, 
  FALLBACK_TEMPERATURE_MULTIPLIERS, 
  TIME_ROUNDING,
  LOG_MESSAGES,
  ERROR_LOG_MESSAGES
} from '../constants';

// Константы
const EXTERNAL_DATA_BASE_URL = EXTERNAL_DATA_CONFIG.BASE_URL;
const FETCH_TIMEOUT = EXTERNAL_DATA_CONFIG.FETCH_TIMEOUT;

// Функция для выполнения fetch с таймаутом
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Типы для данных
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

// Загрузка данных
export async function loadFilmData(): Promise<FilmData> {
  try {
    // Загружаем данные из внешнего репозитория
    const response = await fetchWithTimeout(`${EXTERNAL_DATA_BASE_URL}${EXTERNAL_DATA_CONFIG.ENDPOINTS.FILMS}`);
    if (response.ok) {
      const data = await response.json();
      console.log(LOG_MESSAGES.EXTERNAL_DATA_LOADED);
      return data;
    } else {
      throw new Error(`Failed to load films data: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(ERROR_LOG_MESSAGES.EXTERNAL_DATA_FAILED, error);
    // Fallback к локальным данным
    try {
      const fallbackResponse = await fetch(`${process.env.PUBLIC_URL}/data/films.json`);
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        console.log(LOG_MESSAGES.FALLBACK_DATA_USED);
        return data;
      }
    } catch (fallbackError) {
      console.error(ERROR_LOG_MESSAGES.FALLBACK_DATA_FAILED, fallbackError);
    }
    return {};
  }
}

export async function loadDeveloperData(): Promise<DeveloperData> {
  try {
    // Загружаем данные из внешнего репозитория
    const response = await fetchWithTimeout(`${EXTERNAL_DATA_BASE_URL}${EXTERNAL_DATA_CONFIG.ENDPOINTS.DEVELOPERS}`);
    if (response.ok) {
      const data = await response.json();
      console.log(LOG_MESSAGES.EXTERNAL_DATA_LOADED);
      return data;
    } else {
      throw new Error(`Failed to load developers data: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(ERROR_LOG_MESSAGES.EXTERNAL_DATA_FAILED, error);
    // Fallback к локальным данным
    try {
      const fallbackResponse = await fetch(`${process.env.PUBLIC_URL}/data/developers.json`);
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        console.log(LOG_MESSAGES.FALLBACK_DATA_USED);
        return data;
      }
    } catch (fallbackError) {
      console.error(ERROR_LOG_MESSAGES.FALLBACK_DATA_FAILED, fallbackError);
    }
    return {};
  }
}

export async function loadDevelopmentTimes(): Promise<DevelopmentTimeData> {
  try {
    // Загружаем данные из внешнего репозитория
    const response = await fetchWithTimeout(`${EXTERNAL_DATA_BASE_URL}${EXTERNAL_DATA_CONFIG.ENDPOINTS.DEVELOPMENT_TIMES}`);
    if (response.ok) {
      const data = await response.json();
      console.log(LOG_MESSAGES.EXTERNAL_DATA_LOADED);
      return data;
    } else {
      throw new Error(`Failed to load development times data: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(ERROR_LOG_MESSAGES.EXTERNAL_DATA_FAILED, error);
    // Fallback к локальным данным
    try {
      const fallbackResponse = await fetch(`${process.env.PUBLIC_URL}/data/development-times.json`);
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        console.log(LOG_MESSAGES.FALLBACK_DATA_USED);
        return data;
      }
    } catch (fallbackError) {
      console.error(ERROR_LOG_MESSAGES.FALLBACK_DATA_FAILED, fallbackError);
    }
    return {};
  }
}

export async function loadTemperatureMultipliers(): Promise<TemperatureMultipliers> {
  try {
    // Загружаем данные из внешнего репозитория
    const response = await fetchWithTimeout(`${EXTERNAL_DATA_BASE_URL}${EXTERNAL_DATA_CONFIG.ENDPOINTS.TEMPERATURE_MULTIPLIERS}`);
    if (response.ok) {
      const data = await response.json();
      console.log(LOG_MESSAGES.EXTERNAL_DATA_LOADED);
      return data;
    } else {
      throw new Error(`Failed to load temperature multipliers data: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(ERROR_LOG_MESSAGES.EXTERNAL_DATA_FAILED, error);
    // Fallback к локальным данным
    try {
      const fallbackResponse = await fetch(`${process.env.PUBLIC_URL}/data/temperature-multipliers.json`);
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        console.log(LOG_MESSAGES.FALLBACK_DATA_USED);
        return data;
      }
    } catch (fallbackError) {
      console.error(ERROR_LOG_MESSAGES.FALLBACK_DATA_FAILED, fallbackError);
    }
    
    // Fallback к дефолтным значениям
    console.warn('Using fallback temperature multipliers');
    return FALLBACK_TEMPERATURE_MULTIPLIERS;
  }
}

// Получение базового времени
export async function getBaseTime(
  filmKey: string,
  developerKey: string,
  dilution: string,
  iso: number
): Promise<number | null> {
  try {
    const times = await loadDevelopmentTimes();
    const filmTimes = times[filmKey];
    if (!filmTimes) return null;
    
    const developerTimes = filmTimes[developerKey];
    if (!developerTimes) return null;
    
    const dilutionTimes = developerTimes[dilution];
    if (!dilutionTimes) return null;
    
    const time = dilutionTimes[iso.toString()];
    return time || null;
  } catch (error) {
    console.error(ERROR_LOG_MESSAGES.BASE_TIME_ERROR, error);
    return null;
  }
}

// Получение доступных разведений
export async function getAvailableDilutions(
  filmKey: string,
  developerKey: string
): Promise<string[]> {
  try {
    const times = await loadDevelopmentTimes();
    const filmTimes = times[filmKey];
    if (!filmTimes) return [];
    
    const developerTimes = filmTimes[developerKey];
    if (!developerTimes) return [];
    
    return Object.keys(developerTimes);
  } catch (error) {
    console.error(ERROR_LOG_MESSAGES.DILUTIONS_ERROR, error);
    return [];
  }
}

// Получение доступных ISO
export async function getAvailableISOs(
  filmKey: string,
  developerKey: string,
  dilution: string
): Promise<number[]> {
  try {
    const times = await loadDevelopmentTimes();
    const filmTimes = times[filmKey];
    if (!filmTimes) return [];
    
    const developerTimes = filmTimes[developerKey];
    if (!developerTimes) return [];
    
    const dilutionTimes = developerTimes[dilution];
    if (!dilutionTimes) return [];
    
    return Object.keys(dilutionTimes).map(iso => parseInt(iso));
  } catch (error) {
    console.error(ERROR_LOG_MESSAGES.ISOS_ERROR, error);
    return [];
  }
}

// Получение информации о комбинации
export async function getCombinationInfo(
  filmKey: string,
  developerKey: string,
  dilution: string,
  iso: number,
  temperature: number
): Promise<CombinationInfo> {
  try {
    const [films, developers, times, temps] = await Promise.all([
      loadFilmData(),
      loadDeveloperData(),
      loadDevelopmentTimes(),
      loadTemperatureMultipliers()
    ]);
    
    const film = films[filmKey];
    const developer = developers[developerKey];
    const developerData = times[filmKey]?.[developerKey];
    const dilutionData = developerData?.[dilution];
    const baseTime = dilutionData ? dilutionData[iso.toString()] ?? null : null;
    const tempMultiplier = temps[temperature.toString()] || 1.0;
    const calculatedTime = baseTime !== null ? Math.round(baseTime * tempMultiplier) : undefined;
    const hasData = baseTime !== null;
    
    return {
      film: film ? { name: film.name, manufacturer: film.manufacturer } : undefined,
      developer: developer ? { name: developer.name, manufacturer: developer.manufacturer } : undefined,
      dilution,
      iso,
      temperature,
      calculatedTime,
      formattedTime: calculatedTime ? formatTime(calculatedTime) : undefined,
      hasData
    };
  } catch (error) {
    console.error(ERROR_LOG_MESSAGES.COMBINATION_INFO_ERROR, error);
    return {
      dilution,
      iso,
      temperature,
      hasData: false
    };
  }
}

// Форматирование времени
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Округление до четверти минуты
export function roundToQuarterMinute(seconds: number): string {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  
  if (secs < TIME_ROUNDING.QUARTER_MINUTE_THRESHOLDS.FIRST) secs = TIME_ROUNDING.QUARTER_MINUTE_VALUES.FIRST;
  else if (secs < TIME_ROUNDING.QUARTER_MINUTE_THRESHOLDS.SECOND) secs = TIME_ROUNDING.QUARTER_MINUTE_VALUES.SECOND;
  else if (secs < TIME_ROUNDING.QUARTER_MINUTE_THRESHOLDS.THIRD) secs = TIME_ROUNDING.QUARTER_MINUTE_VALUES.THIRD;
  else if (secs < TIME_ROUNDING.QUARTER_MINUTE_THRESHOLDS.FOURTH) secs = TIME_ROUNDING.QUARTER_MINUTE_VALUES.FOURTH;
  else {
    secs = TIME_ROUNDING.QUARTER_MINUTE_VALUES.FIRST;
    mins += 1;
  }
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
} 