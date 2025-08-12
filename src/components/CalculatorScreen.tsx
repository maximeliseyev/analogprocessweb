import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useSettings, useData } from '../hooks';
import { getBaseTime, loadTemperatureMultipliers, roundToQuarterMinute } from '../utils/filmdev-utils';
import { TimeResult } from '../types';
import { Button, Card, Input } from './ui';
import { PROCESS_TYPES, CUSTOM_VALUES, FORM_LIMITS } from '../constants';

interface CalculatorScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({ onBack, onNavigate }) => {
  const { t } = useLocalization();
  const { settings, saveSettings } = useSettings();
  // useData hook called for side effects
  useData(settings);
  
  const [results, setResults] = useState<TimeResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const calculateTimes = async () => {
    let baseTimeInSeconds: number;

    if (settings.film === CUSTOM_VALUES.FILM) {
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
      { label: t('basicTime'), time: baseTimeInSeconds }
    ];
    
    for (let i = 1; i <= settings.steps; i++) {
      let time;
      if (settings.process === PROCESS_TYPES.PUSH) {
        time = baseTimeInSeconds * Math.pow(settings.coefficient, i);
      } else {
        time = baseTimeInSeconds / Math.pow(settings.coefficient, i);
      }
      times.push({ 
        label: settings.process === PROCESS_TYPES.PULL ? `-${i} ${t('steps')}` : `+${i} ${t('steps')}`, 
        time 
      });
    }
    
    setResults(times);
    setShowResults(true);
  };

  const startTimer = (timeInSeconds: number, title: string) => {
    // Navigate to timer with pre-filled time
    onNavigate('timer');
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={onBack}
            variant="ghost"
            size="sm"
          >
            ← {t('back')}
          </Button>
          <h1 className="text-xl font-bold text-white">
            {t('calculator')}
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Calculator Form */}
        <Card className="mb-6">
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
                placeholder="0"
              />
              <span className="text-gray-400 text-base">{t('min')}</span>
              <Input
                type="number"
                value={settings.baseSeconds}
                onChange={(e) => saveSettings({ baseSeconds: parseInt(e.target.value) || 0 })}
                min={FORM_LIMITS.BASE_TIME.SECONDS.MIN}
                max={FORM_LIMITS.BASE_TIME.SECONDS.MAX}
                className="w-20 text-center text-lg"
                placeholder="0"
              />
              <span className="text-gray-400 text-base">{t('sec')}</span>
            </div>
          </div>

          {/* Ratio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {t('ratio')} <span className="text-gray-500">({t('standard')} 1.33)</span>
            </label>
            <Input
              type="number"
              value={settings.coefficient}
              onChange={(e) => saveSettings({ coefficient: parseFloat(e.target.value) || FORM_LIMITS.COEFFICIENT.DEFAULT })}
              min={FORM_LIMITS.COEFFICIENT.MIN}
              step={FORM_LIMITS.COEFFICIENT.STEP}
              className="text-center text-lg"
            />
          </div>

          {/* Process type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">{t('processType')}</label>
            <div className="flex bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
              <Button
                variant={settings.process === PROCESS_TYPES.PULL ? 'primary' : 'ghost'}
                size="md"
                onClick={() => saveSettings({ process: PROCESS_TYPES.PULL })}
                className="flex-1"
              >
                {t('pull')}
              </Button>
              <Button
                variant={settings.process === PROCESS_TYPES.PUSH ? 'primary' : 'ghost'}
                size="md"
                onClick={() => saveSettings({ process: PROCESS_TYPES.PUSH })}
                className="flex-1"
              >
                {t('push')}
              </Button>
            </div>
          </div>

          {/* Steps */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {t('numberOfSteps')} <span className="text-gray-500">({t('from')} 1 {t('to')} 5)</span>
            </label>
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => saveSettings({ steps: Math.max(1, settings.steps - 1) })}
              >
                -
              </Button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold">{settings.steps}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => saveSettings({ steps: Math.min(5, settings.steps + 1) })}
              >
                +
              </Button>
            </div>
          </div>
        </Card>

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
        {showResults && (
          <div className="space-y-4 mb-6">
            {results.map((result, index) => (
              <Card key={index} className="flex flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-gray-400 text-sm mb-2 font-medium">{result.label}</div>
                  <div className="text-2xl font-bold text-white">
                    {roundToQuarterMinute(result.time)}
                  </div>
                </div>
                <Button 
                  onClick={() => startTimer(result.time, result.label)}
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
        )}

        {/* Navigation to Timer */}
        <Button 
          onClick={() => onNavigate('timer')}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          {t('goToTimer')}
        </Button>
      </div>
    </div>
  );
};
