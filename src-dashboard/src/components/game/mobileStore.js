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
    this.activeText  = text;
    this.activeTitle = title;
    this.voiceLang   = lang;
    this.notify();
  },
  clearGuide() {
    this.activeText  = null;
    this.activeTitle = null;
    this.notify();
  },
  setSpeaking(val) {
    this.speaking = val;
    this.notify();
  },
};
