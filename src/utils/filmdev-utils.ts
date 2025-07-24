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
    // Попробуем разные пути для загрузки данных
    const paths = [
      `${process.env.PUBLIC_URL}/data/films.json`,
      '/data/films.json',
      './data/films.json'
    ];

    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          console.log('Successfully loaded films data from:', path);
          return data;
        }
      } catch (error) {
        console.warn(`Failed to load films from ${path}:`, error);
      }
    }

    throw new Error('Failed to load films data from all paths');
  } catch (error) {
    console.error('Error loading film data:', error);
    return {};
  }
}

export async function loadDeveloperData(): Promise<DeveloperData> {
  try {
    // Попробуем разные пути для загрузки данных
    const paths = [
      `${process.env.PUBLIC_URL}/data/developers.json`,
      '/data/developers.json',
      './data/developers.json'
    ];

    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          console.log('Successfully loaded developers data from:', path);
          return data;
        }
      } catch (error) {
        console.warn(`Failed to load developers from ${path}:`, error);
      }
    }

    throw new Error('Failed to load developers data from all paths');
  } catch (error) {
    console.error('Error loading developer data:', error);
    return {};
  }
}

export async function loadDevelopmentTimes(): Promise<DevelopmentTimeData> {
  try {
    // Попробуем разные пути для загрузки данных
    const paths = [
      `${process.env.PUBLIC_URL}/data/development-times.json`,
      '/data/development-times.json',
      './data/development-times.json'
    ];

    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          console.log('Successfully loaded development times data from:', path);
          return data;
        }
      } catch (error) {
        console.warn(`Failed to load development times from ${path}:`, error);
      }
    }

    throw new Error('Failed to load development times data from all paths');
  } catch (error) {
    console.error('Error loading development times data:', error);
    return {};
  }
}

export async function loadTemperatureMultipliers(): Promise<TemperatureMultipliers> {
  try {
    // Попробуем разные пути для загрузки данных
    const paths = [
      `${process.env.PUBLIC_URL}/data/temperature-multipliers.json`,
      '/data/temperature-multipliers.json',
      './data/temperature-multipliers.json'
    ];

    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          console.log('Successfully loaded temperature multipliers data from:', path);
          return data;
        }
      } catch (error) {
        console.warn(`Failed to load temperature multipliers from ${path}:`, error);
      }
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
  } catch (error) {
    console.error('Error loading temperature multipliers data:', error);
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