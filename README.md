# Film Develop Calculator

A modern web application for calculating film development times with support for push/pull processing and multiple development steps.

## 🇺🇸 English

### Overview

Film Develop Calculator is a comprehensive tool designed for film photographers to calculate development times based on film-developer combinations, temperature adjustments, and processing techniques.

### Features

- **📊 Database Integration**: Built-in database of films, developers, and development times
- **🌡️ Temperature Compensation**: Automatic time adjustment based on development temperature
- **⚡ Push/Pull Processing**: Support for push and pull development techniques
- **📈 Multi-step Development**: Calculate times for multiple development steps
- **⏱️ Built-in Timer**: Integrated timer for development process
- **🌐 Localization**: Full support for English and Russian languages
- **📱 Modern UI**: iOS-inspired design with dark theme and glassmorphism effects

### How to Use

1. **Select Film**: Choose your film from the database or use manual input
2. **Choose Developer**: Select the developer you'll be using
3. **Set Dilution**: Choose the dilution ratio (stock, 1+1, 1+3, etc.)
4. **Set ISO/EI**: Select the film speed you're developing for
5. **Adjust Temperature**: Choose the development temperature (affects time calculation)
6. **Set Base Time**: The app will automatically calculate base time from database, or you can set it manually
7. **Choose Process**: Select Push (extend development) or Pull (reduce development)
8. **Set Steps**: Choose how many development steps you want to calculate
9. **Calculate**: Click "Calculate" to get development times for all steps
10. **Use Timer**: Click "Timer" on any result to start a countdown timer

### Key Concepts

- **Base Time**: Standard development time for the film-developer combination
- **Push Processing**: Extends development time to increase contrast and film speed
- **Pull Processing**: Reduces development time to decrease contrast and film speed
- **Temperature Multiplier**: Automatic adjustment based on development temperature
- **Step Calculation**: Each step applies the coefficient to the previous time

### Technologies

- **React 18** with TypeScript
- **Tailwind CSS** with DaisyUI
- **Modern UI/UX** with glassmorphism and iOS-inspired design
- **Local Storage** for settings persistence
- **Service Worker** for offline functionality

---

## 🇷🇺 Русский

### Обзор

Калькулятор проявки плёнки — это комплексный инструмент, разработанный для фотографов-пленочников для расчёта времени проявки на основе комбинаций плёнка-проявитель, температурных корректировок и техник обработки.

### Возможности

- **📊 Интеграция с базой данных**: Встроенная база данных плёнок, проявителей и времён проявки
- **🌡️ Температурная компенсация**: Автоматическая корректировка времени в зависимости от температуры проявки
- **⚡ Push/Pull обработка**: Поддержка техник push и pull проявки
- **📈 Многоступенчатая проявка**: Расчёт времени для нескольких ступеней проявки
- **⏱️ Встроенный таймер**: Интегрированный таймер для процесса проявки
- **🌐 Локализация**: Полная поддержка английского и русского языков
- **📱 Современный интерфейс**: Дизайн в стиле iOS с тёмной темой и эффектами стекла

### Как использовать

1. **Выберите плёнку**: Выберите плёнку из базы данных или используйте ручной ввод
2. **Выберите проявитель**: Выберите проявитель, который будете использовать
3. **Установите разведение**: Выберите соотношение разведения (stock, 1+1, 1+3, etc.)
4. **Установите ISO/EI**: Выберите светочувствительность плёнки
5. **Отрегулируйте температуру**: Выберите температуру проявки (влияет на расчёт времени)
6. **Установите базовое время**: Приложение автоматически рассчитает базовое время из базы данных, или вы можете установить его вручную
7. **Выберите процесс**: Выберите Push (увеличить время проявки) или Pull (уменьшить время проявки)
8. **Установите ступени**: Выберите количество ступеней проявки для расчёта
9. **Рассчитайте**: Нажмите "Рассчитать" для получения времён проявки для всех ступеней
10. **Используйте таймер**: Нажмите "Таймер" на любом результате для запуска обратного отсчёта

### Ключевые концепции

- **Базовое время**: Стандартное время проявки для комбинации плёнка-проявитель
- **Push обработка**: Увеличивает время проявки для повышения контраста и светочувствительности плёнки
- **Pull обработка**: Уменьшает время проявки для снижения контраста и светочувствительности плёнки
- **Температурный множитель**: Автоматическая корректировка на основе температуры проявки
- **Расчёт ступеней**: Каждая ступень применяет коэффициент к предыдущему времени

### Технологии

- **React 18** с TypeScript
- **Tailwind CSS** с DaisyUI
- **Современный UI/UX** с эффектами стекла и дизайном в стиле iOS
- **Local Storage** для сохранения настроек
- **Service Worker** для офлайн функциональности

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📱 Features in Detail

### Database Integration
The app includes a comprehensive database of:
- **Films**: Ilford, Kodak, Foma, Kentmere, and other brands
- **Developers**: D-76, ID-11, DD-X, HC-110, and many more
- **Development Times**: Pre-calculated times for various film-developer combinations
- **Temperature Multipliers**: Automatic adjustments for different temperatures

### Timer Functionality
- **Visual Progress**: Circular progress indicator
- **Pause/Resume**: Full control over timer
- **Reset**: Start over at any time
- **Completion Alerts**: Visual and audio feedback

### Modern Design
- **Dark Theme**: Easy on the eyes for darkroom use
- **Glassmorphism**: Modern glass-like effects
- **Responsive**: Works on desktop and mobile devices
- **Accessibility**: High contrast and readable fonts

---

## 🚀 Deployment

### GitHub Pages

This project is automatically deployed to GitHub Pages using GitHub Actions.

#### Setup Instructions:

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"

2. **Push to main branch** - the workflow will automatically:
   - Build the project
   - Run tests
   - Deploy to GitHub Pages

3. **Access your app** at: `https://maximeliseyev.github.io/filmdevcalculator`

#### Manual Deployment:

```bash
# Build the project
npm run build

# The build folder contains the production files
# You can deploy these files to any static hosting service
```

### GitHub Actions Workflows

The project includes two workflows:

- **`deploy.yml`**: Builds and deploys to GitHub Pages
- **`test.yml`**: Runs tests and generates coverage reports

Both workflows trigger on:
- Push to `main` branch
- Pull requests to `main` branch

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
