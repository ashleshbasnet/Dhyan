console.log("WebHack Hackathon, Ashlesh Basnet");
console.log("Aarav Pandey my Goat");

console.log("JS part was mostly vibe coded, with extremely detailed inputs to AI to mitigate any redundencies, I am not the most skillful in this language and hence apologize for any bad code.i");
console.log("The quotes may not be completely correct since most are google translated.....")

// constants
const MODES = {
  focus: { label: 'FOCUS',      labelDev: 'ध्यान',  minutes: 25, ringColor: '#E5B830' },
  short: { label: 'BREAK',      labelDev: 'विश्राम',  minutes: 5,  ringColor: '#7CBEAF' },
  long:  { label: 'LONG BREAK', labelDev: 'लामो विश्राम',  minutes: 15, ringColor: '#7CBEAF' },
};

const CIRCUMFERENCE = 2 * Math.PI * 126; // r=126 → ~791.7

const QUOTES = [
  { dev: 'शान्तिको बाटो नै यात्रा हो।',        en: 'The path of peace is the journey itself.' },
  { dev: 'एक कदम, एक सास, एक क्षण।',           en: 'One step, one breath, one moment.' },
  { dev: 'धैर्य सबैभन्दा ठूलो गुण हो।',         en: 'Patience is the greatest virtue.' },
  { dev: 'मन शान्त भए संसार शान्त।',            en: 'When the mind is calm, the world is calm.' },
  { dev: 'सानो प्रयासले ठूलो परिवर्तन ल्याउँछ।', en: 'Small efforts bring great change.' },
  { dev: 'ज्ञान नै सबैभन्दा ठूलो सम्पत्ति हो।', en: 'Knowledge is the greatest wealth.' },
  { dev: 'अभ्यासले मान्छेलाई पूर्ण बनाउँछ।',    en: 'Practice makes one complete.' },
];

// state 
let currentMode       = 'focus';
let totalSeconds      = 25 * 60;
let remainingSeconds  = 25 * 60;
let isRunning         = false;
let intervalId        = null;
let completedSessions = 0;

// elements
const ring        = document.getElementById('ring');
const timeDisplay = document.getElementById('time-display');
const modeLabel   = document.getElementById('mode-label');
const modeLabelD  = document.getElementById('mode-label-dev');
const btnStart    = document.getElementById('btn-start');
const btnReset    = document.getElementById('btn-reset');
const btnSkip     = document.getElementById('btn-skip');
const playIcon    = document.getElementById('play-icon');
const pauseIcon   = document.getElementById('pause-icon');
const flash       = document.getElementById('flash');
const notif       = document.getElementById('notification');
const quoteDevEl  = document.getElementById('quote-dev');
const quoteEnEl   = document.getElementById('quote-en');
const sessionLabel= document.getElementById('session-count-label');

// init ring
ring.style.strokeDasharray  = CIRCUMFERENCE;
ring.style.strokeDashoffset = 0;
ring.style.stroke = MODES.focus.ringColor;

// the tick marks
(function drawTicks() {
  const g = document.getElementById('ticks');
  for (let i = 0; i < 60; i++) {
    const angle  = (i * 6) * Math.PI / 180;
    const isMaj  = i % 5 === 0;
    const inner  = isMaj ? 112 : 116;
    const outer  = 124;
    const x1 = 140 + inner * Math.cos(angle - Math.PI / 2);
    const y1 = 140 + inner * Math.sin(angle - Math.PI / 2);
    const x2 = 140 + outer * Math.cos(angle - Math.PI / 2);
    const y2 = 140 + outer * Math.sin(angle - Math.PI / 2);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke-opacity', isMaj ? '0.45' : '0.15');
    line.setAttribute('stroke-width', isMaj ? '2' : '1');
    g.appendChild(line);
  }
})();

// timer
function fmt(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateRing() {
  const frac   = remainingSeconds / totalSeconds;
  const offset = CIRCUMFERENCE * (1 - frac);
  ring.style.strokeDashoffset = offset;
}

function updateDisplay() {
  timeDisplay.textContent  = fmt(remainingSeconds);
  document.title           = `${fmt(remainingSeconds)} · ध्यान`;
  updateRing();
}

function tick() {
  if (remainingSeconds <= 0) { completeSession(); return; }
  remainingSeconds--;
  updateDisplay();
}

function startTimer() {
  isRunning = true;
  intervalId = setInterval(tick, 1000);
  playIcon.style.display  = 'none';
  pauseIcon.style.display = 'block';
  btnStart.classList.remove('pulsing');
  ring.classList.add('running');
}

function pauseTimer() {
  isRunning = false;
  clearInterval(intervalId);
  playIcon.style.display  = 'block';
  pauseIcon.style.display = 'none';
  ring.classList.remove('running');
}

function resetTimer() {
  pauseTimer();
  remainingSeconds = totalSeconds;
  updateDisplay();
  btnStart.classList.add('pulsing');
}

function setMode(mode) {
  pauseTimer();
  currentMode      = mode;
  const cfg        = MODES[mode];
  totalSeconds     = cfg.minutes * 60;
  remainingSeconds = totalSeconds;

  modeLabel.textContent  = cfg.label;
  modeLabelD.textContent = cfg.labelDev;
  ring.style.stroke      = cfg.ringColor;

  document.querySelectorAll('.mode-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.mode === mode)
  );

  updateDisplay();
  btnStart.classList.add('pulsing');
  ring.classList.remove('running');
  setQuote();
}

function completeSession() {
  pauseTimer();
  playSingingBowl();
  triggerFlash();
  showNotif();

  if (currentMode === 'focus') {
    completedSessions = Math.min(completedSessions + 1, 4);
    updateDots();
    const next = (completedSessions >= 4) ? 'long' : 'short';
    setTimeout(() => {
      if (completedSessions >= 4) completedSessions = 0;
      setMode(next);
      updateDots();
    }, 3200);
  } else {
    setTimeout(() => setMode('focus'), 3200);
  }
}

function skipSession() {
  pauseTimer();
  remainingSeconds = 0;
  completeSession();
}

function updateDots() {
  for (let i = 0; i < 4; i++) {
    document.getElementById(`dot-${i}`)
      .classList.toggle('done', i < completedSessions);
  }
  sessionLabel.textContent = `${completedSessions} / 4`;
}

// audio stuff
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSingingBowl() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const now = audioCtx.currentTime;

  // 1. THE "BRONZE FILTER" (The Master Polish)
  // This softens the harsh high-end digital edges.
  const masterFilter = audioCtx.createBiquadFilter();
  masterFilter.type = 'lowpass';
  masterFilter.frequency.value = 2500; // Cuts the "synthy" digital fizz
  masterFilter.connect(audioCtx.destination);

  // 2. The "Striker"
  const strike = audioCtx.createOscillator();
  const sGain = audioCtx.createGain();
  strike.type = 'sawtooth';
  strike.frequency.setValueAtTime(160, now); 
  sGain.gain.setValueAtTime(0.3, now);
  sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  strike.connect(sGain);
  sGain.connect(masterFilter); // Send through filter
  strike.start(now);
  strike.stop(now + 0.05);

  // 3. THE PARTIALS (Mixed Waveforms)
  const partials = [
      { f: 432.0,  d: 6.0, g: 0.5, type: 'sine' },      // Fundamental: Warm & Pure
      { f: 434.4,  d: 5.5, g: 0.3, type: 'triangle' },  // Beat: Woodier
      { f: 842.0,  d: 4.0, g: 0.2, type: 'triangle' },  // Harmonic
      { f: 1252.0, d: 3.0, g: 0.1, type: 'sawtooth' },  // Metallic edge (Sawtooth adds that "grit")
      { f: 1672.0, d: 2.0, g: 0.05, type: 'sawtooth' }  // High shimmer
  ];

  partials.forEach((p) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = p.type; // Dynamically setting waveforms kills the "synth" feel
    osc.frequency.setValueAtTime(p.f, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(p.g, now + 0.05);
    gain.gain.setValueAtTime(p.g, now + 0.1); 
    gain.gain.exponentialRampToValueAtTime(0.001, now + p.d);
    
    osc.connect(gain);
    gain.connect(masterFilter); // Everything goes through the Bronze Filter!
    
    osc.start(now);
    osc.stop(now + p.d);
  });
}

// visual stuff
function triggerFlash() {
  flash.style.background = 'radial-gradient(circle at center, rgba(201,154,20,0.22), transparent 70%)';
  flash.classList.add('show');
  setTimeout(() => flash.classList.remove('show'), 700);
}

let notifTimer;
function showNotif() {
  const msgs = {
    focus: 'ध्यान सम्पन्न! · Session complete 🎵',
    short: 'विश्राम सकियो! · Time to focus again',
    long:  'लामो विश्राम सम्पन्न! · Long break done',
  };
  notif.textContent = msgs[currentMode];
  notif.classList.add('show');
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => notif.classList.remove('show'), 4500);
}

// wise words
function setQuote() {
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  quoteDevEl.textContent = q.dev;
  quoteEnEl.textContent  = q.en;
}

// svg stuff that is literally pain
function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5  && h < 10) return 'dawn';
  if (h >= 10 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'dusk';
  return 'night';
}

// Utility: prayer flags string along a line
function flags(x1, y1, x2, y2, n, dim) {
  const cols = dim
    ? ['rgba(201,154,20,0.28)', 'rgba(124,29,29,0.28)', 'rgba(30,100,64,0.28)',
       'rgba(30,58,138,0.25)', 'rgba(250,243,224,0.18)']
    : ['#C99A14', '#8B2020', '#1E6440', '#1E3A8A', '#F0E8D0'];
  let out = '';
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    out += `<polygon points="${x},${y} ${x+13},${y+5} ${x},${y+17}"
              fill="${cols[i % cols.length]}" opacity="0.72"/>`;
  }
  return out;
}

// Utility: random stars
function stars(n, maxY = 650) {
  const s = [];
  for (let i = 0; i < n; i++) {
    const x  = ((i * 137.508 * 7) % 1440).toFixed(1);
    const y  = ((i * 97.421 * 3) % maxY).toFixed(1);
    const r  = (((i * 0.618) % 1.4) + 0.3).toFixed(2);
    const op = (((i * 0.382) % 0.65) + 0.18).toFixed(2);
    s.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${op}"/>`);
  }
  return s.join('');
}

//dawn
function bgDawn() {
  return `<svg viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="d-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#0C1836"/>
      <stop offset="28%"  stop-color="#5C2068"/>
      <stop offset="55%"  stop-color="#C84830"/>
      <stop offset="75%"  stop-color="#EB7C38"/>
      <stop offset="90%"  stop-color="#F5A855"/>
      <stop offset="100%" stop-color="#FBCF80"/>
    </linearGradient>
    <radialGradient id="d-sun" cx="50%" cy="95%" r="38%">
      <stop offset="0%"   stop-color="#FFF5B0" stop-opacity="0.88"/>
      <stop offset="35%"  stop-color="#F7AA35" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="d-mist" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="white" stop-opacity="0"/>
      <stop offset="100%" stop-color="white" stop-opacity="0.10"/>
    </linearGradient>
  </defs>
  <rect width="1440" height="900" fill="url(#d-sky)"/>
  <rect width="1440" height="900" fill="url(#d-sun)"/>
  <!-- Far mountains -->
  <path d="M0,620 L90,515 L185,558 L295,472 L410,425 L530,490 L635,435 L755,380 L875,428 L995,365 L1110,408 L1230,360 L1350,398 L1440,380 L1440,900 L0,900Z"
        fill="#2A1848" opacity="0.72"/>
  <!-- Snow caps -->
  <path d="M755,380 L735,415 L775,410Z M995,365 L975,398 L1015,394Z M410,425 L393,458 L428,453Z M1230,360 L1212,392 L1248,388Z"
        fill="rgba(255,255,255,0.60)"/>
  <!-- Mid mountains -->
  <path d="M0,680 L140,610 L280,642 L410,592 L550,558 L680,598 L800,548 L930,578 L1060,528 L1190,562 L1320,518 L1440,548 L1440,900 L0,900Z"
        fill="#1C1030" opacity="0.88"/>
  <!-- Stupa silhouette -->
  <g transform="translate(720,530)" fill="#130C24" opacity="0.55">
    <rect x="-5" y="-75" width="10" height="75"/>
    <ellipse cx="0" cy="-75" rx="34" ry="24"/>
    <rect x="-38" y="-55" width="76" height="13"/>
    <rect x="-50" y="-42" width="100" height="11"/>
    <rect x="-62" y="-31" width="124" height="10"/>
    <rect x="-74" y="-21" width="148" height="9"/>
  </g>
  <!-- Prayer lines -->
  <line x1="350" y1="430" x2="720" y2="395" stroke="#C99A14" stroke-width="1" opacity="0.38"/>
  <line x1="720" y1="395" x2="1090" y2="365" stroke="#C99A14" stroke-width="1" opacity="0.38"/>
  ${flags(350,430,720,395,9,false)}
  ${flags(720,395,1090,365,8,false)}
  <rect width="1440" height="900" fill="url(#d-mist)"/>
</svg>`;
}

// day
function bgDay() {
  return `<svg viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="dy-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#0F3260"/>
      <stop offset="45%"  stop-color="#2E72C8"/>
      <stop offset="85%"  stop-color="#70AADF"/>
      <stop offset="100%" stop-color="#A8CCE8"/>
    </linearGradient>
    <radialGradient id="dy-sun" cx="72%" cy="18%" r="18%">
      <stop offset="0%"   stop-color="#FDFAC0" stop-opacity="0.85"/>
      <stop offset="55%"  stop-color="#F5C048" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1440" height="900" fill="url(#dy-sky)"/>
  <rect width="1440" height="900" fill="url(#dy-sun)"/>
  <!-- Sun disk -->
  <circle cx="1038" cy="162" r="46" fill="#FFF8D0" opacity="0.80"/>
  <circle cx="1038" cy="162" r="36" fill="#FFFAE0" opacity="0.90"/>
  <!-- Clouds -->
  <g opacity="0.78">
    <ellipse cx="220" cy="148" rx="130" ry="38" fill="white"/>
    <ellipse cx="280" cy="130" rx="100" ry="44" fill="white"/>
    <ellipse cx="170" cy="152" rx="80" ry="32" fill="white" opacity="0.8"/>
    <ellipse cx="820" cy="190" rx="110" ry="32" fill="white" opacity="0.65"/>
    <ellipse cx="880" cy="176" rx="85" ry="36" fill="white" opacity="0.7"/>
  </g>
  <!-- Far Himalayas with snow -->
  <path d="M0,560 L130,445 L225,488 L340,405 L460,368 L580,432 L690,375 L810,325 L930,372 L1050,318 L1170,355 L1290,318 L1380,340 L1440,328 L1440,900 L0,900Z"
        fill="#C0CED8" opacity="0.60"/>
  <!-- Snow caps -->
  <path d="M810,325 L782,362 L838,356Z M1050,318 L1024,352 L1076,347Z M460,368 L440,400 L480,396Z M1290,318 L1268,350 L1312,346Z M340,405 L320,436 L360,432Z"
        fill="white" opacity="0.88"/>
  <!-- Mid mountains blue -->
  <path d="M0,640 L160,572 L310,600 L460,548 L610,575 L750,528 L890,558 L1040,512 L1190,545 L1340,508 L1440,528 L1440,900 L0,900Z"
        fill="#1E4A7C" opacity="0.72"/>
  <!-- Near hills -->
  <path d="M0,760 L220,715 L440,738 L660,710 L880,730 L1100,700 L1320,725 L1440,708 L1440,900 L0,900Z"
        fill="#0E2A4A"/>
  <!-- Stupa detail -->
  <g transform="translate(720,610)" fill="#0E2A4A" opacity="0.85">
    <rect x="-4" y="-65" width="8" height="65"/>
    <ellipse cx="0" cy="-65" rx="28" ry="20"/>
    <rect x="-32" y="-48" width="64" height="11"/>
    <rect x="-42" y="-37" width="84" height="10"/>
    <rect x="-54" y="-27" width="108" height="9"/>
    <rect x="-66" y="-18" width="132" height="8"/>
  </g>
  <!-- Prayer flags -->
  <line x1="420" y1="520" x2="750" y2="490" stroke="#C99A14" stroke-width="1.4" opacity="0.52"/>
  <line x1="750" y1="490" x2="1080" y2="510" stroke="#C99A14" stroke-width="1.4" opacity="0.52"/>
  ${flags(420,520,750,490,9,false)}
  ${flags(750,490,1080,510,9,false)}
</svg>`;
}

// the sun is setting
function bgDusk() {
  return `<svg viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="dk-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#16082A"/>
      <stop offset="22%"  stop-color="#48185A"/>
      <stop offset="46%"  stop-color="#B83C28"/>
      <stop offset="65%"  stop-color="#E06C30"/>
      <stop offset="80%"  stop-color="#F09838"/>
      <stop offset="100%" stop-color="#F8C870"/>
    </linearGradient>
    <radialGradient id="dk-sun" cx="50%" cy="90%" r="32%">
      <stop offset="0%"   stop-color="#FFED80" stop-opacity="0.88"/>
      <stop offset="28%"  stop-color="#F08020" stop-opacity="0.58"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1440" height="900" fill="url(#dk-sky)"/>
  <rect width="1440" height="900" fill="url(#dk-sun)"/>
  <!-- Sun disk -->
  <circle cx="720" cy="730" r="58" fill="#FFE090" opacity="0.88"/>
  <circle cx="720" cy="730" r="44" fill="#FFF2B0" opacity="0.92"/>
  <!-- Far mountains dark -->
  <path d="M0,590 L110,498 L225,535 L345,460 L465,420 L585,468 L710,408 L830,448 L950,390 L1070,428 L1190,382 L1310,415 L1440,395 L1440,900 L0,900Z"
        fill="#100620" opacity="0.78"/>
  <!-- Temple skyline -->
  <g fill="#0A0415" opacity="0.92">
    <!-- Left temple -->
    <rect x="310" y="575" width="90" height="70"/>
    <polygon points="310,575 355,545 400,575"/>
    <polygon points="322,545 355,528 388,545"/>
    <rect x="327" y="600" width="12" height="45" rx="2"/>
    <rect x="361" y="600" width="12" height="45" rx="2"/>
    <!-- Main stupa center -->
    <rect x="697" y="490" width="12" height="85"/>
    <ellipse cx="703" cy="490" rx="46" ry="32"/>
    <rect x="657" y="515" width="92" height="14"/>
    <rect x="644" y="529" width="118" height="12"/>
    <rect x="630" y="541" width="146" height="11"/>
    <rect x="618" y="552" width="170" height="10"/>
    <rect x="606" y="562" width="194" height="9"/>
    <!-- Right temple -->
    <rect x="1040" y="582" width="80" height="62"/>
    <polygon points="1040,582 1080,554 1120,582"/>
    <polygon points="1052,554 1080,538 1108,554"/>
    <rect x="1055" y="608" width="11" height="36" rx="2"/>
    <rect x="1085" y="608" width="11" height="36" rx="2"/>
    <!-- Bell towers far left -->
    <rect x="140" y="605" width="30" height="55"/>
    <polygon points="140,605 155,590 170,605"/>
    <!-- Bell tower far right -->
    <rect x="1270" y="615" width="28" height="45"/>
    <polygon points="1270,615 1284,601 1298,615"/>
  </g>
  <!-- Near ground -->
  <path d="M0,790 L200,755 L420,772 L640,745 L860,765 L1080,740 L1300,758 L1440,742 L1440,900 L0,900Z"
        fill="#060210"/>
  <!-- Prayer flags -->
  <line x1="310" y1="420" x2="703" y2="380" stroke="rgba(201,154,20,0.42)" stroke-width="1"/>
  <line x1="703" y1="380" x2="1120" y2="400" stroke="rgba(201,154,20,0.42)" stroke-width="1"/>
  ${flags(310,420,703,380,10,false)}
  ${flags(703,380,1120,400,10,false)}
</svg>`;
}

// night
function bgNight() {
    return `<svg viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
        <linearGradient id="n-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#00030C"/>
        <stop offset="38%"  stop-color="#04092A"/>
        <stop offset="68%"  stop-color="#081440"/>
        <stop offset="100%" stop-color="#0C1C52"/>
        </linearGradient>
        <radialGradient id="n-moon" cx="74%" cy="20%" r="14%">
        <stop offset="0%"   stop-color="#D8E8FF" stop-opacity="0.40"/>
        <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="n-mw" cx="40%" cy="40%" r="60%">
        <stop offset="0%"   stop-color="#8090C0" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
    </defs>
    <rect width="1440" height="900" fill="url(#n-sky)"/>
    <rect width="1440" height="900" fill="url(#n-mw)"/>
    <rect width="1440" height="900" fill="url(#n-moon)"/>
    <!-- Stars -->
    ${stars(140)}
    <!-- Moon crescent -->
    <circle cx="1065" cy="178" r="52" fill="#D5E5FF" opacity="0.88"/>
    <circle cx="1082" cy="166" r="47" fill="#04092A"/>
    <!-- Mountain silhouettes (moonlit) -->
    <path d="M0,570 L130,460 L250,504 L375,428 L500,385 L625,445 L745,388 L865,422 L985,372 L1105,405 L1225,368 L1340,395 L1440,378 L1440,900 L0,900Z"
            fill="#030818" opacity="0.92"/>
    <!-- Moonlit snow caps -->
    <path d="M745,388 L720,425 L770,420Z M985,372 L960,406 L1010,401Z M500,385 L478,418 L522,413Z M1225,368 L1202,400 L1248,395Z"
            fill="rgba(180,210,255,0.48)"/>
    <!-- Temple complex - pagoda silhouettes -->
    <g fill="#060E1E" opacity="0.95">
      <!-- Left temple -->
      <rect x="270" y="500" width="90" height="110"/>
      <polygon points="270,500 315,470 360,500"/>
      <polygon points="282,470 315,453 348,470"/>
      <rect x="287" y="525" width="12" height="85" rx="2"/>
      <rect x="321" y="525" width="12" height="85" rx="2"/>
      <!-- Main stupa center -->
      <rect x="714" y="420" width="12" height="120"/>
      <ellipse cx="720" cy="420" rx="46" ry="32"/>
      <rect x="674" y="445" width="92" height="14"/>
      <rect x="661" y="459" width="118" height="12"/>
      <rect x="647" y="471" width="146" height="11"/>
      <rect x="635" y="482" width="170" height="10"/>
      <rect x="623" y="492" width="194" height="9"/>
      <!-- Right temple -->
      <rect x="1080" y="507" width="80" height="103"/>
      <polygon points="1080,507 1120,479 1160,507"/>
      <polygon points="1092,479 1120,463 1148,479"/>
      <rect x="1095" y="533" width="11" height="77" rx="2"/>
      <rect x="1125" y="533" width="11" height="77" rx="2"/>
      <!-- Bell tower far left -->
      <rect x="100" y="530" width="30" height="90"/>
      <polygon points="100,530 115,515 130,530"/>
      <!-- Bell tower far right -->
      <rect x="1310" y="540" width="28" height="80"/>
      <polygon points="1310,540 1324,526 1338,540"/>
    </g>
    <!-- Subtle door glow only -->
    <rect x="706" y="505" width="28" height="55" rx="2" fill="#FF9020" opacity="0.18"/>
    <circle cx="720" cy="560" r="60" fill="#FF8010" opacity="0.04"/>
    <!-- Near hills -->
    <path d="M0,775 L220,738 L440,758 L660,730 L880,748 L1100,720 L1320,742 L1440,728 L1440,900 L0,900Z"
            fill="#010510"/>
    <!-- Prayer flags (dim) -->
    <line x1="380" y1="388" x2="720" y2="358" stroke="rgba(201,154,20,0.25)" stroke-width="1"/>
    <line x1="720" y1="358" x2="1090" y2="372" stroke="rgba(201,154,20,0.25)" stroke-width="1"/>
    ${flags(380,388,720,358,9,true)}
    ${flags(720,358,1090,372,9,true)}
</svg>`;
}

// initialise bg
function initBackground() {
    const container = document.getElementById('bg-container');
    const scenes = { dawn: bgDawn(), day: bgDay(), dusk: bgDusk(), night: bgNight() };
    Object.entries(scenes).forEach(([key, svg]) => {
        const div = document.createElement('div');
        div.className = 'bg-scene';
        div.id = `scene-${key}`;
        div.innerHTML = svg;
        container.appendChild(div);
    });
    updateBackground();
    setInterval(updateBackground, 10 * 60 * 1000); // check every 10 min
}

function updateBackground() {
    const tod = getTimeOfDay();

    document.querySelectorAll('.bg-scene').forEach(s => s.classList.remove('active'));
    const sc = document.getElementById(`scene-${tod}`);
    if (sc) sc.classList.add('active');
}

// listeners
btnStart.addEventListener('click', () => {
    initAudio();
  if (isRunning) pauseTimer(); else startTimer();
});

btnReset.addEventListener('click', resetTimer);
btnSkip.addEventListener('click', skipSession);

document.querySelectorAll('.mode-tab').forEach(tab => {
  tab.addEventListener('click', () => setMode(tab.dataset.mode));
});

document.addEventListener('keydown', e => {
  if (document.activeElement === document.getElementById('task-input')) return;
  if (e.code === 'Space') { e.preventDefault(); isRunning ? pauseTimer() : startTimer(); }
  if (e.code === 'KeyR')  resetTimer();
  if (e.code === 'KeyS')  skipSession();
});

// boot
initBackground();
setQuote();
updateDisplay();
updateDots();
