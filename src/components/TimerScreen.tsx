import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useSettings } from '../hooks';
import { Button, Card, Input } from './ui';
import { TIMER_CONFIG, ANIMATION_CONFIG } from '../constants';

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

export const TimerScreen: React.FC<TimerScreenProps> = ({ onBack, onNavigate, presetTime, presetTitle }) => {
  const { t } = useLocalization();
  // useSettings hook called for side effects
  useSettings();
  
  const [timerState, setTimerState] = useState<TimerState>({
    remainingTime: 0,
    isRunning: false,
    elapsedTime: 0
  });
  
  const [customTime, setCustomTime] = useState({
    minutes: 0,
    seconds: 0
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);



  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Set preset time when component mounts
  useEffect(() => {
    if (presetTime) {
      const minutes = Math.floor(presetTime / 60);
      const seconds = Math.floor(presetTime % 60);
      setCustomTime({ minutes, seconds });
    }
  }, [presetTime]);

  const startTimer = () => {
    if (timerState.isRunning) return;
    
    const totalTime = customTime.minutes * 60 + customTime.seconds;
    if (totalTime <= 0) return;
    
    setTimerState(prev => ({ 
      ...prev, 
      remainingTime: totalTime,
      isRunning: true 
    }));
    startTimeRef.current = Date.now();
    
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
      const remaining = Math.max(0, totalTime - elapsed);
      
      setTimerState(prev => ({
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
    
    setTimerState(prev => ({ ...prev, isRunning: false }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setTimerState({
      remainingTime: 0,
      isRunning: false,
      elapsedTime: 0
    });
  };

  const completeTimer = () => {
    pauseTimer();
    setTimerState(prev => ({ ...prev, remainingTime: 0 }));
  };

  const toggleTimer = () => {
    if (timerState.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = timerState.remainingTime > 0 ? timerState.remainingTime / (customTime.minutes * 60 + customTime.seconds) : 0;

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
            {t('timer')}
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Instructions */}
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm mb-4">
            {t('selectDevelopmentParametersToStartTimer')}
          </p>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className={`text-6xl font-light text-white font-mono mb-3 ${
            timerState.remainingTime <= 0 && timerState.elapsedTime > 0 ? ANIMATION_CONFIG.PULSE_SLOW : ''
          }`}>
            {timerState.remainingTime > 0 ? formatTime(timerState.remainingTime) : '0:00'}
          </div>
          <p className="text-sm text-gray-400">{t('tapToChangeTime')}</p>
        </div>

        {/* Time Input */}
        {!timerState.isRunning && (
          <Card className="mb-6">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-300 mb-3">{t('setTime')}</label>
              <div className="flex items-center justify-center gap-2">
                <Input
                  type="number"
                  value={customTime.minutes}
                  onChange={(e) => setCustomTime(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                  min={0}
                  max={59}
                  className="w-20 text-center text-lg"
                  placeholder="0"
                />
                <span className="text-gray-400 text-base">{t('min')}</span>
                <Input
                  type="number"
                  value={customTime.seconds}
                  onChange={(e) => setCustomTime(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                  min={0}
                  max={59}
                  className="w-20 text-center text-lg"
                  placeholder="0"
                />
                <span className="text-gray-400 text-base">{t('sec')}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Start Timer Button */}
        {!timerState.isRunning && (customTime.minutes > 0 || customTime.seconds > 0) && (
          <Button 
            onClick={startTimer}
            variant="primary"
            size="lg"
            className="w-full mb-6"
          >
            <span className="text-lg mr-2">⏱</span>
            {t('startTimer')}
          </Button>
        )}

        {/* Timer Controls */}
        {timerState.isRunning && (
          <div className="space-y-4 mb-6">
            <div className="flex gap-4">
              <Button 
                onClick={toggleTimer}
                variant="primary"
                size="lg"
                className="flex-1"
              >
                {t('pause')}
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
            
            {/* Progress Bar */}
            <div className="h-3 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-100 ease-linear" 
                style={{ width: `${progressPercent * 100}%` }}
              />
            </div>
          </div>
        )}

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
