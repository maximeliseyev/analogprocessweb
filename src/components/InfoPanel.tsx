import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Settings } from '../types';
import { type CombinationInfo, formatTime } from '../utils/filmdev-utils';
import { Card } from './ui';

interface InfoPanelProps {
  combinationInfo: CombinationInfo | null;
  settings: Settings;
  dataSource?: 'external' | 'local' | 'fallback';
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ combinationInfo, settings, dataSource }) => {
  const { t } = useLocalization();

  if (!combinationInfo) {
    return (
      <Card className="mb-6">
        <div className="text-sm text-gray-400 mb-3 font-medium">{t('current')}</div>
        <div className="text-sm text-gray-300">Loading...</div>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
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
      {combinationInfo && (
        <div className="text-xs text-gray-500 mt-3">
          {settings.film === 'custom' 
            ? t('manualInput')
            : combinationInfo.hasData 
              ? `${t('fromDatabase')} ${combinationInfo.film?.name} + ${combinationInfo.developer?.name}`
              : t('defaultTime')
          }
          {dataSource && (
            <div className="mt-1">
              {dataSource === 'external' && <span className="text-green-400">📡 {t('externalData')}</span>}
              {dataSource === 'fallback' && <span className="text-yellow-400">⚠️ {t('localData')}</span>}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}; 