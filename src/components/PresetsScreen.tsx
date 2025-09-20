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
    availableTemperatures,
    agitationModes
  } = useData(settings);
  
  const [calculatedTime, setCalculatedTime] = useState<string>('--:--');
  const [calculatedTimeInSeconds, setCalculatedTimeInSeconds] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate base time when settings change
  useEffect(() => {
    const calculateBaseTime = async () => {
      if (settings.film === 'custom') {
        const totalSeconds = settings.baseMinutes * 60 + settings.baseSeconds;
        setCalculatedTime(roundToQuarterMinute(totalSeconds));
        setCalculatedTimeInSeconds(totalSeconds);
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
          setCalculatedTimeInSeconds(adjustedTime);
        } else {
          setCalculatedTime('--:--');
          setCalculatedTimeInSeconds(0);
        }
      } catch (error) {
        console.error('Error calculating base time:', error);
        setCalculatedTime('--:--');
        setCalculatedTimeInSeconds(0);
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
            agitationModes={agitationModes}
          />
        </Card>

        {/* Navigation to Timer */}
        <Button 
          onClick={() => onNavigate('timer', { time: calculatedTimeInSeconds, title: 'Development' })}
          variant="primary"
          size="lg"
          className="w-full mb-6"
          disabled={isCalculating || calculatedTimeInSeconds === 0}
        >
          <div className="text-center">
            <div className="text-lg font-semibold">
              {t('goToTimer')}
            </div>
            <div className="text-3xl font-bold text-white">
              {isCalculating ? '...' : calculatedTime}
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};
