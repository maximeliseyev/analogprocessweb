let baseMinutes = 7;
let baseSeconds = 0;
let coefficient = 1.33;
let isPush = true;
let steps = 3;
let activeTimers = new Map();
let timerInterval;
let remainingTime = 0;
let totalTime = 0;
let isTimerRunning = false;

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  registerServiceWorker();
});

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('filmDevSettings'));
  if (settings) {
    baseMinutes = settings.baseMinutes || 7;
    baseSeconds = settings.baseSeconds || 0;
    coefficient = settings.coefficient || 1.33;
    isPush = settings.isPush !== false;
    steps = settings.steps || 3;
    updateUI();
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('SW registered'))
      .catch((err) => console.error('SW registration failed:', err));
  }
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function toggleTimer(timeInSeconds, label) {
    totalTime = timeInSeconds;
    remainingTime = timeInSeconds;
    
    document.getElementById('timerTitle').textContent = label;
    document.getElementById('timerDisplay').textContent = formatTime(remainingTime);
    document.getElementById('progressBar').style.width = '100%';
    
    document.getElementById('timerScreen').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    
    stopAllTimers();
}

function startTimer() {
    if (isTimerRunning) return;
    
    isTimerRunning = true;
    document.getElementById('startPauseButton').textContent = 'Пауза';
    
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        
        if (remainingTime <= 0) {
            timerComplete();
        }
    }, 1000);
}

function pauseTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    document.getElementById('startPauseButton').textContent = 'Старт';
}

function resetTimer() {
    pauseTimer();
    remainingTime = totalTime;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    document.getElementById('timerDisplay').textContent = formatTime(remainingTime);
    const progressPercent = (remainingTime / totalTime) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
}

function timerComplete() {
    pauseTimer();
    document.getElementById('timerDisplay').textContent = "Готово!";
    
    if (navigator.vibrate) {
        navigator.vibrate([1000, 500, 1000]);
    }
    
    if (Notification.permission === 'granted') {
        new Notification('Проявка завершена!', {
            body: document.getElementById('timerTitle').textContent,
            icon: '/icons/icon-192x192.png'
        });
    }
}

function stopAllTimers() {
    pauseTimer();
    activeTimers.forEach(timer => {
        clearInterval(timer.interval);
    });
    activeTimers.clear();
}

document.getElementById('startPauseButton').addEventListener('click', () => {
    if (isTimerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

document.getElementById('resetButton').addEventListener('click', resetTimer);

document.getElementById('backButton').addEventListener('click', () => {
    document.getElementById('timerScreen').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    pauseTimer();
});

function renderResults() {
    const times = calculateTimes();
    resultsContainer.innerHTML = '';
    
    times.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-info">
                <div class="result-label">${item.label}</div>
                <div class="result-time">${formatTime(item.time)}</div>
            </div>
            <button class="timer-btn" onclick="toggleTimer(${item.time}, '${item.label}')">
                <span class="timer-icon">⏱</span>
                <span>Таймер</span>
            </button>
        `;
        resultsContainer.appendChild(resultItem);
    });
    
    results.style.display = 'block';
}