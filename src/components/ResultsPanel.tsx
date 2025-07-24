import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { TimeResult } from '../types';
import { roundToQuarterMinute } from '../utils/filmdev-utils';
import { Card, Button } from './ui';

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
        <Card key={index} className="flex flex-row items-center justify-between gap-4">
          <div>
            <div className="text-gray-400 text-sm mb-2 font-medium">{result.label}</div>
            <div className="text-2xl font-bold text-white">{formatTimeDisplay(result.time)}</div>
          </div>
          <Button 
            onClick={() => onStartTimer(result.time, result.label)}
            variant="primary"
            size="md"
            className="flex-shrink-0"
          >
            <span className="text-lg">⏱</span>
            <span className="ml-2">{t('timer')}</span>
          </Button>
        </Card>
      ))}
    </div>
  );
}; 