import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Timer from './components/Timer';
import { 
  loadFilmData, 
  loadDeveloperData, 
  getBaseTime, 
  getAvailableDilutions, 
  getAvailableISOs, 
  getCombinationInfo,
  loadTemperatureMultipliers,
  formatTime,
  roundToQuarterMinute,
  type FilmData,
  type DeveloperData,
  type CombinationInfo
} from './utils/filmdev-utils';
import { useLocalization } from './hooks/useLocalization';

// Типы для TypeScript
interface Settings {
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

interface TimeResult {
  label: string;
  time: number;
}

interface ActiveTimer {
  timeInSeconds: number;
  title: string;
}

const APP_CONFIG = {
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

function App() {
  const { t, currentLanguage, setLanguage } = useLocalization();
  const [settings, setSettings] = useState<Settings>(APP_CONFIG.defaultSettings);
  const [results, setResults] = useState<TimeResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [films, setFilms] = useState<FilmData>({});
  const [developers, setDevelopers] = useState<DeveloperData>({});
  const [availableDilutions, setAvailableDilutions] = useState<string[]>([]);
  const [availableISOs, setAvailableISOs] = useState<number[]>([]);
  const [availableTemperatures, setAvailableTemperatures] = useState<number[]>([]);
  const [combinationInfo, setCombinationInfo] = useState<CombinationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);

  // Загрузка данных при инициализации
  useEffect(() => {
    loadData();
    loadSettings();
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

      // Загружаем доступные температуры
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

  // Обновление доступных опций при изменении плёнки или проявителя
  useEffect(() => {
    updateAvailableOptions();
  }, [updateAvailableOptions]);

  // Обновление доступных ISO при изменении разведения
  useEffect(() => {
    if (settings.film !== 'custom' && settings.developer !== 'custom') {
      getAvailableISOs(settings.film, settings.developer, settings.dilution)
        .then(isos => {
          setAvailableISOs(isos.length > 0 ? isos : [100, 200, 400, 800]);
        })
        .catch(error => {
          console.error('Error updating ISOs:', error);
          setAvailableISOs([100, 200, 400, 800]);
        });
    }
  }, [settings.film, settings.developer, settings.dilution]);

  // Обновление информации о комбинации
  useEffect(() => {
    updateCombinationInfo();
  }, [updateCombinationInfo]);



  const loadData = async () => {
    try {
      // Загружаем данные плёнок и проявителей
      const [filmsData, developersData] = await Promise.all([
        loadFilmData(),
        loadDeveloperData()
      ]);
      
      setFilms(filmsData);
      setDevelopers(developersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('filmDevSettings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    try {
      localStorage.setItem('filmDevSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Обновление полей ввода базового времени при изменении комбинации
  useEffect(() => {
    if (combinationInfo && combinationInfo.hasData && combinationInfo.calculatedTime) {
      const minutes = Math.floor(combinationInfo.calculatedTime / 60);
      const seconds = Math.round(combinationInfo.calculatedTime % 60);
      
      // Обновляем поля только если они отличаются от текущих
      if (minutes !== settings.baseMinutes || seconds !== settings.baseSeconds) {
        saveSettings({ baseMinutes: minutes, baseSeconds: seconds });
      }
    }
  }, [combinationInfo, settings.baseMinutes, settings.baseSeconds, saveSettings]);

  const calculateTimes = async () => {
    let baseTimeInSeconds: number;

    // Если выбрана пользовательская плёнка, используем ручные настройки
    if (settings.film === 'custom') {
      baseTimeInSeconds = settings.baseMinutes * 60 + settings.baseSeconds;
    } else {
      // Используем данные из базы
      const baseTime = await getBaseTime(
        settings.film,
        settings.developer,
        settings.dilution,
        settings.iso
      );
      
      if (baseTime !== null) {
        const temps = await loadTemperatureMultipliers();
        const tempMultiplier = temps[settings.temperature.toString()] || 1.0;
        baseTimeInSeconds = baseTime * tempMultiplier;
      } else {
        // Если данных нет, используем ручные настройки
        baseTimeInSeconds = settings.baseMinutes * 60 + settings.baseSeconds;
      }
    }

    const times: TimeResult[] = [
      { label: "Basic time", time: baseTimeInSeconds }
    ];
    
    for (let i = 1; i <= settings.steps; i++) {
      let time;
      if (settings.process === 'push') {
        time = baseTimeInSeconds * Math.pow(settings.coefficient, i);
      } else {
        time = baseTimeInSeconds / Math.pow(settings.coefficient, i);
      }
      times.push({ 
        label: settings.process === 'pull' ? `-${i} steps` : `+${i} steps`, 
        time 
      });
    }
    
    setResults(times);
    setShowResults(true);
  };

  const formatTimeDisplay = (seconds: number): string => {
    return roundToQuarterMinute(seconds);
  };

  const startTimer = (timeInSeconds: number, title: string) => {
    setActiveTimer({ timeInSeconds, title });
  };

  const closeTimer = () => {
    setActiveTimer(null);
  };

  const handleTimerComplete = () => {
    // Можно добавить уведомления или другие действия при завершении таймера
    console.log('Timer completed!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4">
      <div className="max-w-md mx-auto bg-black/20 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/10">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-white font-medium text-sm px-3 py-2 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 backdrop-blur-sm">
              ⚙️
            </button>
            <button 
              onClick={() => setLanguage(currentLanguage === 'en' ? 'ru' : 'en')}
              className="text-blue-400 hover:text-blue-300 font-medium text-sm px-3 py-2 rounded-xl border border-blue-400/30 hover:border-blue-400/50 transition-all duration-200 backdrop-blur-sm"
            >
              {currentLanguage === 'en' ? 'RU' : 'EN'}
            </button>
          </div>
        </div>

        {/* Film setup section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t('film')}</label>
          <select 
            value={settings.film}
            onChange={(e) => saveSettings({ film: e.target.value })}
            className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white text-base focus:border-blue-400/50 focus:outline-none transition-all duration-200 hover:bg-white/8"
          >
            {Object.entries(films).map(([key, film]) => (
              <option key={key} value={key}>{film.name}</option>
            ))}
            <option value="custom">{t('manualInput')}</option>
          </select>
        </div>

        {/* Developer */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t('developer')}</label>
          <select 
            value={settings.developer}
            onChange={(e) => saveSettings({ developer: e.target.value })}
            className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white text-base focus:border-blue-400/50 focus:outline-none transition-all duration-200 hover:bg-white/8"
          >
            {Object.entries(developers).map(([key, developer]) => (
              <option key={key} value={key}>{developer.name}</option>
            ))}
            <option value="custom">{t('custom')}</option>
          </select>
        </div>

        {/* Dilution */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t('dilution')}</label>
          <select 
            value={settings.dilution}
            onChange={(e) => saveSettings({ dilution: e.target.value })}
            className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white text-base focus:border-blue-400/50 focus:outline-none transition-all duration-200 hover:bg-white/8"
          >
            {availableDilutions.map(dilution => (
              <option key={dilution} value={dilution}>
                {dilution === 'stock' ? t('stock') : t(`dilution${dilution}`) || dilution}
              </option>
            ))}
          </select>
        </div>

        {/* ISO */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t('iso')}</label>
          <select 
            value={settings.iso}
            onChange={(e) => saveSettings({ iso: parseInt(e.target.value) })}
            className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white text-base focus:border-blue-400/50 focus:outline-none transition-all duration-200 hover:bg-white/8"
          >
            {availableISOs.map(iso => (
              <option key={iso} value={iso}>{t(`iso${iso}`) || iso}</option>
            ))}
          </select>
        </div>

        {/* Temperature */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t('temperature')}</label>
          <select 
            value={settings.temperature}
            onChange={(e) => saveSettings({ temperature: parseInt(e.target.value) })}
            className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white text-base focus:border-blue-400/50 focus:outline-none transition-all duration-200 hover:bg-white/8"
          >
            {availableTemperatures.map(temp => (
              <option key={temp} value={temp}>{t(`temp${temp}`) || `${temp}°C`}</option>
            ))}
          </select>
        </div>

        {/* Base time */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t('baseTime')}</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              min="0" 
              max="59" 
              value={settings.baseMinutes}
              onChange={(e) => saveSettings({ baseMinutes: parseInt(e.target.value) || 0 })}
              className="w-20 px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white text-lg text-center focus:border-blue-400/50 focus:outline-none transition-all duration-200 hover:bg-white/8"
            />
            <span className="text-gray-400 text-base">{t('min')}</span>
            <input 
              type="number" 
              min="0" 
              max="59" 
              value={settings.baseSeconds}
              onChange={(e) => saveSettings({ baseSeconds: parseInt(e.target.value) || 0 })}
              className="w-20 px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white text-lg text-center focus:border-blue-400/50 focus:outline-none transition-all duration-200 hover:bg-white/8"
            />
            <span className="text-gray-400 text-base">{t('sec')}</span>
          </div>
                      {combinationInfo && (
              <div className="text-xs text-gray-500 mt-1">
                {settings.film === 'custom' 
                  ? t('manualInput')
                  : combinationInfo.hasData 
                    ? `${t('fromDatabase')} ${combinationInfo.film?.name} + ${combinationInfo.developer?.name}`
                    : t('defaultTime')
                }
              </div>
            )}
        </div>

        {/* Coefficient */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t('ratio')}</label>
          <input 
            type="number" 
            min="0.1" 
            step="0.01" 
            value={settings.coefficient}
            onChange={(e) => saveSettings({ coefficient: parseFloat(e.target.value) || 1.33 })}
            className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white text-lg text-center focus:border-blue-400/50 focus:outline-none transition-all duration-200 hover:bg-white/8"
          />
        </div>

        {/* Process */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t('process')}</label>
          <div className="flex bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
            <button 
              onClick={() => saveSettings({ process: 'push' })}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                settings.process === 'push' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
                          >
                {t('push')}
              </button>
              <button 
                onClick={() => saveSettings({ process: 'pull' })}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  settings.process === 'pull' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t('pull')}
              </button>
          </div>
        </div>

        {/* Steps */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t('steps')}</label>
          <input 
            type="number" 
            min="1" 
            max="5" 
            value={settings.steps}
            onChange={(e) => saveSettings({ steps: parseInt(e.target.value) || 3 })}
            className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white text-lg text-center focus:border-blue-400/50 focus:outline-none transition-all duration-200 hover:bg-white/8"
          />
        </div>

        {/* Information Panel */}
        {combinationInfo ? (
          <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-3 font-medium">{t('current')}</div>
                          <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('film')}</span>
                  <span className="text-white font-medium">{combinationInfo.film?.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('developer')}</span>
                  <span className="text-white font-medium">{combinationInfo.developer?.name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('dilution')}</span>
                  <span className="text-white font-medium">{combinationInfo.dilution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('iso')}</span>
                  <span className="text-white font-medium">{combinationInfo.iso}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('temperature')}</span>
                  <span className="text-white font-medium">{combinationInfo.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('process')}</span>
                  <span className="text-white font-medium">{settings.process === 'push' ? t('push') : t('pull')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('basicTime')}</span>
                  <span className="text-white font-medium">
                    {combinationInfo.hasData && combinationInfo.formattedTime 
                      ? combinationInfo.formattedTime 
                      : formatTime(settings.baseMinutes * 60 + settings.baseSeconds)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('data')}</span>
                  <span className={`font-medium ${combinationInfo.hasData ? 'text-white' : 'text-red-400'}`}>
                    {combinationInfo.hasData ? t('available') : t('noData')}
                  </span>
                </div>
              </div>
          </div>
        ) : (
          <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-3 font-medium">{t('current')}</div>
            <div className="text-sm text-gray-300">Loading...</div>
          </div>
        )}

        {/* Calculate button */}
        <button 
          onClick={calculateTimes}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 active:scale-95 rounded-2xl text-white text-lg font-semibold transition-all duration-200 mb-6 shadow-lg shadow-blue-500/25"
        >
          {t('calculate')}
        </button>

        {/* Results */}
        {showResults && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-gray-400 text-sm mb-2 font-medium">{result.label}</div>
                  <div className="text-2xl font-bold text-white">{formatTimeDisplay(result.time)}</div>
                </div>
                <button 
                  onClick={() => startTimer(result.time, result.label)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 active:scale-95 px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 transition-all duration-200 ml-4 shadow-lg shadow-blue-500/25"
                >
                  <span className="text-lg">⏱</span>
                  <span>{t('timer')}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timer Component */}
      {activeTimer && (
        <Timer
          timeInSeconds={activeTimer.timeInSeconds}
          title={activeTimer.title}
          onComplete={handleTimerComplete}
          onClose={closeTimer}
        />
      )}
    </div>
  );
}

export default App;
