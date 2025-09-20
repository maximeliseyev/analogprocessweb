import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Card } from './ui';

interface HomeScreenProps {
  onNavigate: (screen: string, timerData?: { time: number; title: string }) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { t } = useLocalization();

  const navigationItems = [
    {
      id: 'presets',
      title: t('developmentSetup'),
      subtitle: t('developmentParameters'),
      color: 'text-blue-500'
    },
    {
      id: 'calculator',
      title: t('calculator'),
      subtitle: t('timeCalculation'),
      color: 'text-orange-500'
    },
    {
      id: 'timer',
      title: t('timer'),
      subtitle: t('developmentTimer'),
      color: 'text-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-400 text-sm">
            {t('appDescription')}
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="space-y-4">
          {navigationItems.map((item) => (
            <div 
              key={item.id}
              className="cursor-pointer"
              onClick={() => onNavigate(item.id)}
            >
              <Card className="p-6 hover:bg-white/5 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {item.subtitle}
                    </p>
                  </div>
                  <div className="text-gray-500">
                    →
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
