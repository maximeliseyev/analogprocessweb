import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'badge font-medium';
  
  const variantClasses = {
    primary: 'badge-primary bg-blue-500/20 text-blue-400 border border-blue-400/30',
    secondary: 'badge-secondary bg-white/10 text-gray-300 border border-white/20',
    success: 'badge-success bg-green-500/20 text-green-400 border border-green-400/30',
    warning: 'badge-warning bg-yellow-500/20 text-yellow-400 border border-yellow-400/30',
    error: 'badge-error bg-red-500/20 text-red-400 border border-red-400/30'
  };

  const sizeClasses = {
    sm: 'badge-sm text-xs',
    md: 'text-sm',
    lg: 'badge-lg text-base'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
}; 