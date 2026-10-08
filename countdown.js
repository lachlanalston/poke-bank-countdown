// Pokémon Bank / Poké Transporter end of service.
// Nintendo AU: Friday 26 February 2027, 2:00 pm AEDT (UTC+11) == 03:00 UTC.
// Single source of truth for the deadline:
const DEADLINE = Date.UTC(2027, 1, 26, 3, 0, 0); // month is 0-indexed

const el = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  boxes: document.getElementById('boxes'),
  sr: document.getElementById('countdown-sr'),
  local: document.getElementById('local-time'),
  vault: document.querySelector('.vault'),
  verb: document.querySelector('.hero__verb'),
};

const pad = (n) => String(n).padStart(2, '0');

// The tab is narrow, so the title leads with the single useful number and
// keeps the name short enough to survive truncation: "140d · Pokémon Bank".
const TITLE = 'Pokémon Bank';
let lastTitleLeft = null;

function setTitle(left) {
  if (left === lastTitleLeft) return;
  lastTitleLeft = left;
  document.title = left ? `${left} · ${TITLE}` : TITLE;
}

// Show the deadline in the visitor's own timezone, so nobody has to do
// timezone maths on the one date that matters. Australians already read it
// on the line above, so they get nothing rather than a repeat.
function renderLocalTime() {
  const opts = {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  };
  try {
    const target = new Date(DEADLINE);
    const here = new Intl.DateTimeFormat('en-AU', opts).format(target);
    const sydney = new Intl.DateTimeFormat('en-AU', { ...opts, timeZone: 'Australia/Sydney' })
      .format(target);

    el.local.textContent = here === sydney
      ? ''
      : `Where you are: ${new Intl.DateTimeFormat(undefined, { ...opts, timeZoneName: 'short' }).format(target)}`;
  } catch {
    el.local.textContent = '';
  }
}

let lastSrMinute = null;

function tick() {
  const remaining = DEADLINE - Date.now();

  if (remaining <= 0) {
    el.days.textContent = el.hours.textContent = el.minutes.textContent = '00';
    el.boxes.classList.add('is-urgent');
    el.vault.classList.add('is-ended');
    el.verb.textContent = 'has closed';
    el.sr.textContent = 'Pokémon Bank service has ended.';
    setTitle('Closed');
    return false; // stop the loop
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  el.days.textContent = String(days);
  el.hours.textContent = pad(hours);
  el.minutes.textContent = pad(minutes);

  // Last 24 hours: the vault turns red.
  el.boxes.classList.toggle('is-urgent', days < 1);

  // Coarsest unit still above zero, so the title changes at most once a minute.
  setTitle(days > 0 ? `${days}d` : hours > 0 ? `${hours}h` : `${minutes}m`);

  // Announce once a minute, not once a second — a per-second live region
  // makes a screen reader unusable.
  if (minutes !== lastSrMinute) {
    lastSrMinute = minutes;
    el.sr.textContent =
      `${days} days, ${hours} hours and ${minutes} minutes until Pokémon Bank closes.`;
  }

  return true;
}

function loop() {
  if (tick()) {
    // Re-align to the next whole second so digits don't drift or skip.
    setTimeout(loop, 1000 - (Date.now() % 1000));
  }
}

renderLocalTime();
loop();

// A backgrounded tab throttles timers; resync the moment it's visible again.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) tick();
});
