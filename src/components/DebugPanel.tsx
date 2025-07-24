import React from 'react';
import { type FilmData, type DeveloperData } from '../utils/filmdev-utils';

interface DebugPanelProps {
  films: FilmData;
  developers: DeveloperData;
  loading: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ films, developers, loading }) => {
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