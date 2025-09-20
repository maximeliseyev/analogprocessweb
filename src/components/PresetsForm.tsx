import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Settings, AgitationModesData, FilmData, DeveloperData } from '../types';
import { Input, Select } from './ui';

interface PresetsFormProps {
  settings: Settings;
  saveSettings: (newSettings: Partial<Settings>) => void;
  films: FilmData;
  developers: DeveloperData;
  availableDilutions: string[];
  availableISOs: number[];
  availableTemperatures: number[];
  agitationModes: AgitationModesData;
}

export const PresetsForm: React.FC<PresetsFormProps> = ({
  settings,
  saveSettings,
  films,
  developers,
  availableDilutions,
  availableISOs,
  availableTemperatures,
  agitationModes
}) => {
  const { t } = useLocalization();

  const filmOptions = [
    ...Object.entries(films).map(([key, film]) => ({ value: key, label: film.name }))
  ];
  if (!filmOptions.some(opt => opt.value === 'custom')) {
    filmOptions.push({ value: 'custom', label: t('manualInput') });
  }

  const developerOptions = [
    ...Object.entries(developers).map(([key, developer]) => ({ value: key, label: developer.name }))
  ];
  if (!developerOptions.some(opt => opt.value === 'custom')) {
    developerOptions.push({ value: 'custom', label: t('custom') });
  }

  const agitationModeOptions = Object.entries(agitationModes).map(([key, mode]) => ({
    value: key,
    label: t(mode.localizedNameKey) || mode.name
  }));

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

      {/* Agitation */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">{t('agitation')}</label>
        <Select
          value={settings.agitationPreset || ''}
          onChange={(e) => saveSettings({ agitationPreset: e.target.value })}
          options={agitationModeOptions}
        />
      </div>

      {/* Base time (only for custom film) */}
      {settings.film === 'custom' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">{t('baseTime')}</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={settings.baseMinutes}
              onChange={(e) => saveSettings({ baseMinutes: parseInt(e.target.value) || 0 })}
              min={0}
              max={59}
              className="w-20 text-center text-lg"
            />
            <span className="text-gray-400 text-base">{t('min')}</span>
            <Input
              type="number"
              value={settings.baseSeconds}
              onChange={(e) => saveSettings({ baseSeconds: parseInt(e.target.value) || 0 })}
              min={0}
              max={59}
              className="w-20 text-center text-lg"
            />
            <span className="text-gray-400 text-base">{t('sec')}</span>
          </div>
        </div>
      )}
    </>
  );
};
