// script.js
(() => {
  const commonZones = [
    'Europe/Madrid',
    'Europe/London',
    'America/New_York',
    'America/Sao_Paulo',
    'America/Mexico_City',
    'America/Bogota',
    'Asia/Madrid', // note: invalid intentionally — kept for examples (we'll validate)
    'Asia/Tokyo',
    'Asia/Dubai',
    'Australia/Sydney',
    'Pacific/Auckland'
  ].filter(Boolean);

  const tzSelect = document.getElementById('tz-select');
  const tzCustom = document.getElementById('tz-custom');
  const addBtn = document.getElementById('add-btn');
  const clocksContainer = document.getElementById('clocks');

  // Populate select with validated common zones
  function safePushOption(selectEl, tz) {
    try {
      new Intl.DateTimeFormat('es-ES', { timeZone: tz }).format();
      const opt = document.createElement('option');
      opt.value = tz;
      opt.textContent = tz.replace('_', ' ');
      selectEl.appendChild(opt);
    } catch (e) {
      // ignore invalid time zones
    }
  }
  commonZones.forEach(tz => safePushOption(tzSelect, tz));

  // Data structure for clocks
  const clocks = [];

  function formatForTimeZone(date, timeZone) {
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone };
    const dateOptions = { year: 'numeric', month: 'short', day: '2-digit', timeZone };
    return {
      time: new Intl.DateTimeFormat('es-ES', timeOptions).format(date),
      date: new Intl.DateTimeFormat('es-ES', dateOptions).format(date)
    };
  }

  function createCard(tz) {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-tz', tz);

    const title = document.createElement('div');
    title.className = 'tz-name';
    title.textContent = tz;

    const timeEl = document.createElement('div');
    timeEl.className = 'time';
    timeEl.textContent = '--:--:--';

    const dateEl = document.createElement('div');
    dateEl.className = 'date';
    dateEl.textContent = '';

    const actions = document.createElement('div');
    actions.className = 'actions';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Eliminar';
    removeBtn.addEventListener('click', () => removeClock(tz));

    actions.appendChild(removeBtn);

    card.appendChild(title);
    card.appendChild(timeEl);
    card.appendChild(dateEl);
    card.appendChild(actions);

    return { card, timeEl, dateEl };
  }

  function addClock(tz) {
    // avoid duplicates
    if (clocks.some(c => c.tz === tz)) return;
    try {
      // validation
      new Intl.DateTimeFormat('es-ES', { timeZone: tz }).format();
    } catch (e) {
      alert('Zona horaria no válida. Usa una zona IANA, por ejemplo: Europe/Madrid');
      return;
    }
    const { card, timeEl, dateEl } = createCard(tz);
    clocksContainer.appendChild(card);
    clocks.push({ tz, timeEl, dateEl, node: card });
    updateClocks(); // update immediately
  }

  function removeClock(tz) {
    const idx = clocks.findIndex(c => c.tz === tz);
    if (idx === -1) return;
    const removed = clocks.splice(idx, 1)[0];
    removed.node.remove();
  }

  function updateClocks() {
    const now = new Date();
    clocks.forEach(c => {
      try {
        const formatted = formatForTimeZone(now, c.tz);
        c.timeEl.textContent = formatted.time;
        c.dateEl.textContent = formatted.date;
      } catch (e) {
        // if the timezone becomes invalid for some reason, remove it
        c.node.querySelector('.time').textContent = '—';
      }
    });
  }

  // One interval to update all clocks each second
  setInterval(updateClocks, 1000);

  // Add default zones
  const initialZones = ['Europe/Madrid', 'America/New_York', 'Asia/Tokyo'];
  initialZones.forEach(addClock);

  // UI handlers
  addBtn.addEventListener('click', () => {
    const custom = tzCustom.value.trim();
    const selected = tzSelect.value;
    const tz = custom || selected;
    if (!tz) return;
    addClock(tz);
    tzCustom.value = '';
  });

  // Allow pressing Enter in the custom input to add
  tzCustom.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addBtn.click();
  });

  // Expose for debugging (optional)
  window.__worldClocks = { addClock, removeClock, clocks };
})();