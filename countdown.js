// Pokémon Bank / Poké Transporter end of service.
// Nintendo AU: Friday 26 February 2027, 2:00 pm AEDT (UTC+11) == 03:00 UTC.
// Single source of truth for the deadline:
const DEADLINE = Date.UTC(2027, 1, 26, 3, 0, 0); // month is 0-indexed

const el = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
  boxes: document.getElementById('boxes'),
  sr: document.getElementById('countdown-sr'),
  local: document.getElementById('local-time'),
  vault: document.querySelector('.vault'),
  verb: document.querySelector('.hero__verb'),
};

const pad = (n) => String(n).padStart(2, '0');

// Show the deadline in the visitor's own timezone, so nobody has to do
// timezone maths on the one date that matters.
function renderLocalTime() {
  try {
    const fmt = new Intl.DateTimeFormat(undefined, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    });
    el.local.textContent = `Where you are: ${fmt.format(new Date(DEADLINE))}`;
  } catch {
    el.local.textContent = '';
  }
}

let lastSrMinute = null;

function tick() {
  const remaining = DEADLINE - Date.now();

  if (remaining <= 0) {
    el.days.textContent = el.hours.textContent = '00';
    el.minutes.textContent = el.seconds.textContent = '00';
    el.boxes.classList.add('is-urgent');
    el.vault.classList.add('is-ended');
    el.verb.textContent = 'has closed';
    el.sr.textContent = 'Pokémon Bank service has ended.';
    return false; // stop the loop
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  el.days.textContent = String(days);
  el.hours.textContent = pad(hours);
  el.minutes.textContent = pad(minutes);
  el.seconds.textContent = pad(seconds);

  // Last 24 hours: the vault turns red.
  el.boxes.classList.toggle('is-urgent', days < 1);

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
