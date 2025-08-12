import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Button, Card } from './ui';
import { TIMER_CONFIG, ANIMATION_CONFIG } from '../constants';

interface TimerProps {
  timeInSeconds: number;
  title: string;
  onComplete?: () => void;
  onClose: () => void;
}

interface TimerState {
  remainingTime: number;
  isRunning: boolean;
  elapsedTime: number;
}

const Timer: React.FC<TimerProps> = ({ timeInSeconds, title, onComplete, onClose }) => {
  const { t } = useLocalization();
  const [timerState, setTimerState] = useState<TimerState>({
    remainingTime: timeInSeconds,
    isRunning: false,
    elapsedTime: 0
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const circleCircumference = TIMER_CONFIG.CIRCLE_CIRCUMFERENCE;

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (timerState.isRunning) return;
    
    setTimerState(prev => ({ ...prev, isRunning: true }));
    startTimeRef.current = Date.now() - (timeInSeconds - timerState.remainingTime) * 1000;
    
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
      const remaining = Math.max(0, timeInSeconds - elapsed);
      
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
      remainingTime: timeInSeconds,
      isRunning: false,
      elapsedTime: 0
    });
    startTimeRef.current = Date.now();
  };

  const completeTimer = () => {
    pauseTimer();
    setTimerState(prev => ({ ...prev, remainingTime: 0 }));
    onComplete?.();
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

  const progressPercent = timerState.remainingTime / timeInSeconds;
  const progressOffset = circleCircumference * (1 - progressPercent);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        {/* Заголовок таймера */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={onClose}
            variant="outline"
            size="sm"
          >
            {t('back')}
          </Button>
          <h2 className="text-xl font-bold ml-4 text-white">{title}</h2>
        </div>
        
        {/* Круговой таймер */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              className="fill-none stroke-white/10 stroke-2" 
            />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              className="fill-none stroke-blue-500 stroke-3 stroke-linecap-round transition-all duration-100 ease-linear" 
              style={{
                strokeDasharray: circleCircumference,
                strokeDashoffset: progressOffset
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-5xl font-light text-white font-mono mb-3 ${
              timerState.remainingTime <= 0 ? ANIMATION_CONFIG.PULSE_SLOW : ''
            }`}>
              {timerState.remainingTime <= 0 ? t('done') : formatTime(timerState.remainingTime)}
            </div>
            <div className="text-sm text-gray-400 font-medium">{t('time')}</div>
          </div>
        </div>
        
        {/* Кнопки управления */}
        <div className="flex gap-4 mb-6">
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
        
        {/* Прогресс бар */}
        <div className={`h-${TIMER_CONFIG.PROGRESS_BAR_HEIGHT / 4} bg-white/10 backdrop-blur-sm rounded-full overflow-hidden`}>
          <div 
            className="h-full bg-blue-500 transition-all duration-100 ease-linear" 
            style={{ width: `${progressPercent * 100}%` }}
          />
        </div>
      </Card>
    </div>
  );
};

export default Timer; 