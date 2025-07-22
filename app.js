// Импорт пресетов и локализации
import { getBaseTime, getAvailableDilutions, getAvailableISOs, getCombinationInfo, loadTemperatureMultipliers, loadFilmData, loadDeveloperData } from './js/filmdev-utils.js';
import { LocalizationManager } from './js/localization.js';
import { PresetsManager } from './js/presets-manager.js';
import { AGITATION_PRESETS, AGITATION_PRESET_DESCRIPTIONS } from './js/agitation-presets.js';

// Конфигурация приложения
const APP_CONFIG = {
    version: '3.0.0',
    cacheName: 'film-dev-calculator-v3',
    vibrationPattern: [500, 200, 500, 200, 500],
    defaultSettings: {
        baseMinutes: 7,
        baseSeconds: 0,
        coefficient: 1.33,
        process: 'push', // 'push' or 'pull'
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

    async getBaseTimeInSeconds() {
        // Если выбрана пользовательская плёнка, используем ручные настройки
        if (this.settings.film === 'custom') {
            return this.settings.baseMinutes * 60 + this.settings.baseSeconds;
        }
        
        // Используем FilmDevUtils для получения времени из базы данных
        const baseTime = await getBaseTime(
            this.settings.film,
            this.settings.developer,
            this.settings.dilution,
            this.settings.iso
        );
        
        if (baseTime !== null) {
            const temps = await loadTemperatureMultipliers();
            const tempMultiplier = temps[String(this.settings.temperature)] || 1.0;
            return baseTime * tempMultiplier;
        }
        
        // Если данных нет, используем ручные настройки
        return this.settings.baseMinutes * 60 + this.settings.baseSeconds;
    }
    
    // Получить базовое время из базы данных (без fallback на ручные настройки)
    async getDatabaseTimeInSeconds() {
        if (this.settings.film === 'custom') {
            return null; // Для пользовательской плёнки нет данных в БД
        }
        
        const result = await getBaseTime(
            this.settings.film,
            this.settings.developer,
            this.settings.dilution,
            this.settings.iso
        );
        
        console.log('getDatabaseTimeInSeconds called with:', this.settings.film, this.settings.developer, this.settings.dilution, this.settings.iso);
        console.log('getBaseTime returned:', result);
        
        return result;
    }

    async calculateTimes() {
        const baseTime = await this.getBaseTimeInSeconds();
        const times = [{ label: window.app?.localization?.getBasicTimeText() || "Basic time", time: baseTime }];
        
        for (let i = 1; i <= this.settings.steps; i++) {
            let time;
            if (this.settings.process === 'push') {
                // Push: умножаем базовое время на коэффициент
                time = baseTime * Math.pow(this.settings.coefficient, i);
            } else {
                // Pull: делим базовое время на коэффициент
                time = baseTime / Math.pow(this.settings.coefficient, i);
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

    async getCurrentCombinationInfo() {
        return await getCombinationInfo(
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

    async updateInputs(settings) {
        this.elements.baseMinutes.value = settings.get('baseMinutes');
        this.elements.baseSeconds.value = settings.get('baseSeconds');
        this.elements.coefficient.value = settings.get('coefficient');
        this.elements.steps.value = settings.get('steps');
        this.elements.filmSelect.value = settings.get('film');
        this.elements.developerSelect.value = settings.get('developer');
        this.elements.dilutionSelect.value = settings.get('dilution');
        this.elements.isoSelect.value = settings.get('iso');
        this.elements.temperatureSelect.value = settings.get('temperature');
        
        await this.updateCustomTimeSection(settings);
        this.updateProcessButtons(settings.get('process'));
        await this.updateFilmOptions(settings);
        await this.updateDeveloperOptions(settings);
        await this.updateDilutionOptions(settings);
        await this.updateISOOptions(settings);
        await this.updateTemperatureOptions(settings);
        this.updateInfoPanel(settings);
    }
    
    async updateCustomTimeSection(settings) {
        try {
            console.log('updateCustomTimeSection called');
            // Поля времени теперь всегда видимы
            this.elements.customTimeSection.classList.remove('hidden');
            
            // Получаем базовое время для выбранной комбинации
            if (settings) {
                const filmKey = settings.get('film');
                const developerKey = settings.get('developer');
                const dilution = settings.get('dilution');
                const iso = settings.get('iso');
                
                console.log('Updating time for:', filmKey, developerKey, dilution, iso);
                
                // ВСЕГДА используем getBaseTimeInSeconds (с температурой)
                let baseTimeInSeconds = await settings.getBaseTimeInSeconds();
                let timeSource = 'database';
                
                console.log('Database time:', baseTimeInSeconds);
                
                // Если данных нет, используем ручные настройки
                if (baseTimeInSeconds === null) {
                    baseTimeInSeconds = settings.baseMinutes * 60 + settings.baseSeconds;
                    timeSource = 'manual';
                    console.log('Using manual time:', baseTimeInSeconds);
                }
                
                const minutes = Math.floor(baseTimeInSeconds / 60);
                const seconds = baseTimeInSeconds % 60;
                
                console.log('Setting time to:', minutes, ':', seconds);
                
                // Обновляем поля ввода
                this.elements.baseMinutes.value = minutes;
                this.elements.baseSeconds.value = seconds;
                
                // Обновляем источник времени
                const timeSourceElement = document.getElementById('timeSource');
                if (timeSourceElement) {
                    const localization = window.app?.localization;
                    
                    if (filmKey === 'custom') {
                        timeSourceElement.textContent = localization?.t('manualInput') || 'Manual input';
                    } else if (timeSource === 'database') {
                        const combinationInfo = await getCombinationInfo(filmKey, developerKey, dilution, iso, settings.get('temperature'));
                        const filmName = combinationInfo.film?.name || filmKey;
                        const developerName = combinationInfo.developer?.name || developerKey;
                        const fromDbText = localization?.t('fromDatabase') || 'From database:';
                        timeSourceElement.textContent = `${fromDbText} ${filmName} + ${developerName}`;
                    } else {
                        timeSourceElement.textContent = localization?.t('defaultTime') || 'Default time (no data available)';
                    }
                }
            }
        } catch (error) {
            console.error('Error in updateCustomTimeSection:', error);
        }
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
    
    async updateInfoPanel(settings) {
        const combinationInfo = await settings.getCurrentCombinationInfo();
        
        this.elements.currentFilm.textContent = combinationInfo.film?.name || '-';
        this.elements.currentDeveloper.textContent = combinationInfo.developer?.name || '-';
        this.elements.currentDilution.textContent = combinationInfo.dilution;
        this.elements.currentISO.textContent = combinationInfo.iso;
        this.elements.currentTemperature.textContent = `${combinationInfo.temperature}°C`;
        this.elements.currentProcess.textContent = settings.get('process') === 'push' ? 'Push' : 'Pull';
        this.elements.currentBaseTime.textContent = (typeof combinationInfo.calculatedTime === 'number' && !isNaN(combinationInfo.calculatedTime)) ? formatTimerTime(combinationInfo.calculatedTime) : combinationInfo.formattedTime;
        
        // Обновляем статус данных с локализацией
        if (combinationInfo.hasData) {
            this.elements.dataStatus.textContent = window.app?.localization?.getDataStatusText(true) || '✓ Available';
            this.elements.dataStatus.className = 'text-white font-medium';
        } else {
            this.elements.dataStatus.textContent = window.app?.localization?.getDataStatusText(false) || '✗ No data';
            this.elements.dataStatus.className = 'text-red-400 font-medium';
        }
    }
    
    async updateDilutionOptions(settings) {
        console.log('updateDilutionOptions called', settings.get('film'), settings.get('developer'));
        const filmKey = settings.get('film');
        const developerKey = settings.get('developer');
        if (filmKey === 'custom' || developerKey === 'custom') {
            return;
        }
        const availableDilutions = await getAvailableDilutions(filmKey, developerKey);
        console.log('Available dilutions:', availableDilutions);
        const currentDilution = settings.get('dilution');
        this.elements.dilutionSelect.innerHTML = '';
        if (availableDilutions.length === 0) {
            const standardDilutions = ['stock', '1+1', '1+3'];
            standardDilutions.forEach(dilution => {
                const option = document.createElement('option');
                option.value = dilution;
                option.textContent = dilution === 'stock' ? 'Stock' : dilution;
                this.elements.dilutionSelect.appendChild(option);
            });
        } else {
            availableDilutions.forEach(dilution => {
                const option = document.createElement('option');
                option.value = dilution;
                option.textContent = dilution === 'stock' ? 'Stock' : dilution;
                this.elements.dilutionSelect.appendChild(option);
            });
        }
        if (availableDilutions.includes(currentDilution)) {
            this.elements.dilutionSelect.value = currentDilution;
        } else if (availableDilutions.length > 0) {
            settings.set('dilution', availableDilutions[0]);
            this.elements.dilutionSelect.value = availableDilutions[0];
        }
    }
    
    async updateISOOptions(settings) {
        const filmKey = settings.get('film');
        const developerKey = settings.get('developer');
        const dilution = settings.get('dilution');
        
        if (filmKey === 'custom' || developerKey === 'custom') {
            return; // Не обновляем для пользовательских настроек
        }
        
        const availableISOs = await getAvailableISOs(filmKey, developerKey, dilution);
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

    async updateTemperatureOptions(settings) {
        console.log('updateTemperatureOptions called');
        try {
            const temps = await loadTemperatureMultipliers();
            const currentTemp = settings.get('temperature');
            
            // Очищаем текущие опции
            this.elements.temperatureSelect.innerHTML = '';
            
            // Добавляем температурные опции
            Object.keys(temps).forEach(temp => {
                const option = document.createElement('option');
                option.value = temp;
                
                const tempNum = parseInt(temp);
                let label = `${temp}°C`;
                
                if (tempNum === 20) {
                    label += ' (Standard)';
                } else if (tempNum < 20) {
                    const percent = Math.round((temps[temp] - 1) * 100);
                    label += ` (+${percent}%)`;
                } else {
                    const percent = Math.round((1 - temps[temp]) * 100);
                    label += ` (-${percent}%)`;
                }
                
                option.textContent = label;
                this.elements.temperatureSelect.appendChild(option);
            });
            
            // Устанавливаем значение, если оно доступно
            if (temps[currentTemp]) {
                this.elements.temperatureSelect.value = currentTemp;
            } else {
                settings.set('temperature', '20');
                this.elements.temperatureSelect.value = '20';
            }
        } catch (error) {
            console.error('Error loading temperature options:', error);
            // Fallback к стандартным опциям
            const standardTemps = ['18', '19', '20', '21', '22'];
            standardTemps.forEach(temp => {
                const option = document.createElement('option');
                option.value = temp;
                option.textContent = `${temp}°C`;
                this.elements.temperatureSelect.appendChild(option);
            });
            this.elements.temperatureSelect.value = '20';
        }
    }

    async updateFilmOptions(settings) {
        console.log('updateFilmOptions called');
        try {
            const films = await loadFilmData();
            const currentFilm = settings.get('film');
            
            // Очищаем текущие опции
            this.elements.filmSelect.innerHTML = '';
            
            // Группируем плёнки по производителю
            const groupedFilms = {};
            Object.keys(films).forEach(filmKey => {
                const film = films[filmKey];
                const manufacturer = film.manufacturer || 'Other';
                if (!groupedFilms[manufacturer]) {
                    groupedFilms[manufacturer] = [];
                }
                groupedFilms[manufacturer].push({ key: filmKey, film });
            });
            
            // Добавляем опции по группам
            Object.keys(groupedFilms).forEach(manufacturer => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = manufacturer;
                
                groupedFilms[manufacturer].forEach(({ key, film }) => {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = film.name;
                    optgroup.appendChild(option);
                });
                
                this.elements.filmSelect.appendChild(optgroup);
            });
            
            // Добавляем опцию "Custom"
            const customOptgroup = document.createElement('optgroup');
            customOptgroup.label = 'Custom';
            const customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = 'Manual input';
            customOptgroup.appendChild(customOption);
            this.elements.filmSelect.appendChild(customOptgroup);
            
            // Устанавливаем значение, если оно доступно
            if (films[currentFilm]) {
                this.elements.filmSelect.value = currentFilm;
            } else if (currentFilm === 'custom') {
                this.elements.filmSelect.value = 'custom';
            } else if (Object.keys(films).length > 0) {
                const firstFilm = Object.keys(films)[0];
                settings.set('film', firstFilm);
                this.elements.filmSelect.value = firstFilm;
            }
        } catch (error) {
            console.error('Error loading film options:', error);
            // Fallback к стандартным опциям
            const fallbackFilms = [
                { value: 'ilford-hp5-plus', name: 'Ilford HP5+' },
                { value: 'kodak-tri-x', name: 'Kodak Tri-X 400' },
                { value: 'custom', name: 'Manual input' }
            ];
            
            fallbackFilms.forEach(film => {
                const option = document.createElement('option');
                option.value = film.value;
                option.textContent = film.name;
                this.elements.filmSelect.appendChild(option);
            });
            
            this.elements.filmSelect.value = 'ilford-hp5-plus';
        }
    }

    async updateDeveloperOptions(settings) {
        console.log('updateDeveloperOptions called');
        try {
            const developers = await loadDeveloperData();
            const currentDeveloper = settings.get('developer');
            
            // Очищаем текущие опции
            this.elements.developerSelect.innerHTML = '';
            
            // Группируем проявители по производителю
            const groupedDevelopers = {};
            Object.keys(developers).forEach(developerKey => {
                const developer = developers[developerKey];
                const manufacturer = developer.manufacturer || 'Other';
                if (!groupedDevelopers[manufacturer]) {
                    groupedDevelopers[manufacturer] = [];
                }
                groupedDevelopers[manufacturer].push({ key: developerKey, developer });
            });
            
            // Добавляем опции по группам
            Object.keys(groupedDevelopers).forEach(manufacturer => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = manufacturer;
                
                groupedDevelopers[manufacturer].forEach(({ key, developer }) => {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = developer.name;
                    optgroup.appendChild(option);
                });
                
                this.elements.developerSelect.appendChild(optgroup);
            });
            
            // Добавляем опцию "Custom"
            const customOptgroup = document.createElement('optgroup');
            customOptgroup.label = 'Custom';
            const customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = 'Custom';
            customOptgroup.appendChild(customOption);
            this.elements.developerSelect.appendChild(customOptgroup);
            
            // Устанавливаем значение, если оно доступно
            if (developers[currentDeveloper]) {
                this.elements.developerSelect.value = currentDeveloper;
            } else if (currentDeveloper === 'custom') {
                this.elements.developerSelect.value = 'custom';
            } else if (Object.keys(developers).length > 0) {
                const firstDeveloper = Object.keys(developers)[0];
                settings.set('developer', firstDeveloper);
                this.elements.developerSelect.value = firstDeveloper;
            }
        } catch (error) {
            console.error('Error loading developer options:', error);
            // Fallback к стандартным опциям
            const fallbackDevelopers = [
                { value: 'ilford-id11', name: 'ID-11' },
                { value: 'kodak-d76', name: 'D-76' },
                { value: 'custom', name: 'Custom' }
            ];
            
            fallbackDevelopers.forEach(developer => {
                const option = document.createElement('option');
                option.value = developer.value;
                option.textContent = developer.name;
                this.elements.developerSelect.appendChild(option);
            });
            
            this.elements.developerSelect.value = 'ilford-id11';
        }
    }
    


    async renderResults(times, formatTime) {
        console.warn('🔥 renderResults called 🔥');
        this.elements.resultsContainer.innerHTML = '';
        
        times.forEach(item => {
            let timeDisplay = (typeof item.time !== 'number' || isNaN(item.time)) ? 'N/A' : roundToQuarterMinute(item.time);
            console.log('renderResults: item', item, 'timeDisplay', timeDisplay);
            
            // Вычисляем округленное время в секундах для таймера
            let roundedTimeInSeconds = item.time;
            if (typeof item.time === 'number' && !isNaN(item.time)) {
                const mins = Math.floor(item.time / 60);
                let secs = item.time % 60;
                if (secs < 8) secs = 0;
                else if (secs < 23) secs = 15;
                else if (secs < 38) secs = 30;
                else if (secs < 53) secs = 45;
                else {
                    secs = 0;
                    roundedTimeInSeconds = (mins + 1) * 60;
                }
                roundedTimeInSeconds = mins * 60 + secs;
                console.log(`Timer: original ${item.time}s (${formatTimerTime(item.time)}) -> rounded ${roundedTimeInSeconds}s (${formatTimerTime(roundedTimeInSeconds)})`);
            }
            
            const resultItem = document.createElement('div');
            resultItem.className = 'bg-gray-700 rounded-xl p-4 mb-3 flex items-center justify-between';
            resultItem.innerHTML = `
                <div class="flex-1">
                    <div class="text-gray-400 text-sm mb-1">${item.label}</div>
                    <div class="text-2xl font-bold text-white">${timeDisplay}</div>
                </div>
                <button class="bg-blue-600 hover:bg-blue-700 active:scale-95 px-4 py-3 rounded-lg text-white font-semibold flex items-center gap-2 transition-all duration-200 ml-4" 
                        data-time="${roundedTimeInSeconds}" data-label="${item.label}">
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
    
    // --- UI: отображение этапа ажитации ---
    updateAgitationStage(stage, stageIdx, totalStages, remaining) {
        const timerTitle = this.elements.timerTitle;
        const timerDisplay = this.elements.timerDisplay;
        if (!stage) return;
        let label = '';
        if (stage.type === 'agitate') {
            label = `Ажитация${stage.turns ? `: ${stage.turns} оборот(ов)` : ''}`;
            if (stage.note) label += ` — ${stage.note}`;
        } else {
            label = 'Отдых';
        }
        timerTitle.textContent = `${label} (${stageIdx+1}/${totalStages})`;
        timerDisplay.textContent = formatTimerTime(remaining !== undefined ? remaining : stage.seconds);
    }

}

function formatTimerTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function roundToQuarterMinute(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    if (secs < 8) secs = 0;
    else if (secs < 23) secs = 15;
    else if (secs < 38) secs = 30;
    else if (secs < 53) secs = 45;
    else {
        secs = 0;
        mins += 1;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// --- Agitation Modal Logic ---

function showAgitationModal(onSelect) {
  const modal = document.getElementById('agitationModal');
  const list = document.getElementById('agitationPresetList');
  const cancelBtn = document.getElementById('agitationModalCancel');
  list.innerHTML = '';

  Object.keys(AGITATION_PRESETS).forEach(key => {
    const desc = AGITATION_PRESET_DESCRIPTIONS[key] || key;
    const btn = document.createElement('button');
    btn.className = 'w-full text-left p-3 rounded-lg bg-gray-700 text-white hover:bg-blue-600 transition mb-1';
    btn.innerHTML = `<div class="font-bold mb-1">${desc.split(':')[0]}</div><div class="text-sm text-gray-300">${desc.split(':').slice(1).join(':')}</div>`;
    btn.onclick = () => {
      modal.classList.add('hidden');
      onSelect(key);
    };
    list.appendChild(btn);
  });

  cancelBtn.onclick = () => {
    modal.classList.add('hidden');
  };

  modal.classList.remove('hidden');
}

// --- Построение этапов ажитации ---
function buildAgitationSteps(totalSeconds, presetKey) {
  const preset = AGITATION_PRESETS[presetKey];
  if (!preset || preset.length === 0 || presetKey === 'none' || presetKey === 'custom') {
    // Нет этапов — обычный таймер
    return [{ type: 'full', seconds: totalSeconds }];
  }
  let steps = [];
  let elapsed = 0;
  let minute = 1;
  let remaining = totalSeconds;
  for (let i = 0; i < preset.length; i++) {
    const p = preset[i];
    if (p.repeat === 'auto') {
      // Автоматически повторять до конца времени
      let repeatCount = 0;
      if (p.startMinute) {
        // Для RAE: каждые 5 минут после 10-й
        let t = p.startMinute * 60;
        while (t < totalSeconds) {
          steps.push({
            type: 'agitate',
            seconds: p.agitate,
            turns: p.turns,
            note: p.note,
            label: `${t/60}-я минута: ${p.note}`
          });
          if (t + p.agitate < totalSeconds) {
            steps.push({ type: 'rest', seconds: Math.min(p.rest, totalSeconds - t - p.agitate), label: 'Отдых' });
          }
          t += 5 * 60;
        }
        continue;
      } else {
        // Обычный auto-repeat
        while (remaining >= p.agitate + p.rest) {
          steps.push({ type: 'agitate', seconds: p.agitate, turns: p.turns, note: p.note, label: p.label });
          steps.push({ type: 'rest', seconds: p.rest, label: 'Отдых' });
          remaining -= (p.agitate + p.rest);
          repeatCount++;
        }
        // Если осталось время — добавить финальный этап
        if (remaining > 0) {
          if (remaining >= p.agitate) {
            steps.push({ type: 'agitate', seconds: p.agitate, turns: p.turns, note: p.note, label: p.label });
            remaining -= p.agitate;
          }
          if (remaining > 0) {
            steps.push({ type: 'rest', seconds: remaining, label: 'Отдых' });
          }
        }
        continue;
      }
    }
    // Обычный repeat
    for (let r = 0; r < (p.repeat || 1); r++) {
      if (remaining <= 0) break;
      if (p.agitate > 0) {
        steps.push({ type: 'agitate', seconds: Math.min(p.agitate, remaining), turns: p.turns, note: p.note, label: p.label });
        remaining -= Math.min(p.agitate, remaining);
      }
      if (p.rest > 0 && remaining > 0) {
        steps.push({ type: 'rest', seconds: Math.min(p.rest, remaining), label: 'Отдых' });
        remaining -= Math.min(p.rest, remaining);
      }
    }
  }
  // Если осталось время — добавить финальный отдых
  if (remaining > 0) {
    steps.push({ type: 'rest', seconds: remaining, label: 'Отдых' });
  }
  return steps;
}

// --- Agitation Timer ---
class AgitationTimer {
  constructor(steps, onStage, onComplete) {
    this.steps = steps;
    this.onStage = onStage;
    this.onComplete = onComplete;
    this.currentStage = 0;
    this.remaining = steps[0]?.seconds || 0;
    this.interval = null;
  }
  start() {
    this.showStage();
    this.interval = setInterval(() => {
      this.remaining--;
      if (this.remaining <= 0) {
        this.currentStage++;
        if (this.currentStage >= this.steps.length) {
          clearInterval(this.interval);
          this.onComplete && this.onComplete();
          return;
        }
        this.remaining = this.steps[this.currentStage].seconds;
        this.showStage();
      } else {
        this.onStage && this.onStage(this.steps[this.currentStage], this.currentStage, this.steps.length, this.remaining);
      }
    }, 1000);
  }
  showStage() {
    this.onStage && this.onStage(this.steps[this.currentStage], this.currentStage, this.steps.length, this.remaining);
  }
  stop() {
    clearInterval(this.interval);
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
        this.presetsManager = new PresetsManager();
        
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
        this.ui.elements.filmSelect.addEventListener('change', async (e) => {
            console.log('Film changed to:', e.target.value);
            this.settings.set('film', e.target.value);
            await this.ui.updateDilutionOptions(this.settings);
            await this.ui.updateISOOptions(this.settings);
            await this.ui.updateTemperatureOptions(this.settings);
            await this.ui.updateCustomTimeSection(this.settings);
            await this.ui.updateInfoPanel(this.settings);
        });

        this.ui.elements.developerSelect.addEventListener('change', async (e) => {
            console.log('Developer changed to:', e.target.value);
            this.settings.set('developer', e.target.value);
            await this.ui.updateDilutionOptions(this.settings);
            await this.ui.updateISOOptions(this.settings);
            await this.ui.updateTemperatureOptions(this.settings);
            await this.ui.updateCustomTimeSection(this.settings);
            await this.ui.updateInfoPanel(this.settings);
        });

        this.ui.elements.dilutionSelect.addEventListener('change', async (e) => {
            this.settings.set('dilution', e.target.value);
            await this.ui.updateISOOptions(this.settings);
            await this.ui.updateTemperatureOptions(this.settings);
            await this.ui.updateCustomTimeSection(this.settings);
            await this.ui.updateInfoPanel(this.settings);
        });

        this.ui.elements.isoSelect.addEventListener('change', async (e) => {
            this.settings.set('iso', parseInt(e.target.value));
            await this.ui.updateCustomTimeSection(this.settings);
            this.ui.updateInfoPanel(this.settings);
        });

        this.ui.elements.temperatureSelect.addEventListener('change', async (e) => {
            this.settings.set('temperature', parseInt(e.target.value));
            await this.ui.updateCustomTimeSection(this.settings);
            await this.ui.updateInfoPanel(this.settings);
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
        this.ui.elements.calculateBtn.addEventListener('click', () => {
            console.warn('🔥 Calculate button clicked 🔥');
            this.renderResults();
        });
        this.ui.elements.startPauseButton.addEventListener('click', () => this.timer.toggle());
        this.ui.elements.resetButton.addEventListener('click', () => this.timer.reset());
        this.ui.elements.backButton.addEventListener('click', () => this.closeTimer());

        // Обработчик для кнопок таймера в результатах
        this.ui.elements.resultsContainer.addEventListener('click', (e) => {
            if (e.target.closest('button[data-time]')) {
                const button = e.target.closest('button[data-time]');
                const time = parseInt(button.dataset.time);
                const label = button.dataset.label;
                console.log('Timer button clicked - time:', time, 'label:', label);
                this.startTimer(time, label);
            }
        });
    }

    setupTimer() {
        this.timer.onUpdate = (remainingTime, totalTime) => {
            this.ui.updateTimerDisplay(formatTimerTime(remainingTime), this.timer.isRunning);
            
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
        return formatTimerTime(totalSeconds);
    }

    async renderResults() {
        const times = await this.settings.calculateTimes();
        console.log('Render results - times:', times);
        await this.ui.renderResults(times, (time) => formatTimerTime(time));
    }

    startTimer(timeInSeconds, label) {
        console.log('startTimer called - timeInSeconds:', timeInSeconds, 'label:', label);
        const agitationKey = this.settings.get('agitationPreset');
        if (!agitationKey || agitationKey === 'none' || agitationKey === 'custom') {
            this.timer.start(timeInSeconds, label);
            this.ui.showTimer(label);
            return;
        }
        // Строим этапы
        const steps = buildAgitationSteps(timeInSeconds, agitationKey);
        this.ui.showTimer(label);
        let agitationTimer = new AgitationTimer(
            steps,
            (stage, idx, total, remaining) => {
                this.ui.updateAgitationStage(stage, idx, total, remaining);
                this.ui.updateTimerDisplay(formatTimerTime(remaining !== undefined ? remaining : stage.seconds), true);
            },
            () => {
                this.ui.showComplete();
            }
        );
        agitationTimer.start();
        // Сохраняем ссылку для возможности остановки
        this.agitationTimer = agitationTimer;
    }

    closeTimer() {
        this.timer.stop();
        this.ui.hideTimer();
        if (this.agitationTimer) {
            this.agitationTimer.stop();
            this.agitationTimer = null;
        }
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

// --- Переопределяем запуск таймера ---
const origStartTimer = FilmDevCalculator.prototype.startTimer;
FilmDevCalculator.prototype.startTimer = function(timeInSeconds, label) {
  const agitationKey = this.settings.get('agitationPreset');
  if (!agitationKey) {
    showAgitationModal((selectedKey) => {
      this.settings.set('agitationPreset', selectedKey);
      this.startTimer(timeInSeconds, label); // рекурсивно, теперь с выбранным режимом
    });
    return;
  }
  if (agitationKey === 'none' || agitationKey === 'custom') {
    this.timer.start(timeInSeconds, label);
    this.ui.showTimer(label);
    return;
  }
  // Строим этапы
  const steps = buildAgitationSteps(timeInSeconds, agitationKey);
  this.ui.showTimer(label);
  let agitationTimer = new AgitationTimer(
    steps,
    (stage, idx, total, remaining) => {
      this.ui.updateAgitationStage(stage, idx, total, remaining);
      this.ui.updateTimerDisplay(formatTimerTime(remaining !== undefined ? remaining : stage.seconds), true);
    },
    () => {
      this.ui.showComplete();
      this.settings.set('agitationPreset', null); // сбрасываем режим после завершения
    }
  );
  agitationTimer.start();
  // Сохраняем ссылку для возможности остановки
  this.agitationTimer = agitationTimer;
};

// Сброс режима при закрытии таймера
FilmDevCalculator.prototype.closeTimer = function() {
  this.timer.stop();
  this.ui.hideTimer();
  if (this.agitationTimer) {
    this.agitationTimer.stop();
    this.agitationTimer = null;
  }
  this.settings.set('agitationPreset', null);
};

// Инициализация приложения
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FilmDevCalculator();
}); 