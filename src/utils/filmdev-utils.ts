// Константы
const EXTERNAL_DATA_BASE_URL = 'https://raw.githubusercontent.com/maximeliseyev/filmdevelopmentdata/main';
const FETCH_TIMEOUT = 10000; // 10 секунд таймаут

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
    const response = await fetchWithTimeout(`${EXTERNAL_DATA_BASE_URL}/films.json`);
    if (response.ok) {
      const data = await response.json();
      console.log('Successfully loaded films data from external repository');
      return data;
    } else {
      throw new Error(`Failed to load films data: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error loading film data from external repository:', error);
    // Fallback к локальным данным
    try {
      const fallbackResponse = await fetch(`${process.env.PUBLIC_URL}/data/films.json`);
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        console.log('Using fallback films data from local files');
        return data;
      }
    } catch (fallbackError) {
      console.error('Fallback loading also failed:', fallbackError);
    }
    return {};
  }
}

export async function loadDeveloperData(): Promise<DeveloperData> {
  try {
    // Загружаем данные из внешнего репозитория
    const response = await fetchWithTimeout(`${EXTERNAL_DATA_BASE_URL}/developers.json`);
    if (response.ok) {
      const data = await response.json();
      console.log('Successfully loaded developers data from external repository');
      return data;
    } else {
      throw new Error(`Failed to load developers data: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error loading developer data from external repository:', error);
    // Fallback к локальным данным
    try {
      const fallbackResponse = await fetch(`${process.env.PUBLIC_URL}/data/developers.json`);
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        console.log('Using fallback developers data from local files');
        return data;
      }
    } catch (fallbackError) {
      console.error('Fallback loading also failed:', fallbackError);
    }
    return {};
  }
}

export async function loadDevelopmentTimes(): Promise<DevelopmentTimeData> {
  try {
    // Загружаем данные из внешнего репозитория
    const response = await fetchWithTimeout(`${EXTERNAL_DATA_BASE_URL}/development-times.json`);
    if (response.ok) {
      const data = await response.json();
      console.log('Successfully loaded development times data from external repository');
      return data;
    } else {
      throw new Error(`Failed to load development times data: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error loading development times data from external repository:', error);
    // Fallback к локальным данным
    try {
      const fallbackResponse = await fetch(`${process.env.PUBLIC_URL}/data/development-times.json`);
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        console.log('Using fallback development times data from local files');
        return data;
      }
    } catch (fallbackError) {
      console.error('Fallback loading also failed:', fallbackError);
    }
    return {};
  }
}

export async function loadTemperatureMultipliers(): Promise<TemperatureMultipliers> {
  try {
    // Загружаем данные из внешнего репозитория
    const response = await fetchWithTimeout(`${EXTERNAL_DATA_BASE_URL}/temperature-multipliers.json`);
    if (response.ok) {
      const data = await response.json();
      console.log('Successfully loaded temperature multipliers data from external repository');
      return data;
    } else {
      throw new Error(`Failed to load temperature multipliers data: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error loading temperature multipliers data from external repository:', error);
    // Fallback к локальным данным
    try {
      const fallbackResponse = await fetch(`${process.env.PUBLIC_URL}/data/temperature-multipliers.json`);
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        console.log('Using fallback temperature multipliers data from local files');
        return data;
      }
    } catch (fallbackError) {
      console.error('Fallback loading also failed:', fallbackError);
    }
    
    // Fallback к дефолтным значениям
    console.warn('Using fallback temperature multipliers');
    return {
      '18': 1.25,
      '19': 1.12,
      '20': 1.0,
      '21': 0.89,
      '22': 0.79
    };
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
    console.error('Error getting base time:', error);
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
    console.error('Error getting available dilutions:', error);
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
    console.error('Error getting available ISOs:', error);
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
    console.error('Error getting combination info:', error);
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
  
  if (secs < 8) secs = 0;
  else if (secs < 23) secs = 15;
  else if (secs < 38) secs = 30;
  else if (secs < 53) secs = 45;
  else {
    secs = 0;
    mins += 1;
  }
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
} 