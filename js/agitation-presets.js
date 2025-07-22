// Предустановленные режимы ажитации для проявки плёнки
// Каждый режим — массив этапов (шагов)
// Поддержка подсказок, количества оборотов, повторов, специальных правил

export const AGITATION_PRESETS = {
  orwo: [
    { label: '1-я минута', agitate: 45, rest: 15, repeat: 1, turns: null, note: 'Непрерывная ажитация 45 сек, затем 15 сек отдых' },
    { label: '2-я минута и далее', agitate: 15, rest: 45, repeat: 'auto', turns: null, note: '15 сек ажитация, 45 сек отдых' },
    { label: 'Последняя минута', agitate: 45, rest: 15, repeat: 1, turns: null, note: 'Непрерывная ажитация 45 сек, затем 15 сек отдых' }
  ],
  'kodak-xtol': [
    { label: 'Весь процесс', agitate: 5, rest: 25, repeat: 'auto', turns: 7, note: '7 оборотов бачка за 5 секунд, затем 25 сек отдых' }
  ],
  rae: [
    { label: '1-я минута', agitate: 60, rest: 0, repeat: 1, turns: null, note: 'Непрерывная ажитация' },
    { label: '2-я минута', agitate: 5, rest: 5, repeat: 6, turns: 1, note: '1 оборот каждые 10 секунд' },
    { label: '3-я минута', agitate: 5, rest: 25, repeat: 2, turns: 1, note: '1 оборот в начале каждой 30-секундки' },
    { label: '4-5 минуты', agitate: 5, rest: 55, repeat: 2, turns: 1, note: '1 оборот в начале каждой минуты' },
    { label: '7-я минута', agitate: 5, rest: 55, repeat: 1, turns: 1, note: '1 оборот' },
    { label: '10-я минута', agitate: 5, rest: 55, repeat: 1, turns: 1, note: '1 оборот' },
    { label: 'Каждые 5 минут после 10-й', agitate: 5, rest: 295, repeat: 'auto', startMinute: 15, turns: 1, note: '1 оборот' }
  ],
  none: [],
  custom: []
};

export const AGITATION_PRESET_DESCRIPTIONS = {
  orwo: 'ORWO: 1-я минута — 45 сек непрерывная ажитация, 15 сек отдых; далее 15 сек ажитация, 45 сек отдых; последняя минута — 45 сек ажитация, 15 сек отдых.',
  'kodak-xtol': 'Kodak Xtol: 7 оборотов бачка за 5 секунд, затем 25 сек отдых, повторять весь процесс.',
  rae: 'RAE: 1-я минута — непрерывно; 2-я — каждые 10 сек; 3-я — 2 раза; 4-5 — по 1 разу; далее — 1 раз на 7, 10, 15, 20, 25 и т.д. минутах.',
  none: 'Без ажитации: подходит для stand development или ручных схем.',
  custom: 'Пользовательский режим: настройте интервалы и количество оборотов вручную.'
}; 