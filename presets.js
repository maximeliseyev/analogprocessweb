// Данные пресетов для калькулятора проявки плёнки
// Версия: 3.0.0 - Новая структура с зависимостью от комбинации плёнка+проявитель

// Базовая структура данных о плёнках
export const FILM_DATA = {
    // Ilford плёнки
    'ilford-hp5-plus': {
        name: 'Ilford HP5+',
        manufacturer: 'Ilford',
        type: 'black-white',
        description: 'Классическая чёрно-белая плёнка ISO 400',
        defaultISO: 400
    },
    'ilford-fp4-plus': {
        name: 'Ilford FP4+',
        manufacturer: 'Ilford',
        type: 'black-white',
        description: 'Мелкозернистая плёнка ISO 125',
        defaultISO: 125
    },
    'ilford-delta-400': {
        name: 'Ilford Delta 400 Professional',
        manufacturer: 'Ilford',
        type: 'black-white',
        description: 'Современная T-гранулярная плёнка',
        defaultISO: 400
    },
    'ilford-delta-100': {
        name: 'Ilford Delta 100 Professional',
        manufacturer: 'Ilford',
        type: 'black-white',
        description: 'Мелкозернистая T-гранулярная плёнка',
        defaultISO: 100
    },
    'ilford-delta-3200': {
        name: 'Ilford Delta 3200 Professional',
        manufacturer: 'Ilford',
        type: 'black-white',
        description: 'Высокочувствительная плёнка',
        defaultISO: 3200
    },
    'ilford-panf-plus': {
        name: 'Ilford PANF Plus',
        manufacturer: 'Ilford',
        type: 'black-white',
        description: 'Мелкозернистая плёнка ISO 50',
        defaultISO: 50
    },
    'ilford-sfx-200': {
        name: 'Ilford SFX 200',
        manufacturer: 'Ilford',
        type: 'black-white',
        description: 'Инфракрасная плёнка',
        defaultISO: 200
    },
    
    // Kodak
    'kodak-tri-x': {
        name: 'Kodak Tri-X 400',
        manufacturer: 'Kodak',
        type: 'black-white',
        description: 'Легендарная чёрно-белая плёнка',
        defaultISO: 400
    },
    'kodak-tmax-400': {
        name: 'Kodak T-Max 400',
        manufacturer: 'Kodak',
        type: 'black-white',
        description: 'Современная T-гранулярная плёнка',
        defaultISO: 400
    },
    'kodak-tmax-100': {
        name: 'Kodak T-Max 100',
        manufacturer: 'Kodak',
        type: 'black-white',
        description: 'Мелкозернистая T-гранулярная плёнка',
        defaultISO: 100
    },
    'kodak-double-x': {
        name: 'Kodak Double-X 5222',
        manufacturer: 'Kodak',
        type: 'black-white',
        description: 'Киноплёнка',
        defaultISO: 250
    },
    
    // Foma плёнки
    'foma-400': {
        name: 'Fomapan 400',
        manufacturer: 'Foma',
        type: 'black-white',
        description: 'Доступная альтернатива',
        defaultISO: 400
    },
    
    // Kentmere плёнки
    'kentmere-400': {
        name: 'Kentmere 400',
        manufacturer: 'Kentmere',
        type: 'black-white',
        description: 'Доступная плёнка от Harman',
        defaultISO: 400
    },
    
    // Другие плёнки
    'lucky-aerial-1023': {
        name: 'Lucky Aerial 1023',
        manufacturer: 'Lucky',
        type: 'black-white',
        description: 'Аэрофотоплёнка',
        defaultISO: 200
    },
    'lucky-shd-400': {
        name: 'Lucky SHD 400',
        manufacturer: 'Lucky',
        type: 'black-white',
        description: 'Чёрно-белая плёнка',
        defaultISO: 400
    },
    'orwo-un54': {
        name: 'ORWO UN54',
        manufacturer: 'ORWO',
        type: 'black-white',
        description: 'Киноплёнка',
        defaultISO: 100
    },
    'rollei-retro-80s': {
        name: 'Rollei Retro 80S',
        manufacturer: 'Rollei',
        type: 'black-white',
        description: 'Мелкозернистая плёнка',
        defaultISO: 80
    },
    'rollei-rpx400': {
        name: 'Rollei RPX400',
        manufacturer: 'Rollei',
        type: 'black-white',
        description: 'Чёрно-белая плёнка',
        defaultISO: 400
    },
    'shanghai-gp3-100': {
        name: 'Shanghai GP3 100',
        manufacturer: 'Shanghai',
        type: 'black-white',
        description: 'Китайская плёнка',
        defaultISO: 100
    },
    'tasma-aero-25l': {
        name: 'Tasma Aero Type-25L',
        manufacturer: 'Tasma',
        type: 'black-white',
        description: 'Аэрофотоплёнка',
        defaultISO: 200
    },
    'tasma-aero-42l': {
        name: 'Tasma Aero Type-42L',
        manufacturer: 'Tasma',
        type: 'black-white',
        description: 'Аэрофотоплёнка',
        defaultISO: 400
    },
    
    // Пользовательская плёнка
    'custom': {
        name: 'Пользовательская',
        manufacturer: 'Custom',
        type: 'custom',
        description: 'Настройка времени вручную',
        defaultISO: 400
    }
};

// Базовая структура данных о проявителях
export const DEVELOPER_DATA = {
    // Ilford проявители
    'ilford-id11': {
        name: 'Ilford ID-11',
        manufacturer: 'Ilford',
        type: 'powder',
        description: 'Стандартный порошковый проявитель',
        defaultDilution: '1+1'
    },
    'ilford-ddx': {
        name: 'Ilford DD-X',
        manufacturer: 'Ilford',
        type: 'liquid',
        description: 'Жидкий концентрированный проявитель',
        defaultDilution: '1+4'
    },
    'ilford-hc': {
        name: 'Ilford HC',
        manufacturer: 'Ilford',
        type: 'liquid',
        description: 'Высококонтрастный проявитель',
        defaultDilution: '1+31'
    },
    'ilford-lc29': {
        name: 'Ilford LC29',
        manufacturer: 'Ilford',
        type: 'liquid',
        description: 'Жидкий проявитель',
        defaultDilution: '1+9'
    },
    'ilford-ilfosol-3': {
        name: 'Ilford Ilfosol 3',
        manufacturer: 'Ilford',
        type: 'liquid',
        description: 'Жидкий проявитель',
        defaultDilution: '1+9'
    },
    
    // Kodak проявители
    'kodak-d76': {
        name: 'Kodak D-76',
        manufacturer: 'Kodak',
        type: 'powder',
        description: 'Классический порошковый проявитель',
        defaultDilution: '1+1'
    },
    'kodak-hc110': {
        name: 'Kodak HC-110',
        manufacturer: 'Kodak',
        type: 'liquid',
        description: 'Универсальный жидкий проявитель',
        defaultDilution: '1+31'
    },
    'kodak-xtol': {
        name: 'Kodak XTOL',
        manufacturer: 'Kodak',
        type: 'powder',
        description: 'Современный порошковый проявитель',
        defaultDilution: 'stock'
    },
    'kodak-tmax': {
        name: 'Kodak T-Max',
        manufacturer: 'Kodak',
        type: 'liquid',
        description: 'Проявитель для плёнок c плоским зерном',
        defaultDilution: '1+4'
    },
    
    // Другие проявители
    'rodinal': {
        name: 'Rodinal',
        manufacturer: 'Adox',
        type: 'liquid',
        description: 'Высококонтрастный жидкий проявитель',
        defaultDilution: '1+25'
    },
    'microphen': {
        name: 'Microphen',
        manufacturer: 'Ilford',
        type: 'powder',
        description: 'Порошковый проявитель',
        defaultDilution: '1+1'
    },
    'perceptol': {
        name: 'Perceptol',
        manufacturer: 'Ilford',
        type: 'powder',
        description: 'Мелкозернистый проявитель',
        defaultDilution: '1+1'
    },
    
    // Пользовательский проявитель
    'custom': {
        name: 'Пользовательский',
        manufacturer: 'Custom',
        type: 'custom',
        description: 'Настройка множителя вручную',
        defaultDilution: 'custom'
    }
};

// Основная база данных времени проявки
// Структура: filmKey -> developerKey -> dilution -> iso -> timeInSeconds
export const DEVELOPMENT_TIMES = {
    // Ilford HP5+ данные
    'ilford-hp5-plus': {
        'ilford-id11': {
            'stock': { 400: 420 },
            '1+1': { 400: 540 },
            '1+3': { 400: 720 }
        },
        'ilford-ddx': {
            '1+4': { 400: 480 },
            '1+9': { 400: 600 }
        },
        'ilford-hc': {
            '1+15': { 400: 450 },
            '1+31': { 400: 540 }
        },
        'ilford-lc29': {
            '1+9': { 400: 480 },
            '1+19': { 400: 600 },
            '1+29': { 400: 720 }
        },
        'ilford-ilfosol-3': {
            '1+9': { 400: 420 },
            '1+14': { 400: 540 }
        },
        'kodak-d76': {
            'stock': { 400: 420 },
            '1+1': { 400: 540 },
            '1+3': { 400: 720 }
        },
        'kodak-xtol': {
            'stock': { 400: 480, 800: 660 },
            '1+1': { 400: 720, 1600: 1320 },
            '1+2': { 400: 900 },
            '1+3': { 400: 1080 }
        },
        'kodak-hc110': {
            'A 1+15': { 400: 450 },
            'B 1+31': { 400: 540 },
            'E 1+47': { 400: 720 }
        },
        'rodinal': {
            '1+25': { 400: 360 },
            '1+50': { 400: 480 }
        },
        'microphen': {
            'stock': { 400: 390, 800: 540 },
            '1+1': { 400: 480, 800: 660 },
            '1+3': { 400: 600, 800: 780 }
        },
        'perceptol': {
            'stock': { 400: 540 },
            '1+1': { 400: 720 },
            '1+3': { 400: 900 }
        }
    },
    
    // Ilford FP4+ данные
    'ilford-fp4-plus': {
        'ilford-id11': {
            'stock': { 125: 360 },
            '1+1': { 125: 480 },
            '1+3': { 125: 600 }
        },
        'ilford-ddx': {
            '1+4': { 125: 300 },
            '1+9': { 125: 420 }
        },
        'ilford-hc': {
            '1+15': { 125: 330 },
            '1+31': { 125: 420 }
        },
        'ilford-lc29': {
            '1+9': { 125: 360 },
            '1+19': { 125: 480 },
            '1+29': { 125: 600 }
        },
        'ilford-ilfosol-3': {
            '1+9': { 125: 300 },
            '1+14': { 125: 420 }
        },
        'kodak-d76': {
            'stock': { 125: 360 },
            '1+1': { 125: 480 },
            '1+3': { 125: 600 }
        },
        'kodak-xtol': {
            'stock': { 125: 330, 500: 900 },
            '1+1': { 125: 420, 500: 1080 },
            '1+2': { 125: 540 },
            '1+3': { 125: 660 }
        },
        'kodak-hc110': {
            'A 1+15': { 125: 330 },
            'B 1+31': { 125: 420 },
            'E 1+47': { 125: 540 }
        },
        'rodinal': {
            '1+25': { 125: 300 },
            '1+50': { 125: 420 }
        },
        'microphen': {
            'stock': { 125: 330 },
            '1+1': { 125: 420 },
            '1+3': { 125: 540 }
        },
        'perceptol': {
            'stock': { 125: 480 },
            '1+1': { 125: 600 },
            '1+3': { 125: 780 }
        }
    },
    
    // Ilford Delta 400 данные
    'ilford-delta-400': {
        'ilford-id11': {
            'stock': { 400: 390 },
            '1+1': { 400: 510 },
            '1+3': { 400: 690 }
        },
        'ilford-ddx': {
            '1+4': { 400: 450 },
            '1+9': { 400: 570 }
        },
        'ilford-hc': {
            '1+15': { 400: 420 },
            '1+31': { 400: 510 }
        },
        'ilford-lc29': {
            '1+9': { 400: 420 },
            '1+19': { 400: 540 },
            '1+29': { 400: 660 }
        },
        'ilford-ilfosol-3': {
            '1+9': { 400: 390 },
            '1+14': { 400: 510 }
        },
        'kodak-d76': {
            'stock': { 400: 390 },
            '1+1': { 400: 510 },
            '1+3': { 400: 690 }
        },
        'kodak-xtol': {
            'stock': { 400: 450, 800: 630 },
            '1+1': { 400: 570, 800: 750 },
            '1+2': { 400: 720 },
            '1+3': { 400: 870 }
        },
        'kodak-hc110': {
            'A 1+15': { 400: 420 },
            'B 1+31': { 400: 510 },
            'E 1+47': { 400: 690 }
        },
        'rodinal': {
            '1+25': { 400: 330 },
            '1+50': { 400: 450 }
        },
        'microphen': {
            'stock': { 400: 360, 800: 510 },
            '1+1': { 400: 450, 800: 630 },
            '1+3': { 400: 570, 800: 750 }
        },
        'perceptol': {
            'stock': { 400: 510 },
            '1+1': { 400: 630 },
            '1+3': { 400: 810 }
        }
    },
    
    // Ilford Delta 100 данные
    'ilford-delta-100': {
        'ilford-id11': {
            'stock': { 100: 300 },
            '1+1': { 100: 420 },
            '1+3': { 100: 540 }
        },
        'ilford-ddx': {
            '1+4': { 100: 270 },
            '1+9': { 100: 390 }
        },
        'ilford-hc': {
            '1+15': { 100: 300 },
            '1+31': { 100: 390 }
        },
        'ilford-lc29': {
            '1+9': { 100: 300 },
            '1+19': { 100: 420 },
            '1+29': { 100: 540 }
        },
        'ilford-ilfosol-3': {
            '1+9': { 100: 270 },
            '1+14': { 100: 390 }
        },
        'kodak-d76': {
            'stock': { 100: 300 },
            '1+1': { 100: 420 },
            '1+3': { 100: 540 }
        },
        'kodak-xtol': {
            'stock': { 100: 270, 200: 390 },
            '1+1': { 100: 390, 200: 510 },
            '1+2': { 100: 510 },
            '1+3': { 100: 630 }
        },
        'kodak-hc110': {
            'A 1+15': { 100: 300 },
            'B 1+31': { 100: 390 },
            'E 1+47': { 100: 510 }
        },
        'rodinal': {
            '1+25': { 100: 240 },
            '1+50': { 100: 360 }
        },
        'microphen': {
            'stock': { 100: 270 },
            '1+1': { 100: 390 },
            '1+3': { 100: 510 }
        },
        'perceptol': {
            'stock': { 100: 420 },
            '1+1': { 100: 540 },
            '1+3': { 100: 660 }
        }
    },
    
    // Ilford Delta 3200 данные
    'ilford-delta-3200': {
        'ilford-id11': {
            'stock': { 3200: 450 },
            '1+1': { 3200: 600 },
            '1+3': { 3200: 780 }
        },
        'ilford-ddx': {
            '1+4': { 3200: 510 },
            '1+9': { 3200: 630 }
        },
        'ilford-hc': {
            '1+15': { 3200: 480 },
            '1+31': { 3200: 570 }
        },
        'ilford-lc29': {
            '1+9': { 3200: 480 },
            '1+19': { 3200: 600 },
            '1+29': { 3200: 720 }
        },
        'ilford-ilfosol-3': {
            '1+9': { 3200: 450 },
            '1+14': { 3200: 570 }
        },
        'kodak-d76': {
            'stock': { 3200: 450 },
            '1+1': { 3200: 600 },
            '1+3': { 3200: 780 }
        },
        'kodak-xtol': {
            'stock': { 3200: 450, 6400: 2700 },
            '1+1': { 3200: 600, 1600: 720, 6400: 3600 },
            '1+2': { 3200: 750 },
            '1+3': { 3200: 900 }
        },
        'kodak-hc110': {
            'A 1+15': { 3200: 480 },
            'B 1+31': { 3200: 570 },
            'E 1+47': { 3200: 750 }
        },
        'rodinal': {
            '1+25': { 3200: 420 },
            '1+50': { 3200: 540 }
        },
        'microphen': {
            'stock': { 3200: 420, 6400: 2400 },
            '1+1': { 3200: 540, 6400: 3000 },
            '1+3': { 3200: 660, 6400: 3600 }
        },
        'perceptol': {
            'stock': { 3200: 600 },
            '1+1': { 3200: 720 },
            '1+3': { 3200: 900 }
        }
    },
    
    // Данные из CSV файла
    'foma-400': {
        'microphen': {
            'stock': { 400: 540 }
        },
        'kodak-xtol': {
            'stock': { 400: 480 },
            '1+1': { 1600: 1320 }
        }
    },
    
    'kodak-tri-x': {
        'kodak-xtol': {
            'stock': { 400: 420 },
            '1+1': { 400: 540, 800: 720 }
        }
    },
    
    'kodak-double-x': {
        'd-76': {
            'stock': { 250: 420 }
        },
        'microphen': {
            'stock': { 800: 600 }
        },
        'kodak-xtol': {
            'stock': { 250: 420, 400: 540, 800: 720 }
        }
    },
    
    'kentmere-400': {
        'kodak-xtol': {
            'stock': { 400: 540, 800: 630 },
            '1+1': { 400: 720 }
        }
    },
    
    'lucky-aerial-1023': {
        'kodak-xtol': {
            'stock': { 200: 480 },
            '1+1': { 200: 540, 400: 720 }
        }
    },
    
    'lucky-shd-400': {
        'kodak-xtol': {
            'stock': { 400: 360 }
        }
    },
    
    'orwo-un54': {
        'kodak-xtol': {
            'stock': { 100: 360 }
        }
    },
    
    'rollei-retro-80s': {
        'kodak-xtol': {
            '1+1': { 400: 1440 }
        }
    },
    
    'rollei-rpx400': {
        'kodak-xtol': {
            'stock': { 400: 540 }
        }
    },
    
    'shanghai-gp3-100': {
        'kodak-xtol': {
            '1+1': { 80: 390, 100: 480, 200: 640, 400: 780 }
        },
        'microphen': {
            '1+1': { 100: 420 }
        }
    },
    
    'tasma-aero-25l': {
        'microphen': {
            'stock': { 200: 420, 400: 820 }
        },
        'kodak-d76': {
            'stock': { 200: 420, 400: 720 },
            '1+1': { 200: 780, 400: 1200 }
        },
        'rodinal': {
            '1+50': { 100: 420, 200: 540 }
        },
        'kodak-xtol': {
            'stock': { 400: 720 }
        }
    },
    
    'tasma-aero-42l': {
        'kodak-xtol': {
            'stock': { 400: 420, 800: 540 }
        }
    }
};

// Температурные коэффициенты на основе официальных данных Ilford
export const TEMPERATURE_MULTIPLIERS = {
    14: 1.8,  // +80% времени
    15: 1.6,  // +60% времени
    16: 1.4,  // +40% времени
    17: 1.25, // +25% времени
    18: 1.1,  // +10% времени
    19: 1.05, // +5% времени
    20: 1.0,  // Стандартная температура (базовая)
    21: 0.95, // -5% времени
    22: 0.85, // -15% времени
    23: 0.75, // -25% времени
    24: 0.65, // -35% времени
    25: 0.55  // -45% времени
};

// Функции для работы с новой структурой данных
export const FilmDevUtils = {
    // Получить все плёнки по производителю
    getFilmsByManufacturer(manufacturer) {
        return Object.entries(FILM_DATA)
            .filter(([key, film]) => film.manufacturer === manufacturer)
            .reduce((acc, [key, film]) => {
                acc[key] = film;
                return acc;
            }, {});
    },
    
    // Получить все проявители по типу
    getDevelopersByType(type) {
        return Object.entries(DEVELOPER_DATA)
            .filter(([key, developer]) => developer.type === type)
            .reduce((acc, [key, developer]) => {
                acc[key] = developer;
                return acc;
            }, {});
    },
    
    // Получить доступные разведения для комбинации плёнка+проявитель
    getAvailableDilutions(filmKey, developerKey) {
        const filmData = DEVELOPMENT_TIMES[filmKey];
        if (!filmData) return [];
        
        const developerData = filmData[developerKey];
        if (!developerData) return [];
        
        return Object.keys(developerData);
    },
    
    // Получить доступные ISO для комбинации плёнка+проявитель+разведение
    getAvailableISOs(filmKey, developerKey, dilution) {
        const filmData = DEVELOPMENT_TIMES[filmKey];
        if (!filmData) return [];
        
        const developerData = filmData[developerKey];
        if (!developerData) return [];
        
        const dilutionData = developerData[dilution];
        if (!dilutionData) return [];
        
        return Object.keys(dilutionData).map(iso => parseInt(iso)).sort((a, b) => a - b);
    },
    
    // Получить базовое время для комбинации
    getBaseTime(filmKey, developerKey, dilution, iso) {
        const filmData = DEVELOPMENT_TIMES[filmKey];
        if (!filmData) return null;
        
        const developerData = filmData[developerKey];
        if (!developerData) return null;
        
        const dilutionData = developerData[dilution];
        if (!dilutionData) return null;
        
        return dilutionData[iso] || null;
    },
    
    // Рассчитать время с учётом температуры
    calculateTime(filmKey, developerKey, dilution, iso, temperature) {
        const baseTime = this.getBaseTime(filmKey, developerKey, dilution, iso);
        if (baseTime === null) return null;
        
        const tempMultiplier = TEMPERATURE_MULTIPLIERS[temperature] || 1.0;
        return Math.round(baseTime * tempMultiplier);
    },
    
    // Получить информацию о комбинации
    getCombinationInfo(filmKey, developerKey, dilution, iso, temperature) {
        const film = FILM_DATA[filmKey];
        const developer = DEVELOPER_DATA[developerKey];
        const baseTime = this.getBaseTime(filmKey, developerKey, dilution, iso);
        const calculatedTime = this.calculateTime(filmKey, developerKey, dilution, iso, temperature);
        const tempMultiplier = TEMPERATURE_MULTIPLIERS[temperature] || 1.0;
        
        return {
            film,
            developer,
            dilution,
            iso,
            temperature,
            baseTime,
            calculatedTime,
            tempMultiplier,
            formattedTime: calculatedTime ? this.formatTime(calculatedTime) : 'Н/Д',
            hasData: baseTime !== null
        };
    },
    
    // Форматировать время в MM:SS
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Получить рекомендуемые комбинации
    getRecommendedCombinations() {
        return [
            { film: 'ilford-hp5-plus', developer: 'ilford-id11', description: 'Классическая комбинация' },
            { film: 'ilford-hp5-plus', developer: 'kodak-xtol', description: 'Современный проявитель' },
            { film: 'kodak-tri-x', developer: 'kodak-d76', description: 'Классическая комбинация' },
            { film: 'ilford-delta-100', developer: 'ilford-ddx', description: 'Мелкозернистая комбинация' },
            { film: 'ilford-delta-400', developer: 'kodak-xtol', description: 'T-гранулярная плёнка' }
        ];
    },
    
    // Поиск ближайшего доступного времени
    findNearestTime(filmKey, developerKey, dilution, targetISO) {
        const availableISOs = this.getAvailableISOs(filmKey, developerKey, dilution);
        if (availableISOs.length === 0) return null;
        
        // Найти ближайший ISO
        let nearestISO = availableISOs[0];
        let minDiff = Math.abs(nearestISO - targetISO);
        
        for (const iso of availableISOs) {
            const diff = Math.abs(iso - targetISO);
            if (diff < minDiff) {
                minDiff = diff;
                nearestISO = iso;
            }
        }
        
        return {
            iso: nearestISO,
            time: this.getBaseTime(filmKey, developerKey, dilution, nearestISO)
        };
    }
};

// Экспорт для обратной совместимости (устаревшие пресеты)
export const FILM_PRESETS = FILM_DATA;
export const DEVELOPER_PRESETS = DEVELOPER_DATA;
export const PresetUtils = FilmDevUtils;

// Экспорт по умолчанию для обратной совместимости
export default {
    FILM_DATA,
    DEVELOPER_DATA,
    DEVELOPMENT_TIMES,
    TEMPERATURE_MULTIPLIERS,
    FilmDevUtils,
    // Устаревшие экспорты для совместимости
    FILM_PRESETS,
    DEVELOPER_PRESETS,
    PresetUtils
}; 