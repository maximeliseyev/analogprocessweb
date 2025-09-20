import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useSettings, useData } from '../hooks';
import { Button, AgitationVisualizer } from './ui';
import { TIMER_CONFIG } from '../constants';
import { getAgitationAction } from '../utils/agitation-utils';
import { AgitationRule } from '../types';

interface TimerScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  presetTime?: number;
  presetTitle?: string;
}

interface TimerState {
  remainingTime: number;
  isRunning: boolean;
  elapsedTime: number;
}

export const TimerScreen: React.FC<TimerScreenProps> = ({ onBack, onNavigate, presetTime = 0, presetTitle }) => {
  const { t } = useLocalization();
  const { settings } = useSettings();
  const { agitationModes } = useData(settings);
  
  const [timerState, setTimerState] = useState<TimerState>({
    remainingTime: presetTime,
    isRunning: false,
    elapsedTime: 0
  });
  
  const [agitationRule, setAgitationRule] = useState<AgitationRule | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setTimerState({ remainingTime: presetTime, isRunning: false, elapsedTime: 0 });
  }, [presetTime]);

  const startTimer = () => {
    if (timerState.isRunning || presetTime <= 0) return;
    
    setTimerState((prev: TimerState) => ({ 
      ...prev, 
      isRunning: true 
    }));
    startTimeRef.current = Date.now() - timerState.elapsedTime * 1000;
    
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
      const remaining = Math.max(0, presetTime - elapsed);
      
      const totalMinutes = Math.floor(presetTime / 60);
      const currentMinute = Math.floor(elapsed / 60) + 1;
      const agitationMode = settings.agitationPreset ? agitationModes[settings.agitationPreset] : null;

      if (agitationMode) {
        const rule = getAgitationAction(currentMinute, totalMinutes, agitationMode);
        setAgitationRule(rule);
      }

      setTimerState((prev: TimerState) => ({
        ...prev,
        remainingTime: remaining,
        elapsedTime: elapsed
      }));
      
      if (remaining <= 0) {
        completeTimer();
      }
    }, TIMER_CONFIG.UPDATE_INTERVAL);
  };

  const pauseTimer = () => {
    if (!timerState.isRunning) return;
    
    setTimerState((prev: TimerState) => ({ ...prev, isRunning: false }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setTimerState({
      remainingTime: presetTime,
      isRunning: false,
      elapsedTime: 0
    });
    setAgitationRule(null);
  };

  const completeTimer = () => {
    pauseTimer();
    setTimerState((prev: TimerState) => ({ ...prev, remainingTime: 0 }));
  };

  const toggleTimer = () => {
    if (timerState.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const renderAgitationInstruction = () => {
    if (!agitationRule) return null;

    const { action, parameters } = agitationRule;
    switch (action) {
      case 'continuous':
        return t('agitationContinuous');
      case 'still':
        return t('agitationStill');
      case 'cycle':
        return `${t('agitateFor')} ${parameters.agitation_seconds}s, ${t('restFor')} ${parameters.rest_seconds}s`;
      case 'periodic':
        return `${t('agitateOnceEvery')} ${parameters.interval_seconds}s`;
      case 'rotations':
        return `${parameters.rotations} ${t('rotations')}`;
      default:
        return null;
    }
  };

  const progress = presetTime > 0 ? (presetTime - timerState.remainingTime) / presetTime : 0;

  const isAgitating = agitationRule?.action !== 'still';

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  const minutes = Math.floor(timerState.remainingTime / 60);
  const seconds = timerState.remainingTime % 60;

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 w-full">
          <Button 
            onClick={onBack}
            variant="ghost"
            size="sm"
          >
            ←
          </Button>
          <h1 className="text-xl font-bold text-white">
            {t('timer')}
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Timer Circle */}
        <div className="relative flex items-center justify-center w-full h-auto my-8">
          <svg className="transform -rotate-90" width="300" height="300" viewBox="0 0 300 300">
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="15"
              fill="transparent"
            />
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke={isAgitating ? '#fb923c' : '#3b82f6'} // orange-400 or blue-500
              strokeWidth="15"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.3s ease-out, stroke 0.3s ease-in-out' }}
            />
          </svg>
          <div className="absolute text-center flex flex-col items-center justify-center">
            <AgitationVisualizer isAgitating={isAgitating} />
            <div className="text-6xl font-bold tracking-tighter">
              {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
            </div>
            <div className="text-gray-400 text-sm mt-2">
              {renderAgitationInstruction()}
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <Button 
              onClick={toggleTimer}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              {timerState.isRunning ? t('pause') : t('start')}
            </Button>
            <Button 
              onClick={resetTimer}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              {t('reset')}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <Button 
            onClick={() => onNavigate('calculator')}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            {t('goToCalculator')}
          </Button>
          
          <Button 
            onClick={() => onNavigate('presets')}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            {t('goToPresets')}
          </Button>
        </div>
      </div>
    </div>
  );
};
