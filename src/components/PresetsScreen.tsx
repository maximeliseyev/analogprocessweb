import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useSettings, useData } from '../hooks';
import { PresetsForm } from './PresetsForm';
import { Button, Card } from './ui';
import { getBaseTime, loadTemperatureMultipliers, roundToQuarterMinute } from '../utils/filmdev-utils';

interface PresetsScreenProps {
  onBack: () => void;
  onNavigate: (screen: string, timerData?: { time: number; title: string }) => void;
}

export const PresetsScreen: React.FC<PresetsScreenProps> = ({ onBack, onNavigate }) => {
  const { t } = useLocalization();
  const { settings, saveSettings } = useSettings();
  const { 
    films, 
    developers, 
    availableDilutions, 
    availableISOs, 
    availableTemperatures
  } = useData(settings);
  
  const [calculatedTime, setCalculatedTime] = useState<string>('--:--');
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate base time when settings change
  useEffect(() => {
    const calculateBaseTime = async () => {
      if (settings.film === 'custom') {
        const totalSeconds = settings.baseMinutes * 60 + settings.baseSeconds;
        setCalculatedTime(roundToQuarterMinute(totalSeconds));
        return;
      }

      setIsCalculating(true);
      try {
        const baseTime = await getBaseTime(
          settings.film,
          settings.developer,
          settings.dilution,
          settings.iso
        );
        
        if (baseTime !== null) {
          const temps = await loadTemperatureMultipliers();
          const tempMultiplier = temps[settings.temperature.toString()] || 1.0;
          const adjustedTime = baseTime * tempMultiplier;
          setCalculatedTime(roundToQuarterMinute(adjustedTime));
        } else {
          setCalculatedTime('--:--');
        }
      } catch (error) {
        console.error('Error calculating base time:', error);
        setCalculatedTime('--:--');
      } finally {
        setIsCalculating(false);
      }
    };

    calculateBaseTime();
  }, [settings.film, settings.developer, settings.dilution, settings.iso, settings.temperature, settings.baseMinutes, settings.baseSeconds]);

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
            {t('developmentSetup')}
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Segmented Control */}
        <div className="flex bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10 mb-6">
          <Button
            variant="primary"
            size="md"
            onClick={() => {}}
            className="flex-1"
          >
            {t('developing')}
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => {}}
            className="flex-1"
          >
            {t('fixer')}
          </Button>
        </div>

        {/* Settings Form */}
        <Card className="mb-6">
          <PresetsForm
            settings={settings}
            saveSettings={saveSettings}
            films={films}
            developers={developers}
            availableDilutions={availableDilutions}
            availableISOs={availableISOs}
            availableTemperatures={availableTemperatures}
          />
        </Card>

        {/* Navigation to Calculator */}
        <Button 
          onClick={() => onNavigate('calculator')}
          variant="ghost"
          size="lg"
          className="w-full mb-6 bg-blue-600 hover:bg-blue-700 border-0"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {isCalculating ? '...' : calculatedTime}
            </div>
          </div>
        </Button>

        {/* Navigation to Timer */}
        <Button 
          onClick={() => onNavigate('timer')}
          variant="ghost"
          size="lg"
          className="w-full bg-orange-600 hover:bg-orange-700 border-0"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {isCalculating ? '...' : calculatedTime}
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};
