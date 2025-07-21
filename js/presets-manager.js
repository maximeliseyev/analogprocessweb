import { loadFilmData, loadDeveloperData, loadDevelopmentTimes } from './filmdev-utils.js';

export class PresetsManager {
    constructor() {
        this.currentTab = 'films';
        this.editingItem = null;
        this.loadCustomPresets(); // Загружаем пользовательские пресеты
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Кнопка открытия модального окна
        const presetsBtn = document.getElementById('presetsBtn');
        if (presetsBtn) {
            presetsBtn.addEventListener('click', () => this.openModal());
        }

        // Кнопка закрытия модального окна
        const closePresetsModal = document.getElementById('closePresetsModal');
        if (closePresetsModal) {
            closePresetsModal.addEventListener('click', () => this.closeModal());
        }

        // Кнопка очистки всех пресетов
        const clearAllPresetsBtn = document.getElementById('clearAllPresetsBtn');
        if (clearAllPresetsBtn) {
            clearAllPresetsBtn.addEventListener('click', () => this.clearAllPresets());
        }

        // Переключение вкладок
        const tabs = document.querySelectorAll('.preset-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Кнопки добавления
        const addFilmBtn = document.getElementById('addFilmBtn');
        if (addFilmBtn) {
            addFilmBtn.addEventListener('click', () => this.showEditModal('film'));
        }

        const addDeveloperBtn = document.getElementById('addDeveloperBtn');
        if (addDeveloperBtn) {
            addDeveloperBtn.addEventListener('click', () => this.showEditModal('developer'));
        }

        const addTimeBtn = document.getElementById('addTimeBtn');
        if (addTimeBtn) {
            addTimeBtn.addEventListener('click', () => this.showEditModal('time'));
        }

        // Кнопка закрытия окна редактирования
        const closeEditModal = document.getElementById('closeEditModal');
        if (closeEditModal) {
            closeEditModal.addEventListener('click', () => this.closeEditModal());
        }

        // Форма редактирования
        const editForm = document.getElementById('editForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Кнопка удаления
        const deleteBtn = document.getElementById('deleteBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteItem());
        }

        // Закрытие модальных окон по клику вне их
        document.addEventListener('click', (e) => {
            if (e.target.id === 'presetsModal') {
                this.closeModal();
            }
            if (e.target.id === 'editModal') {
                this.closeEditModal();
            }
        });
    }

    openModal() {
        const modal = document.getElementById('presetsModal');
        if (modal) {
            console.log('Opening presets modal');
            modal.classList.remove('hidden');
            
            // Проверяем, что модальное окно действительно видимо
            console.log('Modal visibility:', modal.classList.contains('hidden'));
            console.log('Modal display style:', window.getComputedStyle(modal).display);
            
            // Устанавливаем активную вкладку и загружаем контент
            this.switchTab('films');
        } else {
            console.error('Presets modal not found');
        }
    }

    closeModal() {
        const modal = document.getElementById('presetsModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        this.currentTab = tabName;
        
        // Обновляем активную вкладку
        const tabs = document.querySelectorAll('.preset-tab');
        tabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active', 'text-white', 'border-blue-500');
                tab.classList.remove('text-gray-400', 'border-transparent');
            } else {
                tab.classList.remove('active', 'text-white', 'border-blue-500');
                tab.classList.add('text-gray-400', 'border-transparent');
            }
        });

        // Показываем содержимое вкладки
        const tabContents = document.querySelectorAll('.preset-tab-content');
        tabContents.forEach(content => {
            if (content.id === `${tabName}Tab`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });

        // Небольшая задержка, чтобы DOM обновился перед загрузкой контента
        setTimeout(() => {
            this.loadCurrentTab();
        }, 10);
    }

    loadCurrentTab() {
        console.log('Loading current tab:', this.currentTab);
        switch (this.currentTab) {
            case 'films':
                this.loadFilms();
                break;
            case 'developers':
                this.loadDevelopers();
                break;
            case 'times':
                this.loadTimes();
                break;
        }
    }

    async loadFilms() {
        // Сначала убедимся, что вкладка видна
        const filmsTab = document.getElementById('filmsTab');
        if (!filmsTab) {
            console.error('filmsTab element not found');
            return;
        }
        
        filmsTab.classList.remove('hidden');
        
        // Проверим, есть ли уже содержимое в filmsTab
        let filmsList = document.getElementById('filmsList');
        let addFilmBtn = document.getElementById('addFilmBtn');
        
        if (!filmsList || !addFilmBtn) {
            console.log('Creating films tab content dynamically');
            
            // Очищаем содержимое filmsTab
            filmsTab.innerHTML = '';
            
            // Создаем заголовок и кнопку
            const header = document.createElement('div');
            header.className = 'flex justify-between items-center mb-4';
            
            const title = document.createElement('h3');
            title.className = 'text-lg font-medium text-white';
            title.textContent = 'Film Presets';
            
            addFilmBtn = document.createElement('button');
            addFilmBtn.id = 'addFilmBtn';
            addFilmBtn.className = 'bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm';
            addFilmBtn.textContent = 'Add Film';
            addFilmBtn.addEventListener('click', () => this.showEditModal('film'));
            
            header.appendChild(title);
            header.appendChild(addFilmBtn);
            filmsTab.appendChild(header);
            
            // Создаем список
            filmsList = document.createElement('div');
            filmsList.id = 'filmsList';
            filmsList.className = 'space-y-2';
            filmsTab.appendChild(filmsList);
        }

        filmsList.innerHTML = '';
        console.log('Loading films, count:', Object.keys(FilmDevUtils.FILM_DATA).length);
        
        const films = await loadFilmData();
        Object.entries(films).forEach(([id, film]) => {
            const filmItem = this.createListItem(id, film, 'film');
            filmsList.appendChild(filmItem);
        });
        
        console.log('Films loaded, DOM elements:', filmsList.children.length);
    }

    async loadDevelopers() {
        // Сначала убедимся, что вкладка видна
        const developersTab = document.getElementById('developersTab');
        if (!developersTab) {
            console.error('developersTab element not found');
            return;
        }
        
        developersTab.classList.remove('hidden');
        
        // Проверим, есть ли уже содержимое в developersTab
        let developersList = document.getElementById('developersList');
        let addDeveloperBtn = document.getElementById('addDeveloperBtn');
        
        if (!developersList || !addDeveloperBtn) {
            console.log('Creating developers tab content dynamically');
            
            // Очищаем содержимое developersTab
            developersTab.innerHTML = '';
            
            // Создаем заголовок и кнопку
            const header = document.createElement('div');
            header.className = 'flex justify-between items-center mb-4';
            
            const title = document.createElement('h3');
            title.className = 'text-lg font-medium text-white';
            title.textContent = 'Developer Presets';
            
            addDeveloperBtn = document.createElement('button');
            addDeveloperBtn.id = 'addDeveloperBtn';
            addDeveloperBtn.className = 'bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm';
            addDeveloperBtn.textContent = 'Add Developer';
            addDeveloperBtn.addEventListener('click', () => this.showEditModal('developer'));
            
            header.appendChild(title);
            header.appendChild(addDeveloperBtn);
            developersTab.appendChild(header);
            
            // Создаем список
            developersList = document.createElement('div');
            developersList.id = 'developersList';
            developersList.className = 'space-y-2';
            developersTab.appendChild(developersList);
        }

        developersList.innerHTML = '';
        
        const developers = await loadDeveloperData();
        Object.entries(developers).forEach(([id, developer]) => {
            const developerItem = this.createListItem(id, developer, 'developer');
            developersList.appendChild(developerItem);
        });
    }

    async loadTimes() {
        // Сначала убедимся, что вкладка видна
        const timesTab = document.getElementById('timesTab');
        if (!timesTab) {
            console.error('timesTab element not found');
            return;
        }
        
        timesTab.classList.remove('hidden');
        
        // Проверим, есть ли уже содержимое в timesTab
        let timesList = document.getElementById('timesList');
        let addTimeBtn = document.getElementById('addTimeBtn');
        
        if (!timesList || !addTimeBtn) {
            console.log('Creating times tab content dynamically');
            
            // Очищаем содержимое timesTab
            timesTab.innerHTML = '';
            
            // Создаем заголовок и кнопку
            const header = document.createElement('div');
            header.className = 'flex justify-between items-center mb-4';
            
            const title = document.createElement('h3');
            title.className = 'text-lg font-medium text-white';
            title.textContent = 'Development Times';
            
            addTimeBtn = document.createElement('button');
            addTimeBtn.id = 'addTimeBtn';
            addTimeBtn.className = 'bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm';
            addTimeBtn.textContent = 'Add Time';
            addTimeBtn.addEventListener('click', () => this.showEditModal('time'));
            
            header.appendChild(title);
            header.appendChild(addTimeBtn);
            timesTab.appendChild(header);
            
            // Создаем список
            timesList = document.createElement('div');
            timesList.id = 'timesList';
            timesList.className = 'space-y-2';
            timesTab.appendChild(timesList);
        }

        timesList.innerHTML = '';
        
        // Асинхронная загрузка времен проявки
        const times = await loadDevelopmentTimes();
        Object.entries(times).forEach(([key, time]) => {
            const [film, developer, dilution, iso] = key.split('|');
            const timeItem = this.createTimeListItem(key, time, film, developer, dilution, iso);
            timesList.appendChild(timeItem);
        });
    }

    createListItem(id, item, type) {
        const div = document.createElement('div');
        div.className = 'bg-gray-700 rounded-lg p-4 flex justify-between items-center';
        
        const info = document.createElement('div');
        info.className = 'flex-1';
        
        const name = document.createElement('div');
        name.className = 'text-white font-medium';
        name.textContent = item.name;
        
        const details = document.createElement('div');
        details.className = 'text-gray-400 text-sm mt-1';
        
        if (type === 'film') {
            details.textContent = `${item.manufacturer} • ${item.description || ''} • ISO ${item.defaultISO || 'N/A'}`;
        } else if (type === 'developer') {
            details.textContent = `${item.manufacturer} • ${item.description || ''}`;
        }
        
        info.appendChild(name);
        info.appendChild(details);
        
        const actions = document.createElement('div');
        actions.className = 'flex gap-2';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => this.showEditModal(type, id, item));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => this.deleteItem(id, type));
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        div.appendChild(info);
        div.appendChild(actions);
        
        return div;
    }

    createTimeListItem(key, time, film, developer, dilution, iso) {
        const div = document.createElement('div');
        div.className = 'bg-gray-700 rounded-lg p-4 flex justify-between items-center';
        
        const info = document.createElement('div');
        info.className = 'flex-1';
        
        const filmName = FilmDevUtils.FILM_DATA[film]?.name || film;
        const developerName = FilmDevUtils.DEVELOPER_DATA[developer]?.name || developer;
        
        const name = document.createElement('div');
        name.className = 'text-white font-medium';
        name.textContent = `${filmName} + ${developerName}`;
        
        const details = document.createElement('div');
        details.className = 'text-gray-400 text-sm mt-1';
        details.textContent = `${dilution} • ISO ${iso} • ${this.formatTime(time)}`;
        
        info.appendChild(name);
        info.appendChild(details);
        
        const actions = document.createElement('div');
        actions.className = 'flex gap-2';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => this.showEditTimeModal(key, time, film, developer, dilution, iso));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => this.deleteItem(key, 'time'));
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        div.appendChild(info);
        div.appendChild(actions);
        
        return div;
    }

    showEditModal(type, id = null, item = null) {
        this.editingItem = { type, id, item };
        
        const modal = document.getElementById('editModal');
        const title = document.getElementById('editModalTitle');
        const form = document.getElementById('editForm');
        const deleteBtn = document.getElementById('deleteBtn');
        
        if (!modal || !title || !form) return;
        
        // Показываем модальное окно
        modal.classList.remove('hidden');
        
        // Устанавливаем заголовок
        const action = id ? 'Edit' : 'Add';
        title.textContent = `${action} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        
        // Показываем/скрываем кнопку удаления
        if (id) {
            deleteBtn.classList.remove('hidden');
        } else {
            deleteBtn.classList.add('hidden');
        }
        
        // Заполняем форму
        this.fillForm(type, id, item);
    }

    showEditTimeModal(key, time, film, developer, dilution, iso) {
        // Для времен проявки нужна специальная форма
        console.log('Edit time:', key, time, film, developer, dilution, iso);
        // TODO: Реализовать специальную форму для времен проявки
    }

    fillForm(type, id, item) {
        const idInput = document.getElementById('editId');
        const nameInput = document.getElementById('editName');
        const manufacturerInput = document.getElementById('editManufacturer');
        const descriptionInput = document.getElementById('editDescription');
        const defaultISOInput = document.getElementById('editDefaultISO');
        
        if (idInput) idInput.value = id || '';
        if (nameInput) nameInput.value = item?.name || '';
        if (manufacturerInput) manufacturerInput.value = item?.manufacturer || '';
        if (descriptionInput) descriptionInput.value = item?.description || '';
        if (defaultISOInput) defaultISOInput.value = item?.defaultISO || '';
        
        // Делаем ID readonly при редактировании
        if (idInput) {
            idInput.readOnly = !!id;
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            id: formData.get('editId'),
            name: formData.get('editName'),
            manufacturer: formData.get('editManufacturer'),
            description: formData.get('editDescription'),
            defaultISO: parseInt(formData.get('editDefaultISO')) || null
        };
        
        if (this.editingItem) {
            this.saveItem(this.editingItem.type, data);
        }
        
        this.closeEditModal();
    }

    saveItem(type, data) {
        console.log('Saving', type, data);
        
        // Обновляем данные в памяти
        if (type === 'film') {
            FilmDevUtils.FILM_DATA[data.id] = {
                name: data.name,
                manufacturer: data.manufacturer,
                type: 'black-white',
                description: data.description,
                defaultISO: data.defaultISO
            };
            // Сохраняем в localStorage
            this.saveToLocalStorage('customFilms', FilmDevUtils.FILM_DATA);
        } else if (type === 'developer') {
            FilmDevUtils.DEVELOPER_DATA[data.id] = {
                name: data.name,
                manufacturer: data.manufacturer,
                type: 'black-white',
                description: data.description
            };
            // Сохраняем в localStorage
            this.saveToLocalStorage('customDevelopers', FilmDevUtils.DEVELOPER_DATA);
        }
        
        // Перезагружаем текущую вкладку
        this.loadCurrentTab();
        
        // Обновляем селекты в основном интерфейсе
        this.updateMainInterface();
    }

    deleteItem(id, type) {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }
        
        console.log('Deleting', type, id);
        
        // Удаляем из данных в памяти
        if (type === 'film') {
            delete FilmDevUtils.FILM_DATA[id];
            // Сохраняем в localStorage
            this.saveToLocalStorage('customFilms', FilmDevUtils.FILM_DATA);
        } else if (type === 'developer') {
            delete FilmDevUtils.DEVELOPER_DATA[id];
            // Сохраняем в localStorage
            this.saveToLocalStorage('customDevelopers', FilmDevUtils.DEVELOPER_DATA);
        } else if (type === 'time') {
            // Удаление времен проявки не реализовано, так как они загружаются асинхронно
            console.warn('Time deletion not implemented for custom times.');
        }
        
        // Перезагружаем текущую вкладку
        this.loadCurrentTab();
        
        // Обновляем селекты в основном интерфейсе
        this.updateMainInterface();
    }

    closeEditModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.editingItem = null;
    }

    updateMainInterface() {
        // Обновляем селекты в основном интерфейсе
        // Это нужно будет реализовать в основном приложении
        if (window.app && window.app.ui) {
            window.app.ui.updateInputs(window.app.settings);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Сохранить данные в localStorage
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`Saved ${key} to localStorage`);
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    }
    
    // Загрузить данные из localStorage
    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            return null;
        }
    }
    
    // Загрузить все пользовательские пресеты
    loadCustomPresets() {
        const customFilms = this.loadFromLocalStorage('customFilms');
        const customDevelopers = this.loadFromLocalStorage('customDevelopers');
        const customTimes = this.loadFromLocalStorage('customTimes');
        
        if (customFilms) {
            Object.assign(FilmDevUtils.FILM_DATA, customFilms);
        }
        
        if (customDevelopers) {
            Object.assign(FilmDevUtils.DEVELOPER_DATA, customDevelopers);
        }
        
        if (customTimes) {
            // Object.assign(DEVELOPMENT_TIMES, customTimes); // Удалено
        }
        
        console.log('Loaded custom presets from localStorage');
    }
    
    // Очистить все пользовательские пресеты
    clearAllPresets() {
        if (!confirm('Are you sure you want to clear all custom presets? This action cannot be undone.')) {
            return;
        }
        
        // Удаляем из localStorage
        localStorage.removeItem('customFilms');
        localStorage.removeItem('customDevelopers');
        localStorage.removeItem('customTimes');
        
        // Перезагружаем страницу для сброса данных в памяти
        location.reload();
    }
} 