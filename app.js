// Импорт пресетов и локализации
import { FILM_DATA, DEVELOPER_DATA, DEVELOPMENT_TIMES, TEMPERATURE_MULTIPLIERS, FilmDevUtils } from './presets.js';
import { LocalizationManager } from './locales.js';

// Конфигурация приложения
const APP_CONFIG = {
    version: '3.0.0',
    cacheName: 'film-dev-calculator-v3',
    vibrationPattern: [500, 200, 500, 200, 500],
    defaultSettings: {
        baseMinutes: 7,
        baseSeconds: 0,
        coefficient: 1.33,
        process: 'push', // 'push' или 'pull'
        steps: 3,
        film: 'ilford-hp5-plus',
        developer: 'ilford-id11',
        dilution: 'stock',
        iso: 400,
        temperature: 20
    }
};

// Класс для управления настройками
class Settings {
    constructor() {
        this.settings = { ...APP_CONFIG.defaultSettings };
        this.load();
    }

    load() {
        try {
            const saved = JSON.parse(localStorage.getItem('filmDevSettings') || '{}');
            this.settings = { ...APP_CONFIG.defaultSettings, ...saved };
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    save() {
        try {
            localStorage.setItem('filmDevSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    get(key) {
        return this.settings[key];
    }

    set(key, value) {
        this.settings[key] = value;
        this.save();
    }

    getBaseTimeInSeconds() {
        // Если выбрана пользовательская плёнка, используем ручные настройки
        if (this.settings.film === 'custom') {
            return this.settings.baseMinutes * 60 + this.settings.baseSeconds;
        }
        
        // Используем FilmDevUtils для получения времени из базы данных
        const baseTime = FilmDevUtils.getBaseTime(
            this.settings.film,
            this.settings.developer,
            this.settings.dilution,
            this.settings.iso
        );
        
        if (baseTime !== null) {
            return baseTime;
        }
        
        // Если данных нет, используем ручные настройки
        return this.settings.baseMinutes * 60 + this.settings.baseSeconds;
    }

    calculateTimes() {
        const baseTime = this.getBaseTimeInSeconds();
        const times = [{ label: window.app?.localization?.getBasicTimeText() || "Basic time", time: baseTime }];
        
        for (let i = 1; i <= this.settings.steps; i++) {
            let time;
            if (this.settings.process === 'push') {
                // Push: умножаем базовое время на коэффициент
                time = Math.round(baseTime * Math.pow(this.settings.coefficient, i));
            } else {
                // Pull: делим базовое время на коэффициент
                time = Math.round(baseTime / Math.pow(this.settings.coefficient, i));
            }
            times.push({ 
                label: window.app?.localization?.getStepText(i, this.settings.process) || (this.settings.process === 'pull' ? `-${i} steps` : `+${i} steps`), 
                time 
            });
        }
        
        return times;
    }

    getStepLabel(step) {
        if (step === 1) return 'ь';
        if (step < 5) return 'и';
        return 'ей';
    }

    getCurrentCombinationInfo() {
        return FilmDevUtils.getCombinationInfo(
            this.settings.film,
            this.settings.developer,
            this.settings.dilution,
            this.settings.iso,
            this.settings.temperature
        );
    }
}

// Класс для управления таймером
class Timer {
    constructor() {
        this.interval = null;
        this.remainingTime = 0;
        this.totalTime = 0;
        this.isRunning = false;
        this.onUpdate = null;
        this.onComplete = null;
        this.circleCircumference = 283; // 2 * π * 45
        this.startTime = null;
    }

    start(timeInSeconds, title) {
        this.stop();
        this.totalTime = timeInSeconds;
        this.remainingTime = timeInSeconds;
        this.title = title;
        this.startTime = Date.now();
        
        if (this.onUpdate) {
            this.onUpdate(this.remainingTime, this.totalTime);
        }
    }

    play() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startTime = Date.now() - (this.totalTime - this.remainingTime) * 1000;
        
        this.interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.remainingTime = Math.max(0, this.totalTime - elapsed);
            
            if (this.onUpdate) {
                this.onUpdate(this.remainingTime, this.totalTime);
            }
            
            if (this.remainingTime <= 0) {
                this.complete();
            }
        }, 100);
    }

    pause() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    reset() {
        this.pause();
        this.remainingTime = this.totalTime;
        this.startTime = Date.now();
        if (this.onUpdate) {
            this.onUpdate(this.remainingTime, this.totalTime);
        }
    }

    stop() {
        this.pause();
        this.remainingTime = 0;
        this.totalTime = 0;
        this.startTime = null;
    }

    complete() {
        this.pause();
        if (this.onComplete) {
            this.onComplete();
        }
    }

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.play();
        }
    }

    updateCircleProgress(remainingTime, totalTime) {
        const progressCircle = document.getElementById('progressCircle');
        if (!progressCircle || totalTime === 0) return;
        
        const progressPercent = remainingTime / totalTime;
        const offset = this.circleCircumference * (1 - progressPercent);
        progressCircle.style.strokeDashoffset = offset;
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }
}

// Класс для управления уведомлениями
class NotificationManager {
    constructor() {
        this.permission = 'default';
        this.init();
    }

    async init() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
            if (this.permission === 'default') {
                await this.requestPermission();
            }
        }
    }

    async requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            this.permission = await Notification.requestPermission();
        }
    }

    show(title, options = {}) {
        if ('Notification' in window && this.permission === 'granted') {
            return new Notification(title, {
                icon: '/icons/icon-192x192.png',
                tag: 'film-dev-timer',
                ...options
            });
        }
        return null;
    }

    vibrate(pattern = APP_CONFIG.vibrationPattern) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
}

// Класс для управления UI
class UI {
    constructor() {
        this.elements = {};
        this.initializeElements();
    }

    initializeElements() {
        const elementIds = [
            'baseMinutes', 'baseSeconds', 'coefficient', 'process', 'steps',
            'calculateBtn', 'results', 'resultsContainer',
            'timerScreen', 'timerDisplay', 'timerTitle',
            'startPauseButton', 'resetButton', 'backButton',
            'progressBar', 'progressCircle',
            'filmSelect', 'developerSelect', 'dilutionSelect', 'isoSelect', 'temperatureSelect',
            'customTimeSection', 'currentFilm', 'currentDeveloper', 'currentDilution', 'currentISO',
            'currentTemperature', 'currentProcess', 'currentBaseTime', 'dataStatus',
            'pushProcess', 'pullProcess'
        ];

        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
    }

    updateInputs(settings) {
        this.elements.baseMinutes.value = settings.get('baseMinutes');
        this.elements.baseSeconds.value = settings.get('baseSeconds');
        this.elements.coefficient.value = settings.get('coefficient');
        this.elements.steps.value = settings.get('steps');
        this.elements.filmSelect.value = settings.get('film');
        this.elements.developerSelect.value = settings.get('developer');
        this.elements.dilutionSelect.value = settings.get('dilution');
        this.elements.isoSelect.value = settings.get('iso');
        this.elements.temperatureSelect.value = settings.get('temperature');
        
        this.updateCustomTimeSection();
        this.updateProcessButtons(settings.get('process'));
        this.updateDilutionOptions(settings);
        this.updateISOOptions(settings);
        this.updateInfoPanel(settings);
    }
    
    updateCustomTimeSection() {
        const isCustomFilm = this.elements.filmSelect.value === 'custom';
        this.elements.customTimeSection.classList.toggle('hidden', !isCustomFilm);
    }
    
    updateProcessButtons(process) {
        const pushBtn = this.elements.pushProcess;
        const pullBtn = this.elements.pullProcess;
        
        if (process === 'push') {
            pushBtn.classList.add('bg-blue-600', 'text-white');
            pushBtn.classList.remove('text-gray-400', 'hover:text-white');
            pullBtn.classList.remove('bg-blue-600', 'text-white');
            pullBtn.classList.add('text-gray-400', 'hover:text-white');
        } else {
            pullBtn.classList.add('bg-blue-600', 'text-white');
            pullBtn.classList.remove('text-gray-400', 'hover:text-white');
            pushBtn.classList.remove('bg-blue-600', 'text-white');
            pushBtn.classList.add('text-gray-400', 'hover:text-white');
        }
    }
    
    updateInfoPanel(settings) {
        const combinationInfo = settings.getCurrentCombinationInfo();
        
        this.elements.currentFilm.textContent = combinationInfo.film.name;
        this.elements.currentDeveloper.textContent = combinationInfo.developer.name;
        this.elements.currentDilution.textContent = combinationInfo.dilution;
        this.elements.currentISO.textContent = combinationInfo.iso;
        this.elements.currentTemperature.textContent = `${combinationInfo.temperature}°C`;
        this.elements.currentProcess.textContent = settings.get('process') === 'push' ? 'Push' : 'Pull';
        this.elements.currentBaseTime.textContent = combinationInfo.formattedTime;
        
        // Обновляем статус данных с локализацией
        if (combinationInfo.hasData) {
            this.elements.dataStatus.textContent = window.app?.localization?.getDataStatusText(true) || '✓ Available';
            this.elements.dataStatus.className = 'text-white font-medium';
        } else {
            this.elements.dataStatus.textContent = window.app?.localization?.getDataStatusText(false) || '✗ No data';
            this.elements.dataStatus.className = 'text-red-400 font-medium';
        }
    }
    
    updateDilutionOptions(settings) {
        const filmKey = settings.get('film');
        const developerKey = settings.get('developer');
        
        if (filmKey === 'custom' || developerKey === 'custom') {
            return; // Не обновляем для пользовательских настроек
        }
        
        const availableDilutions = FilmDevUtils.getAvailableDilutions(filmKey, developerKey);
        const currentDilution = settings.get('dilution');
        
        // Очищаем текущие опции
        this.elements.dilutionSelect.innerHTML = '';
        
        if (availableDilutions.length === 0) {
            // Если нет данных, добавляем стандартные разведения
            const standardDilutions = ['stock', '1+1', '1+3'];
            standardDilutions.forEach(dilution => {
                const option = document.createElement('option');
                option.value = dilution;
                option.textContent = dilution === 'stock' ? 'Stock' : dilution;
                this.elements.dilutionSelect.appendChild(option);
            });
        } else {
            // Добавляем доступные разведения
            availableDilutions.forEach(dilution => {
                const option = document.createElement('option');
                option.value = dilution;
                option.textContent = dilution === 'stock' ? 'Stock' : dilution;
                this.elements.dilutionSelect.appendChild(option);
            });
        }
        
        // Устанавливаем значение, если оно доступно
        if (availableDilutions.includes(currentDilution)) {
            this.elements.dilutionSelect.value = currentDilution;
        } else if (availableDilutions.length > 0) {
            settings.set('dilution', availableDilutions[0]);
            this.elements.dilutionSelect.value = availableDilutions[0];
        }
    }
    
    updateISOOptions(settings) {
        const filmKey = settings.get('film');
        const developerKey = settings.get('developer');
        const dilution = settings.get('dilution');
        
        if (filmKey === 'custom' || developerKey === 'custom') {
            return; // Не обновляем для пользовательских настроек
        }
        
        const availableISOs = FilmDevUtils.getAvailableISOs(filmKey, developerKey, dilution);
        const currentISO = settings.get('iso');
        
        // Очищаем текущие опции
        this.elements.isoSelect.innerHTML = '';
        
        if (availableISOs.length === 0) {
            // Если нет данных, добавляем стандартные ISO
            const standardISOs = [100, 200, 400, 800];
            standardISOs.forEach(iso => {
                const option = document.createElement('option');
                option.value = iso;
                option.textContent = iso;
                this.elements.isoSelect.appendChild(option);
            });
        } else {
            // Добавляем доступные ISO
            availableISOs.forEach(iso => {
                const option = document.createElement('option');
                option.value = iso;
                option.textContent = iso;
                this.elements.isoSelect.appendChild(option);
            });
        }
        
        // Устанавливаем значение, если оно доступно
        if (availableISOs.includes(currentISO)) {
            this.elements.isoSelect.value = currentISO;
        } else if (availableISOs.length > 0) {
            settings.set('iso', availableISOs[0]);
            this.elements.isoSelect.value = availableISOs[0];
        }
    }
    


    renderResults(times, formatTime) {
        this.elements.resultsContainer.innerHTML = '';
        
        times.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.className = 'bg-gray-700 rounded-xl p-4 mb-3 flex items-center justify-between';
            resultItem.innerHTML = `
                <div class="flex-1">
                    <div class="text-gray-400 text-sm mb-1">${item.label}</div>
                    <div class="text-2xl font-bold text-white">${formatTime(item.time)}</div>
                </div>
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 px-4 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-all duration-200 ml-4" 
                        data-time="${item.time}" data-label="${item.label}">
                    <span class="text-lg">⏱</span>
                    <span>${window.app?.localization?.t('timer') || 'Timer'}</span>
                </button>
            `;
            this.elements.resultsContainer.appendChild(resultItem);
        });
        
        this.elements.results.classList.remove('hidden');
    }

    showTimer(title) {
        this.elements.timerTitle.textContent = title;
        this.elements.timerScreen.classList.remove('hidden');
        this.elements.results.classList.add('hidden');
        this.elements.timerDisplay.classList.remove('animate-pulse-slow');
    }

    hideTimer() {
        this.elements.timerScreen.classList.add('hidden');
        this.elements.results.classList.remove('hidden');
        this.elements.timerDisplay.classList.remove('animate-pulse-slow');
    }

    updateTimerDisplay(time, isRunning) {
        this.elements.timerDisplay.textContent = time;
        const localization = window.app?.localization;
        if (localization) {
            this.elements.startPauseButton.textContent = isRunning ? localization.t('pause') : localization.t('start');
        } else {
            this.elements.startPauseButton.textContent = isRunning ? 'Pause' : 'Start';
        }
    }

    updateProgress(percent) {
        this.elements.progressBar.style.width = `${percent}%`;
    }

    showComplete() {
        this.elements.timerDisplay.textContent = window.app?.localization?.getDoneText() || "Done!";
        this.elements.timerDisplay.classList.add('animate-pulse-slow');
    }
    

}

// Основной класс приложения
class FilmDevCalculator {
    constructor() {
        this.settings = new Settings();
        this.timer = new Timer();
        this.notifications = new NotificationManager();
        this.ui = new UI();
        this.localization = new LocalizationManager();
        
        this.setupEventListeners();
        this.setupTimer();
        this.ui.updateInputs(this.settings);
        this.localization.updateUI();
        
        // Устанавливаем правильный текст кнопки языка
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.textContent = this.localization.getCurrentLanguage().toUpperCase();
        }
        
        this.registerServiceWorker();
    }

    setupEventListeners() {
        // Обработчики для полей ввода
        ['baseMinutes', 'baseSeconds', 'coefficient', 'steps'].forEach(field => {
            this.ui.elements[field].addEventListener('input', (e) => {
                const value = e.target.type === 'number' ? 
                    (e.target.type === 'number' && e.target.step === '0.01' ? 
                        parseFloat(e.target.value) : parseInt(e.target.value)) : 
                    e.target.value;
                
                this.settings.set(field, value || 0);
                this.ui.updateInfoPanel();
            });
        });

        // Обработчики для пресетов
        this.ui.elements.filmSelect.addEventListener('change', (e) => {
            this.settings.set('film', e.target.value);
            this.ui.updateCustomTimeSection();
            this.ui.updateDilutionOptions(this.settings);
            this.ui.updateISOOptions(this.settings);
            this.ui.updateInfoPanel(this.settings);
        });

        this.ui.elements.developerSelect.addEventListener('change', (e) => {
            this.settings.set('developer', e.target.value);
            this.ui.updateDilutionOptions(this.settings);
            this.ui.updateISOOptions(this.settings);
            this.ui.updateInfoPanel(this.settings);
        });

        this.ui.elements.dilutionSelect.addEventListener('change', (e) => {
            this.settings.set('dilution', e.target.value);
            this.ui.updateISOOptions(this.settings);
            this.ui.updateInfoPanel(this.settings);
        });

        this.ui.elements.isoSelect.addEventListener('change', (e) => {
            this.settings.set('iso', parseInt(e.target.value));
            this.ui.updateInfoPanel(this.settings);
        });

        this.ui.elements.temperatureSelect.addEventListener('change', (e) => {
            this.settings.set('temperature', parseInt(e.target.value));
            this.ui.updateInfoPanel(this.settings);
        });

        // Обработчики для кнопок процесса
        this.ui.elements.pushProcess.addEventListener('click', () => {
            this.settings.set('process', 'push');
            this.ui.updateProcessButtons('push');
        });

        this.ui.elements.pullProcess.addEventListener('click', () => {
            this.settings.set('process', 'pull');
            this.ui.updateProcessButtons('pull');
        });

        // Обработчик для переключения языка
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                const currentLang = this.localization.getCurrentLanguage();
                const newLang = currentLang === 'en' ? 'ru' : 'en';
                this.localization.setLanguage(newLang);
                languageToggle.textContent = newLang.toUpperCase();
                this.localization.updateUI();
                this.ui.updateInfoPanel(this.settings);
            });
        }

        // Обработчики для кнопок
        this.ui.elements.calculateBtn.addEventListener('click', () => this.renderResults());
        this.ui.elements.startPauseButton.addEventListener('click', () => this.timer.toggle());
        this.ui.elements.resetButton.addEventListener('click', () => this.timer.reset());
        this.ui.elements.backButton.addEventListener('click', () => this.closeTimer());

        // Обработчик для кнопок таймера в результатах
        this.ui.elements.resultsContainer.addEventListener('click', (e) => {
            if (e.target.closest('button[data-time]')) {
                const button = e.target.closest('button[data-time]');
                const time = parseInt(button.dataset.time);
                const label = button.dataset.label;
                this.startTimer(time, label);
            }
        });
    }

    setupTimer() {
        this.timer.onUpdate = (remainingTime, totalTime) => {
            this.ui.updateTimerDisplay(this.formatTime(remainingTime), this.timer.isRunning);
            
            const progressPercent = (remainingTime / totalTime) * 100;
            this.ui.updateProgress(progressPercent);
            
            this.timer.updateCircleProgress(remainingTime, totalTime);
        };

        this.timer.onComplete = () => {
            this.ui.showComplete();
            this.notifications.show(this.localization.getNotificationText(), {
                body: this.timer.title
            });
            this.notifications.vibrate();
        };
    }

    formatTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    renderResults() {
        const times = this.settings.calculateTimes();
        this.ui.renderResults(times, (time) => this.formatTime(time));
    }

    startTimer(timeInSeconds, label) {
        this.timer.start(timeInSeconds, label);
        this.ui.showTimer(label);
    }

    closeTimer() {
        this.timer.stop();
        this.ui.hideTimer();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker зарегистрирован');
                    } catch (error) {
            console.error('Error registering Service Worker:', error);
        }
        }
    }
}

// Инициализация приложения
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FilmDevCalculator();
}); 