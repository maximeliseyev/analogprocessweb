import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false
}) => {
  const baseClasses = 'btn font-medium transition-all duration-200';
  
  const variantClasses = {
    primary: 'btn-primary bg-blue-500 hover:bg-blue-600 text-white shadow-sm',
    secondary: 'btn-secondary bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white',
    ghost: 'btn-ghost text-gray-400 hover:text-white hover:bg-white/5',
    outline: 'btn-outline border-blue-500/30 text-blue-500 hover:border-blue-500/50 hover:text-blue-500'
  };

  const sizeClasses = {
    sm: 'btn-sm px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'btn-lg px-6 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button 
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}; 