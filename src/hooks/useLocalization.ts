import { useState, useEffect } from 'react';

interface Translations {
  [key: string]: string;
}

interface LocalizationState {
  currentLanguage: string;
  translations: Translations;
  isLoading: boolean;
}

export const useLocalization = () => {
  const [state, setState] = useState<LocalizationState>({
    currentLanguage: 'en',
    translations: {},
    isLoading: true
  });

  // Загрузка переводов
  const loadTranslations = async (language: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await fetch(`/locales/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${language} translations`);
      }
      const translations = await response.json();
      setState(prev => ({
        ...prev,
        currentLanguage: language,
        translations,
        isLoading: false
      }));
    } catch (error) {
      console.error(`Error loading ${language} translations:`, error);
      // Fallback to English
      if (language !== 'en') {
        await loadTranslations('en');
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  };

  // Инициализация
  useEffect(() => {
    const savedLanguage = localStorage.getItem('filmDevLanguage') || 'en';
    loadTranslations(savedLanguage);
  }, []);

  // Функция перевода
  const t = (key: string): string => {
    return state.translations[key] || key;
  };

  // Переключение языка
  const setLanguage = async (language: string) => {
    localStorage.setItem('filmDevLanguage', language);
    await loadTranslations(language);
  };

  return {
    currentLanguage: state.currentLanguage,
    translations: state.translations,
    isLoading: state.isLoading,
    t,
    setLanguage
  };
}; 