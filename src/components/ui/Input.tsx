import React from 'react';

interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  min,
  max,
  step,
  disabled = false
}) => {
  const baseClasses = 'input input-bordered w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:border-blue-400/50 focus:outline-none transition-all duration-200 hover:bg-white/8';

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${baseClasses} ${className}`}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
    />
  );
}; 