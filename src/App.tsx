import React, { useState, useEffect } from 'react';
import './App.css';
import { Timer, SettingsForm, InfoPanel, ResultsPanel, DebugPanel } from './components';
import { Button, Card } from './components/ui';
import { useSettings, useData } from './hooks';
import { getAppVersion } from './utils/version';
import { getBaseTime, loadTemperatureMultipliers } from './utils/filmdev-utils';
import { TimeResult, ActiveTimer } from './types';
import { LocalizationProvider, useLocalization } from './hooks/useLocalization';

function App() {
  const { t, currentLanguage, setLanguage } = useLocalization();
  const { settings, saveSettings, loadSettings } = useSettings();
  const { 
    films, 
    developers, 
    availableDilutions, 
    availableISOs, 
    availableTemperatures, 
    combinationInfo, 
    loading 
  } = useData(settings);
  
  const [results, setResults] = useState<TimeResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [appVersion, setAppVersion] = useState<string>('2.0.0');

  useEffect(() => {
    loadSettings();
    getAppVersion().then(version => {
      console.log('App version set to:', version);
      setAppVersion(version);
    }).catch(error => {
      console.error('Failed to load app version:', error);
    });
  }, [loadSettings]);

  // Обновление полей ввода базового времени при изменении комбинации
  useEffect(() => {
    if (combinationInfo && combinationInfo.hasData && combinationInfo.calculatedTime) {
      const minutes = Math.floor(combinationInfo.calculatedTime / 60);
      const seconds = Math.round(combinationInfo.calculatedTime % 60);
      
      if (minutes !== settings.baseMinutes || seconds !== settings.baseSeconds) {
        saveSettings({ baseMinutes: minutes, baseSeconds: seconds });
      }
    }
  }, [combinationInfo, settings.baseMinutes, settings.baseSeconds, saveSettings]);

  const calculateTimes = async () => {
    let baseTimeInSeconds: number;

    if (settings.film === 'custom') {
      baseTimeInSeconds = settings.baseMinutes * 60 + settings.baseSeconds;
    } else {
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

  const startTimer = (timeInSeconds: number, title: string) => {
    setActiveTimer({ timeInSeconds, title });
  };

  const closeTimer = () => {
    setActiveTimer(null);
  };

  const handleTimerComplete = () => {
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

        {/* Settings Form */}
        <Card className="mb-6">
          <SettingsForm
            settings={settings}
            saveSettings={saveSettings}
            films={films}
            developers={developers}
            availableDilutions={availableDilutions}
            availableISOs={availableISOs}
            availableTemperatures={availableTemperatures}
          />
        </Card>

        {/* Information Panel */}
        <InfoPanel combinationInfo={combinationInfo} settings={settings} />

        {/* Calculate button */}
        <Button 
          onClick={calculateTimes}
          variant="primary"
          size="lg"
          className="w-full mb-6"
        >
          {t('calculate')}
        </Button>

        {/* Results */}
        <ResultsPanel 
          results={results}
          showResults={showResults}
          onStartTimer={startTimer}
        />
      </div>

      {/* Footer with version */}
      <div className="text-center mt-8 mb-4">
        <div className="text-xs text-gray-500">
          {t('title')} v{appVersion}
        </div>
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

      {/* Debug Panel */}
      <DebugPanel 
        films={films}
        developers={developers}
        loading={loading}
      />
    </div>
  );
}

export default function AppWithLocalization() {
  return (
    <LocalizationProvider>
      <App />
    </LocalizationProvider>
  );
}
