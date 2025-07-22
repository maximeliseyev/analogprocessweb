export class LocalizationManager {
    constructor() {
        this.currentLocale = this.detectLanguage();
        this.translations = {};
        this.loaded = false;
    }

    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        if (langCode === 'ru') return 'ru';
        return 'en';
    }

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

    t(key) {
        return this.translations[key] || key;
    }

    async setLanguage(locale) {
        this.currentLocale = locale;
        await this.loadTranslations();
        this.updateUI();
    }

    getCurrentLanguage() {
        return this.currentLocale;
    }

    getNotificationText() {
        return this.t('developmentComplete');
    }

    getDataStatusText(hasData) {
        return hasData ? this.t('available') : this.t('noData');
    }

    getDoneText() {
        return this.t('done');
    }

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

    updateUI() {

    }
} 