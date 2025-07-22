import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Settings } from '../types';
import { type FilmData, type DeveloperData } from '../utils/filmdev-utils';

interface SettingsFormProps {
  settings: Settings;
  saveSettings: (newSettings: Partial<Settings>) => void;
  films: FilmData;
  developers: DeveloperData;
  availableDilutions: string[];
  availableISOs: number[];
  availableTemperatures: number[];
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  saveSettings,
  films,
  developers,
  availableDilutions,
  availableISOs,
  availableTemperatures
}) => {
  const { t } = useLocalization();

  return (
    <>
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
      </div>

      {/* Ratio */}
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
    </>
  );
}; 