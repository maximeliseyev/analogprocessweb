import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { TimeResult } from '../types';
import { roundToQuarterMinute } from '../utils/filmdev-utils';

interface ResultsPanelProps {
  results: TimeResult[];
  showResults: boolean;
  onStartTimer: (timeInSeconds: number, title: string) => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  results, 
  showResults, 
  onStartTimer 
}) => {
  const { t } = useLocalization();

  const formatTimeDisplay = (seconds: number): string => {
    return roundToQuarterMinute(seconds);
  };

  if (!showResults) {
    return null;
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex items-center justify-between">
          <div className="flex-1">
            <div className="text-gray-400 text-sm mb-2 font-medium">{result.label}</div>
            <div className="text-2xl font-bold text-white">{formatTimeDisplay(result.time)}</div>
          </div>
          <button 
            onClick={() => onStartTimer(result.time, result.label)}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 active:scale-95 px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 transition-all duration-200 ml-4 shadow-lg shadow-blue-500/25"
          >
            <span className="text-lg">⏱</span>
            <span>{t('timer')}</span>
          </button>
        </div>
      ))}
    </div>
  );
}; 