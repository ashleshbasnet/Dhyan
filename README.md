# ध्यान · Dhyan
### A Calm Focus Timer for Study

> *"मन शान्त भए संसार शान्त।" — When the mind is calm, the world is calm.*

Dhyan is a Pomodoro-style study timer with a Nepali cultural aesthetic — built with vanilla HTML, CSS, and JavaScript. The interface blends Devanagari typography, Dhaka textile motifs, and generative SVG backgrounds that shift with the time of day. This was created for the RBS WebHack Hackathon. 

---

## Features

### Timer & Sessions
- **Three modes:** Focus (25 min), Short Break (5 min), Long Break (15 min)
- **Pomodoro cycle:** After 4 completed focus sessions, a long break is triggered automatically. After 2 completed sessions, a short break it triggered too.
- **Session dots:** Four visual indicators track progress through a Pomodoro cycle
- **Task input:** A text field to note what you're studying, keeping you anchored

### Generative SVG Backgrounds
The background is not a static image — it is **procedurally generated SVG** composed at runtime in JavaScript. As I am not an expert in mathematical coordinate geometry and also in Javascript, this section along with the scripts were heavily assisted by AI. Forgive me, hardworking human coded programmers but I am not of level to do it all by hand yet. Four distinct scenes are built from scratch using SVG paths, gradients, and geometry, and the app selects between them based on your local time of day:

| Time Window | Scene |
|---|---|
| 5 AM – 10 AM | **Dawn** — purple-to-amber gradient, misty Himalayan silhouette, rising sun glow |
| 10 AM – 5 PM | **Day** — deep blue sky, clouds, sunlit Himalayas with snow caps, a stupa and prayer flags |
| 5 PM – 8 PM | **Dusk** — crimson-to-gold sky, temple skylines, setting sun over the valley |
| 8 PM – 5 AM | **Night** — near-black sky, crescent moon, moonlit mountains, dimmed prayer flags, along with a slightly visible pagoda |

All prayer flags are also generated programmatically: the `flags()` utility interpolates positions along a line and stamps coloured SVG polygons at each point. Stars in the night scene are placed using a deterministic golden-ratio scatter to avoid clustering. Scene transitions use a 3-second CSS opacity crossfade.

### Synthesised Audio
There are no audio files. The **singing bowl sound** on session completion is synthesised entirely via the Web Audio API:
- Five sine-wave oscillators model the fundamental (396 Hz) and four harmonics
- Each partial has its own gain envelope and a slight exponential frequency drop to simulate resonance decay
- A short sawtooth transient adds the physical "strike" impact
- Audio context is initialised only on first user interaction (browser autoplay policy compliance)
NOTE: Audio synthesis is something I've been trying to dive into for a long time so I reccomend anyone to watch the Sebastian Lague Audio Series to delve deep into audio synthesis. Furthermore, audio synthesis is much simpler in python (in my opinion) and extraordinarily simple when you pair it with a game engine such as unity.

### Visual Feedback
- **SVG ring timer:** A circular progress arc (radius 126, circumference ~791.7px) fills via `strokeDashoffset` as time elapses. The ring colour changes between gold (focus) and teal (breaks)
- **Tick marks:** 60 tick marks are generated into the SVG via JavaScript — 12 major ticks (at 5-minute intervals) and 48 minor ticks
- **Flash overlay:** A radial gold gradient flashes over the screen on session completion
- **Toast notification:** Bilingual (Nepali / English) completion messages slide in and auto-dismiss

### Quotes
A curated set of Nepali proverbs and reflections is included, displayed in both Devanagari script and English translation. A random quote is selected on load and on each mode change. Most of the quotes were pulled from google, and translated by good old Google Translate.

### Keyboard Shortcuts
| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `R` | Reset current session |
| `S` | Skip to next session |

---

## File Structure

```
├── index.html       # Markup and layout
├── css/
│   └── style.css    # All styling — variables, layout, animations, Dhaka overlays
└── js/
    └── main.js      # Timer logic, audio synthesis, generative SVG backgrounds, quotes
```

---

## Design Language

The visual identity draws from Nepali craft and cultural motifs:

- **Dhaka textile** — CSS border bands along all four edges mimic the geometric woven patterns of Dhaka fabric, using the traditional colour palette of maroon (`#7C1D1D`), gold (`#C99A14`), green (`#1E6440`), and blue (`#1E3A8A`)
- **Typography** — Tiro Devanagari Hindi for Devanagari script, Cormorant Garamond for English body text, and Mukta for UI labels
- **Glassmorphism panel** — The timer UI floats on a semi-transparent dark glass card (`rgba(10, 8, 20, 0.38)`) with a gold-tinted border
- **Colour tokens** defined as CSS custom properties on `:root` keep the palette consistent across all components

---

## Running 

For running this project, you only need to open the index.html file. I was suggested a lot of things such as NPM and stuff but I centered this project around plain html src. 

---

## Notes

- The Nepali quotes are Google-translated and may not be perfectly idiomatic.
- The JS was written with AI assistance. 
- Audio will not play until the user first interacts with the page — this is a browser requirement, not a bug.
- The UI design was assisted with a designing tool, though turns out they aren't the best to fullfill my visions so had to do multiple trial and error design choices.
- This README's layout was finalized by AI too, due to the time constraints.

---

*This is a Personal Project, built for an event yet built to solve a problem I had faced.*


*Built for the WebHack Hackathon by Ashlesh Basnet.*
