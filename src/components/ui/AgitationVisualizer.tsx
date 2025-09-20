import React from 'react';

interface AgitationVisualizerProps {
  isAgitating: boolean;
}

export const AgitationVisualizer: React.FC<AgitationVisualizerProps> = ({ isAgitating }) => {
  const containerClassName = `absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isAgitating ? 'opacity-100' : 'opacity-0'}`;

  return (
    <div className={containerClassName}>
      <div className="arrow-container">
        {/* Simple rotating arrows */}
        <div className="absolute w-2 h-16 bg-white/50 rounded-full" style={{ transform: 'rotate(45deg)' }}></div>
        <div className="absolute w-2 h-16 bg-white/50 rounded-full" style={{ transform: 'rotate(-45deg)' }}></div>
      </div>
    </div>
  );
};

