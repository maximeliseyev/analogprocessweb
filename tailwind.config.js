/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        ios: {
          dark: '#000000',
          'dark-gray': '#1a1a1a',
          'medium-gray': '#2d2d2d',
          'light-gray': '#3a3a3a',
          'card': 'rgba(255, 255, 255, 0.05)',
          'card-hover': 'rgba(255, 255, 255, 0.08)',
          'border': 'rgba(255, 255, 255, 0.1)',
          'text-primary': '#ffffff',
          'text-secondary': '#a1a1aa',
          'text-tertiary': '#71717a',
        }
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        ios: {
          "primary": "#0ea5e9",
          "secondary": "#a1a1aa",
          "accent": "#f59e0b",
          "neutral": "#2d2d2d",
          "base-100": "#000000",
          "base-200": "#1a1a1a",
          "base-300": "#2d2d2d",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
} 