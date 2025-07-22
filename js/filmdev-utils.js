// js/filmdev-utils.js

let DEVELOPMENT_TIMES = null;
let FILM_DATA = null;
let DEVELOPER_DATA = null;
let TEMPERATURE_MULTIPLIERS = null;

export async function loadDevelopmentTimes() {
  if (!DEVELOPMENT_TIMES) {
    const response = await fetch('data/development-times.json');
    DEVELOPMENT_TIMES = await response.json();
  }
  return DEVELOPMENT_TIMES;
}

export async function loadFilmData() {
  if (!FILM_DATA) {
    const response = await fetch('data/films.json');
    FILM_DATA = await response.json();
  }
  return FILM_DATA;
}

export async function loadDeveloperData() {
  if (!DEVELOPER_DATA) {
    const response = await fetch('data/developers.json');
    DEVELOPER_DATA = await response.json();
  }
  return DEVELOPER_DATA;
}

export async function loadTemperatureMultipliers() {
  if (!TEMPERATURE_MULTIPLIERS) {
    const response = await fetch('data/temperature-multipliers.json');
    TEMPERATURE_MULTIPLIERS = await response.json();
  }
  return TEMPERATURE_MULTIPLIERS;
}

/**
 * Получить базовое время для комбинации (асинхронно)
 * @param {string} filmKey
 * @param {string} developerKey
 * @param {string} dilution
 * @param {string|number} iso
 * @returns {Promise<number|null>}
 */
export async function getBaseTime(filmKey, developerKey, dilution, iso) {
  const data = await loadDevelopmentTimes();
  const filmData = data[filmKey];
  if (!filmData) return null;
  const developerData = filmData[developerKey];
  if (!developerData) return null;
  const dilutionData = developerData[dilution];
  if (!dilutionData) return null;
  return dilutionData[iso] ?? null;
}

export async function getAvailableDilutions(filmKey, developerKey) {
  const data = await loadDevelopmentTimes();
  const filmData = data[filmKey];
  if (!filmData) {
    console.log('getAvailableDilutions: film not found', filmKey);
    return [];
  }
  const developerData = filmData[developerKey];
  if (!developerData) {
    console.log('getAvailableDilutions: developer not found', developerKey);
    return [];
  }
  const dilutions = Object.keys(developerData);
  console.log('getAvailableDilutions:', filmKey, developerKey, '->', dilutions);
  return dilutions;
}

export async function getAvailableISOs(filmKey, developerKey, dilution) {
  const data = await loadDevelopmentTimes();
  const filmData = data[filmKey];
  if (!filmData) return [];
  const developerData = filmData[developerKey];
  if (!developerData) return [];
  const dilutionData = developerData[dilution];
  if (!dilutionData) return [];
  return Object.keys(dilutionData).map(iso => parseInt(iso)).sort((a, b) => a - b);
}

export async function getCombinationInfo(filmKey, developerKey, dilution, iso, temperature) {
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
  const baseTime = dilutionData ? dilutionData[iso] ?? null : null;
  const tempMultiplier = (typeof temperature === 'number' ? temps[String(temperature)] : 1.0) || 1.0;
  const calculatedTime = baseTime !== null ? Math.round(baseTime * tempMultiplier) : null;
  return {
    film,
    developer,
    dilution,
    iso,
    temperature,
    baseTime,
    calculatedTime,
    tempMultiplier,
    formattedTime: calculatedTime ? `${Math.floor(calculatedTime/60)}:${(calculatedTime%60).toString().padStart(2,'0')}` : 'Н/Д',
    hasData: baseTime !== null
  };
} 