export const mobileInput = {
  moveX: 0,
  moveZ: 0,
  lookDx: 0,
  lookDy: 0,
  isMobile: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0),
};

// ── Audio store: shared between 3D scene guides and the HTML audio button ──
export const audioStore = {
  // Current guide text/title to speak (null = no guide nearby)
  activeText: null,
  activeTitle: null,
  voiceLang: 'es-PE',
  speaking: false,
  // Listeners registered by the HUD button
  _listeners: [],
  notify() {
    this._listeners.forEach(fn => fn({ ...this }));
  },
  subscribe(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  },
  setGuide(text, title, lang = 'es-PE') {
    if (this.activeText === text) return; // avoid unnecessary re-renders
    this.activeText  = text;
    this.activeTitle = title;
    this.voiceLang   = lang;
    this.notify();
  },
  clearGuide() {
    if (!this.activeText) return;
    this.activeText  = null;
    this.activeTitle = null;
    this.notify();
  },
  setSpeaking(val) {
    this.speaking = val;
    this.notify();
  },
};

// ── Guide registry: world-space positions used by Player for proximity detection ──
// Interior guide: position [-3, 0, -1] inside group [0, 5, -2] → world (-3, 5, -3)
// Exterior guide: position [8.5, 0, 17] at root → world (8.5, 0, 17)
export const GUIDES = [
  {
    worldPos: [8.5, 0, 17],       // exterior guide world position
    radius: 6,                     // activation radius in metres
    titleKey: 'guideExtTitle',
    textKey:  'guideExtText',
  },
  {
    worldPos: [-3, 5, -3],        // interior guide world position (group offset applied)
    radius: 5,
    titleKey: 'guideIntTitle',
    textKey:  'guideIntText',
  },
];

