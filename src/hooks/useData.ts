import { useState, useEffect, useCallback } from 'react';
import { 
  loadFilmData, 
  loadDeveloperData, 
  getAvailableDilutions, 
  getAvailableISOs, 
  getCombinationInfo,
  loadTemperatureMultipliers,
  loadAgitationModes
} from '../utils/filmdev-utils';
import { Settings, FilmData, DeveloperData, CombinationInfo, AgitationModesData } from '../types';

export const useData = (settings: Settings) => {
  const [films, setFilms] = useState<FilmData>({});
  const [developers, setDevelopers] = useState<DeveloperData>({});
  const [agitationModes, setAgitationModes] = useState<AgitationModesData>({});
  const [availableDilutions, setAvailableDilutions] = useState<string[]>([]);
  const [availableISOs, setAvailableISOs] = useState<number[]>([]);
  const [availableTemperatures, setAvailableTemperatures] = useState<number[]>([]);
  const [combinationInfo, setCombinationInfo] = useState<CombinationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'external' | 'local' | 'fallback'>('external');

  const loadData = useCallback(async () => {
    try {
      console.log('Starting to load data...');
      setDataSource('external');
      
      const [filmsData, developersData, agitationModesData] = await Promise.all([
        loadFilmData(),
        loadDeveloperData(),
        loadAgitationModes()
      ]);
      
      console.log('Loaded films data:', Object.keys(filmsData).length, 'films');
      console.log('Loaded developers data:', Object.keys(developersData).length, 'developers');
      console.log('Loaded agitation modes:', Object.keys(agitationModesData).length, 'modes');
      
      setFilms(filmsData);
      setDevelopers(developersData);
      setAgitationModes(agitationModesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setDataSource('fallback');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAvailableOptions = useCallback(async () => {
    if (settings.film === 'custom' || settings.developer === 'custom') {
      setAvailableDilutions(['stock', '1+1', '1+3']);
      setAvailableTemperatures([18, 19, 20, 21, 22]);
      return;
    }

    try {
      const dilutions = await getAvailableDilutions(settings.film, settings.developer);
      setAvailableDilutions(dilutions.length > 0 ? dilutions : ['stock', '1+1', '1+3']);

      const temps = await loadTemperatureMultipliers();
      setAvailableTemperatures(Object.keys(temps).map(t => parseInt(t)).sort((a, b) => a - b));
    } catch (error) {
      console.error('Error updating available options:', error);
      setAvailableDilutions(['stock', '1+1', '1+3']);
      setAvailableTemperatures([18, 19, 20, 21, 22]);
    }
  }, [settings.film, settings.developer]);

  const updateCombinationInfo = useCallback(async () => {
    try {
      const info = await getCombinationInfo(
        settings.film,
        settings.developer,
        settings.dilution,
        settings.iso,
        settings.temperature
      );
      setCombinationInfo(info);
    } catch (error) {
      console.error('Error updating combination info:', error);
    }
  }, [settings.film, settings.developer, settings.dilution, settings.iso, settings.temperature]);

  const updateAvailableISOs = useCallback(async () => {
    if (settings.film !== 'custom' && settings.developer !== 'custom') {
      try {
        const isos = await getAvailableISOs(settings.film, settings.developer, settings.dilution);
        setAvailableISOs(isos.length > 0 ? isos : [100, 200, 400, 800]);
      } catch (error) {
        console.error('Error updating ISOs:', error);
        setAvailableISOs([100, 200, 400, 800]);
      }
    }
  }, [settings.film, settings.developer, settings.dilution]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    updateAvailableOptions();
  }, [updateAvailableOptions]);

  useEffect(() => {
    updateAvailableISOs();
  }, [updateAvailableISOs]);

  useEffect(() => {
    updateCombinationInfo();
  }, [updateCombinationInfo]);

  return {
    films,
    developers,
    availableDilutions,
    availableISOs,
    availableTemperatures,
    combinationInfo,
    loading,
    dataSource,
    agitationModes
  };
}; 