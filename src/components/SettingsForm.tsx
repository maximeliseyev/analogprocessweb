import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Settings } from '../types';
import { type FilmData, type DeveloperData } from '../types';
import { Input, Select, Button } from './ui';
import { 
  FORM_LIMITS, 
  CUSTOM_VALUES, 
  PROCESS_TYPES 
} from '../constants';

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

  const filmOptions = [
    ...Object.entries(films).map(([key, film]) => ({ value: key, label: film.name }))
  ];
  if (!filmOptions.some(opt => opt.value === CUSTOM_VALUES.FILM)) {
    filmOptions.push({ value: CUSTOM_VALUES.FILM, label: t('manualInput') });
  }

  const developerOptions = [
    ...Object.entries(developers).map(([key, developer]) => ({ value: key, label: developer.name }))
  ];
  if (!developerOptions.some(opt => opt.value === CUSTOM_VALUES.DEVELOPER)) {
    developerOptions.push({ value: CUSTOM_VALUES.DEVELOPER, label: t('custom') });
  }

  return (
    <>
      {/* Film setup section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{t('film')}</label>
        <Select
          value={settings.film}
          onChange={(e) => saveSettings({ film: e.target.value })}
          options={filmOptions}
        />
      </div>

      {/* Developer */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{t('developer')}</label>
        <Select
          value={settings.developer}
          onChange={(e) => saveSettings({ developer: e.target.value })}
          options={developerOptions}
        />
      </div>

      {/* Dilution */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{t('dilution')}</label>
        <Select
          value={settings.dilution}
          onChange={(e) => saveSettings({ dilution: e.target.value })}
          options={availableDilutions.map(dilution => ({
            value: dilution,
            label: dilution === 'stock' ? t('stock') : t(`dilution${dilution}`) || dilution
          }))}
        />
      </div>

      {/* ISO */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{t('iso')}</label>
        <Select
          value={settings.iso}
          onChange={(e) => saveSettings({ iso: parseInt(e.target.value) })}
          options={availableISOs.map(iso => ({
            value: iso,
            label: t(`iso${iso}`) || iso.toString()
          }))}
        />
      </div>

      {/* Temperature */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{t('temperature')}</label>
        <Select
          value={settings.temperature}
          onChange={(e) => saveSettings({ temperature: parseInt(e.target.value) })}
          options={availableTemperatures.map(temp => ({
            value: temp,
            label: t(`temp${temp}`) || `${temp}°C`
          }))}
        />
      </div>

      {/* Base time */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{t('baseTime')}</label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={settings.baseMinutes}
            onChange={(e) => saveSettings({ baseMinutes: parseInt(e.target.value) || 0 })}
            min={FORM_LIMITS.BASE_TIME.MINUTES.MIN}
            max={FORM_LIMITS.BASE_TIME.MINUTES.MAX}
            className="w-20 text-center text-lg"
          />
          <span className="text-gray-400 text-base">{t('min')}</span>
          <Input
            type="number"
            value={settings.baseSeconds}
            onChange={(e) => saveSettings({ baseSeconds: parseInt(e.target.value) || 0 })}
            min={FORM_LIMITS.BASE_TIME.SECONDS.MIN}
            max={FORM_LIMITS.BASE_TIME.SECONDS.MAX}
            className="w-20 text-center text-lg"
          />
          <span className="text-gray-400 text-base">{t('sec')}</span>
        </div>
      </div>

      {/* Ratio */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{t('ratio')}</label>
        <Input
          type="number"
          value={settings.coefficient}
          onChange={(e) => saveSettings({ coefficient: parseFloat(e.target.value) || FORM_LIMITS.COEFFICIENT.DEFAULT })}
          min={FORM_LIMITS.COEFFICIENT.MIN}
          step={FORM_LIMITS.COEFFICIENT.STEP}
          className="text-center text-lg"
        />
      </div>

      {/* Process */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{t('process')}</label>
        <div className="flex bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
          <Button
            variant={settings.process === PROCESS_TYPES.PUSH ? 'primary' : 'ghost'}
            size="md"
            onClick={() => saveSettings({ process: PROCESS_TYPES.PUSH })}
            className="flex-1"
          >
            {t('push')}
          </Button>
          <Button
            variant={settings.process === PROCESS_TYPES.PULL ? 'primary' : 'ghost'}
            size="md"
            onClick={() => saveSettings({ process: PROCESS_TYPES.PULL })}
            className="flex-1"
          >
            {t('pull')}
          </Button>
        </div>
      </div>

      {/* Steps */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{t('steps')}</label>
        <Input
          type="number"
          value={settings.steps}
          onChange={(e) => saveSettings({ steps: parseInt(e.target.value) || FORM_LIMITS.STEPS.DEFAULT })}
          min={FORM_LIMITS.STEPS.MIN}
          max={FORM_LIMITS.STEPS.MAX}
          className="text-center text-lg"
        />
      </div>
    </>
  );
}; 