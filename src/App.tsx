import React, { useState, useEffect } from 'react';
import './App.css';
import { DebugPanel } from './components';
import { HomeScreen, PresetsScreen, CalculatorScreen, TimerScreen } from './components';
import { useSettings, useData } from './hooks';
import { getAppVersion } from './utils/version';
import { LocalizationProvider, useLocalization } from './hooks/useLocalization';
import { 
  APP_CONFIG, 
  LOG_MESSAGES, 
  ERROR_LOG_MESSAGES 
} from './constants';

function App() {
  const { t, currentLanguage, setLanguage } = useLocalization();
  const { settings, loadSettings } = useSettings();
  const { loading, films, developers, dataSource, combinationInfo } = useData(settings);
  
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [appVersion, setAppVersion] = useState<string>(APP_CONFIG.VERSION);
  const [timerPreset, setTimerPreset] = useState<{ time: number; title: string } | null>(null);

  useEffect(() => {
    loadSettings();
    getAppVersion().then(version => {
      console.log(LOG_MESSAGES.APP_VERSION_SET, version);
      setAppVersion(version);
    }).catch(error => {
      console.error(ERROR_LOG_MESSAGES.VERSION_LOAD_FAILED, error);
    });
  }, [loadSettings]);

  const handleNavigate = (screen: string, timerData?: { time: number; title: string }) => {
    setCurrentScreen(screen);
    if (timerData) {
      setTimerPreset(timerData);
    } else {
      setTimerPreset(null);
    }
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'presets':
        return <PresetsScreen onBack={handleBack} onNavigate={handleNavigate} />;
      case 'calculator':
        return <CalculatorScreen onBack={handleBack} onNavigate={handleNavigate} />;
      case 'timer':
        return <TimerScreen 
          onBack={handleBack} 
          onNavigate={handleNavigate} 
          presetTime={timerPreset?.time}
          presetTitle={timerPreset?.title}
        />;
      case 'staging':
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('staging')}</h1>
            <p className="text-gray-400 mb-4">{t('comingSoon')}</p>
            <button 
              onClick={handleBack}
              className="text-blue-500 hover:text-blue-400"
            >
              ← {t('back')}
            </button>
          </div>
        </div>;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderScreen()}
      
      {/* Language Switcher - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => setLanguage(currentLanguage === 'en' ? 'ru' : 'en')}
          className="text-blue-500 hover:text-blue-400 font-medium text-sm px-3 py-2 rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-200 backdrop-blur-sm bg-black/20"
        >
          {currentLanguage === 'en' ? 'RU' : 'EN'}
        </button>
      </div>

      {/* Footer with version */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="text-xs text-gray-500 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
          v{appVersion}
        </div>
      </div>

      {/* Debug Panel */}
      <DebugPanel 
        films={films}
        developers={developers}
        loading={loading}
        dataSource={dataSource}
        combinationInfo={combinationInfo}
      />
    </>
  );
}

export default function AppWithLocalization() {
  return (
    <LocalizationProvider>
      <App />
    </LocalizationProvider>
  );
}
