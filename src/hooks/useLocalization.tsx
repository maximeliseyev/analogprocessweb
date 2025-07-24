import React, { useState, useEffect, useCallback, useContext, createContext, ReactNode } from 'react';

interface Translations {
  [key: string]: string;
}

interface LocalizationState {
  currentLanguage: string;
  translations: Translations;
  isLoading: boolean;
  t: (key: string) => string;
  setLanguage: (language: string) => Promise<void>;
}

const LocalizationCtx = createContext<LocalizationState | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = useCallback(async (language: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/locales/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${language} translations`);
      }
      const translations = await response.json();
      setCurrentLanguage(language);
      setTranslations(translations);
      setIsLoading(false);
    } catch (error) {
      console.error(`Error loading ${language} translations:`, error);
      if (language !== 'en') {
        await loadTranslations('en');
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('filmDevLanguage') || 'en';
    loadTranslations(savedLanguage);
  }, [loadTranslations]);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  const setLanguage = async (language: string) => {
    localStorage.setItem('filmDevLanguage', language);
    await loadTranslations(language);
  };

  return (
    <LocalizationCtx.Provider value={{ currentLanguage, translations, isLoading, t, setLanguage }}>
      {children}
    </LocalizationCtx.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationCtx);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}; 