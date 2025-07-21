// js/localization.js

export class LocalizationManager {
    constructor() {
        this.currentLocale = this.detectLanguage();
        this.translations = {};
        this.loaded = false;
    }

    // Автоматическое определение языка
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        if (langCode === 'ru') return 'ru';
        return 'en';
    }

    // Асинхронная загрузка переводов
    async loadTranslations() {
        const locale = this.currentLocale;
        try {
            const response = await fetch(`locales/${locale}.json`);
            this.translations = await response.json();
            this.loaded = true;
        } catch (e) {
            console.error('Failed to load translations for', locale, e);
            this.translations = {};
            this.loaded = false;
        }
    }

    // Получить перевод по ключу
    t(key) {
        return this.translations[key] || key;
    }

    // Установить язык
    async setLanguage(locale) {
        this.currentLocale = locale;
        await this.loadTranslations();
        this.updateUI();
    }

    // Получить текущий язык
    getCurrentLanguage() {
        return this.currentLocale;
    }

    // Получить текст уведомления
    getNotificationText() {
        return this.t('developmentComplete');
    }

    // Получить текст статуса данных
    getDataStatusText(hasData) {
        return hasData ? this.t('available') : this.t('noData');
    }

    // Получить текст завершения
    getDoneText() {
        return this.t('done');
    }

    // Получить текст для ступеней
    getStepText(step, process = 'push') {
        if (process === 'pull') {
            if (step === 1) return this.t('pullStep1');
            if (step === 2) return this.t('pullStep2');
            if (step === 3) return this.t('pullStep3');
            if (step === 4) return this.t('pullStep4');
            if (step === 5) return this.t('pullStep5');
            return `-${step} steps`;
        } else {
            if (step === 1) return this.t('step1');
            if (step === 2) return this.t('step2');
            if (step === 3) return this.t('step3');
            if (step === 4) return this.t('step4');
            if (step === 5) return this.t('step5');
            return `+${step} steps`;
        }
    }

    // Обновить интерфейс (оставить как есть, если используется)
    updateUI() {
        // ... (реализация обновления UI, как в старой версии)
    }

    // ... (остальные методы класса без изменений)
} 