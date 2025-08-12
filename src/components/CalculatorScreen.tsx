import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useSettings, useData } from '../hooks';
import { getBaseTime, loadTemperatureMultipliers, roundToQuarterMinute } from '../utils/filmdev-utils';
import { TimeResult } from '../types';
import { Button, Card, Input, Select, Modal } from './ui';
import { PROCESS_TYPES, CUSTOM_VALUES, FORM_LIMITS } from '../constants';

interface CalculatorScreenProps {
  onBack: () => void;
  onNavigate: (screen: string, timerData?: { time: number; title: string }) => void;
}

export const CalculatorScreen: React.FC<CalculatorScreenProps> = ({ onBack, onNavigate }) => {
  const { t } = useLocalization();
  const { settings, saveSettings } = useSettings();
  const { availableTemperatures } = useData(settings);
  
  const [results, setResults] = useState<TimeResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Recalculate when temperature changes
  useEffect(() => {
    if (showResults) {
      calculateTimes();
    }
  }, [settings.temperature]);

  const calculateTimes = async () => {
    let baseTimeInSeconds: number;

    // Get base time (either from database or manual input)
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
        baseTimeInSeconds = baseTime;
      } else {
        baseTimeInSeconds = settings.baseMinutes * 60 + settings.baseSeconds;
      }
    }

    // Apply temperature multiplier to base time
    const temps = await loadTemperatureMultipliers();
    const tempMultiplier = temps[settings.temperature.toString()] || 1.0;
    baseTimeInSeconds = baseTimeInSeconds * tempMultiplier;

    // Calculate time for selected number of steps
    let stepTime: number;
    if (settings.process === PROCESS_TYPES.PUSH) {
      stepTime = baseTimeInSeconds * Math.pow(settings.coefficient, settings.steps);
    } else {
      stepTime = baseTimeInSeconds / Math.pow(settings.coefficient, settings.steps);
    }

    const times: TimeResult[] = [
      { label: t('basicTime'), time: baseTimeInSeconds, type: 'basic' },
      { 
        label: settings.process === PROCESS_TYPES.PULL ? `-${settings.steps} ${t('steps')}` : `+${settings.steps} ${t('steps')}`, 
        time: stepTime, 
        type: 'step' 
      }
    ];
    
    setResults(times);
    setShowResults(true);
  };

  const startTimer = (timeInSeconds: number, title: string) => {
    // Navigate to timer with pre-filled time
    onNavigate('timer', { time: timeInSeconds, title });
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
            ←
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

          {/* Process type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">{t('processType')}</label>
            <div className="flex bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
              <Button
                variant={settings.process === PROCESS_TYPES.PULL ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => saveSettings({ process: PROCESS_TYPES.PULL })}
                className="flex-1 h-10"
              >
                {t('pull')}
              </Button>
              <Button
                variant={settings.process === PROCESS_TYPES.PUSH ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => saveSettings({ process: PROCESS_TYPES.PUSH })}
                className="flex-1 h-10"
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
            <div className="flex items-center gap-2">
              <div className="flex-1 text-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 h-10 flex items-center justify-center">
                <span className="text-xl font-bold">{settings.steps}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => saveSettings({ steps: Math.max(1, settings.steps - 1) })}
                  className="w-24 h-10 rounded-lg flex items-center justify-center"
                >
                  <span className="text-base font-bold leading-none">-</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => saveSettings({ steps: Math.min(5, settings.steps + 1) })}
                  className="w-24 h-10 rounded-lg flex items-center justify-center"
                >
                  <span className="text-base font-bold leading-none">+</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Calculate button */}
        <Button 
          onClick={calculateTimes}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {t('calculate')}
        </Button>

        {/* Results Modal */}
        <Modal
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          title={t('calculationResults')}
        >
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                onClick={() => {
                  startTimer(result.time, result.label);
                  setShowResults(false);
                }}
                className={`w-full p-6 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                  result.type === 'basic' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-white/80 text-sm mb-2 font-medium">{result.label}</div>
                  <div className="text-3xl font-bold text-white">
                    {roundToQuarterMinute(result.time)}
                  </div>
                  <div className="text-white/60 text-xs mt-2">
                    {t('tapToStartTimer')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>


      </div>
    </div>
  );
};
