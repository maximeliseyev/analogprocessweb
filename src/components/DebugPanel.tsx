import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { type FilmData, type DeveloperData } from '../types';

interface DebugPanelProps {
  films: FilmData;
  developers: DeveloperData;
  loading: boolean;
  dataSource?: 'external' | 'local' | 'fallback';
  combinationInfo?: any;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ films, developers, loading, dataSource, combinationInfo }) => {
  const { t } = useLocalization();
  if (process.env.NODE_ENV === 'production') {
    return null; // Не показываем в продакшене
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
      <h3 className="text-sm font-bold mb-2">Debug Info</h3>
      <div className="text-xs space-y-1">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Films loaded: {Object.keys(films).length}</div>
        <div>Developers loaded: {Object.keys(developers).length}</div>
        
        {/* Data Source Info */}
        {dataSource && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="font-semibold">Data Source:</div>
            {dataSource === 'external' && (
              <div className="text-green-400">📡 {t('externalData')}</div>
            )}
            {dataSource === 'local' && (
              <div className="text-blue-500">💾 {t('localData')}</div>
            )}
            {dataSource === 'fallback' && (
              <div className="text-yellow-400">⚠️ {t('localData')} (fallback)</div>
            )}
          </div>
        )}
        
        {/* Combination Info */}
        {combinationInfo && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="font-semibold">Current Combination:</div>
            <div className="text-gray-300">
              {combinationInfo.film?.name || 'Custom'} + {combinationInfo.developer?.name || 'Custom'}
            </div>
            <div className="text-gray-300">
              {combinationInfo.dilution} @ {combinationInfo.iso} ISO, {combinationInfo.temperature}°C
            </div>
            <div className={`font-medium ${combinationInfo.hasData ? 'text-green-400' : 'text-red-400'}`}>
              {combinationInfo.hasData ? t('available') : t('noData')}
            </div>
          </div>
        )}
        
        <div className="mt-2">
          <div className="font-semibold">Sample Films:</div>
          {Object.keys(films).slice(0, 3).map(key => (
            <div key={key} className="text-gray-300">• {films[key]?.name || key}</div>
          ))}
        </div>
        <div className="mt-2">
          <div className="font-semibold">Sample Developers:</div>
          {Object.keys(developers).slice(0, 3).map(key => (
            <div key={key} className="text-gray-300">• {developers[key]?.name || key}</div>
          ))}
        </div>
      </div>
    </div>
  );
}; 