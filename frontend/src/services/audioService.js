/**
 * AudioService — Premium, Soft, Satisfying, Responsive Procedural Game Audio
 * 
 * Synthesized using the Web Audio API:
 * - Ultra-lightweight (zero external audio files or heavy libraries)
 * - Soft, tactile card physics (table felt taps, paper slides, gentle swooshes)
 * - Dynamic micro-variations to prevent repetitive fatigue
 * - Dedicated pleasant audio identities for Special Cards (Skip, +2, Reverse, Wild, Wild +4)
 * - Gentle UI clicks and subtle timer warning pings (no constant ticking)
 * - Ambient procedural background music pad
 * - Graceful autoplay suspension handling
 */

class AudioService {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicEnabled = false;
    this.volume = 0.8;
    this.musicInterval = null;
    this.activeMusicNodes = [];
    this.currentScene = 'lobby';
    this.cardPlayCounter = 0;
    this.voiceEnabled = true;
    this.voiceVolume = 0.8;
    this.audioPool = {};
    this.lastPenaltyTime = 0;
  }

  // --- Context Lifecycle & Autoplay Handling ---

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    // Preload voice callout audio files
    if (typeof Audio !== 'undefined') {
      const assets = [
        '/audio/skip.wav',
        '/audio/plus2.wav',
        '/audio/reverse.wav',
        '/audio/wild.wav',
        '/audio/wild4.wav',
        '/audio/uno.wav'
      ];
      assets.forEach(path => {
        if (!this.audioPool[path]) {
          try {
            const a = new Audio(path);
            a.preload = 'auto';
            this.audioPool[path] = a;
          } catch {}
        }
      });
    }
  }

  // Explicit Mobile Autoplay Unlocker (Awaited on user gestures: Start Match, Enter Arena, Music ON)
  async unlock() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await Promise.race([
          this.ctx.resume(),
          new Promise(resolve => setTimeout(resolve, 80))
        ]);
      } catch (err) {
        console.warn('AudioContext resume error:', err);
      }
    }
    // Mobile Safari hardware audio daemon unlock pulse
    if (this.ctx && this.ctx.state === 'running') {
      try {
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
      } catch {}
    }
    return this.ctx ? this.ctx.state === 'running' : false;
  }

  // Centralized sub-mix balance
  getMixVolume(category = 'sfx') {
    const master = this.volume;
    switch (category) {
      case 'music':     return master * 0.45; // Clearly audible on mobile phone speakers
      case 'sfx':       return master * 0.65; // Crisp, tactile
      case 'ui':        return master * 0.45; // Crisp, subtle
      case 'reaction':  return master * 0.42; // Delicate emotes
      case 'victory':   return master * 0.70; // Celebratory triumphant fanfare
      default:          return master * 0.55;
    }
  }

  setSfxEnabled(val) {
    this.sfxEnabled = Boolean(val);
  }

  setMusicEnabled(val) {
    this.musicEnabled = Boolean(val);
    if (this.musicEnabled) {
      this.startMusic(this.currentScene);
    } else {
      this.stopMusic();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.musicEnabled) {
      this.startMusic(this.currentScene);
    }
  }

  setVoiceEnabled(val) {
    this.voiceEnabled = Boolean(val);
  }

  setVoiceVolume(vol) {
    this.voiceVolume = Math.max(0, Math.min(1, vol));
  }

  setScene(scene = 'lobby') {
    try {
      this.currentScene = scene;
      if (this.musicEnabled) {
        this.startMusic(this.currentScene);
      }
    } catch (err) {
      console.warn('setScene error (safe):', err);
    }
  }

  // --- Voice / Announcer Callouts via Bundled Audio Assets (100% Audible & Reliable) ---
  playVoiceCallout(phrase) {
    if (!this.voiceEnabled || !phrase) return;
    this.init();
    const vol = Math.max(0.05, Math.min(1, this.volume * this.voiceVolume));

    const fileMap = {
      'skip': '/audio/skip.wav',
      'plus two': '/audio/plus2.wav',
      'plus2': '/audio/plus2.wav',
      'draw two': '/audio/plus2.wav',
      'reverse': '/audio/reverse.wav',
      'wild': '/audio/wild.wav',
      'wild plus four': '/audio/wild4.wav',
      'wild4': '/audio/wild4.wav',
      'wild draw four': '/audio/wild4.wav',
      'uno': '/audio/uno.wav'
    };

    const norm = phrase.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    let soundPath = fileMap[norm];

    // Smart keyword matching for callout variations
    if (!soundPath) {
      if (norm.includes('wild') && (norm.includes('four') || norm.includes('4'))) {
        soundPath = '/audio/wild4.wav';
      } else if (norm.includes('plus two') || norm.includes('draw two') || norm.includes('plus2')) {
        soundPath = '/audio/plus2.wav';
      } else if (norm.includes('uno')) {
        soundPath = '/audio/uno.wav';
      } else if (norm.includes('skip')) {
        soundPath = '/audio/skip.wav';
      } else if (norm.includes('reverse')) {
        soundPath = '/audio/reverse.wav';
      } else if (norm.includes('wild')) {
        soundPath = '/audio/wild.wav';
      }
    }

    if (soundPath) {
      try {
        const audio = new Audio(soundPath);
        audio.volume = vol;
        const p = audio.play();
        if (p !== undefined) {
          p.catch((err) => {
            console.warn('Audio callout playback, falling back to WebSpeech:', err);
            this.fallbackSpeak(phrase);
          });
        }
        return;
      } catch {
        this.fallbackSpeak(phrase);
        return;
      }
    }

    this.fallbackSpeak(phrase);
  }

  // Fallback speech synthesis if audio file cannot play
  fallbackSpeak(phrase) {
    if (!this.voiceEnabled || !phrase) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.volume = Math.max(0.1, Math.min(1, this.volume * this.voiceVolume));
      utterance.rate = 1.25;
      utterance.pitch = 1.15;
      window._activeSpeechUtterance = utterance; // Prevent garbage collection cutoff
      window.speechSynthesis.speak(utterance);
    } catch {}
  }

  speakAnnouncer(phrase) {
    this.playVoiceCallout(phrase);
  }

  // --- 1. CARD PLAY SOUND (Soft swoosh + gentle table/felt tap) ---

  playCard() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');
      this.cardPlayCounter = (this.cardPlayCounter + 1) % 3;

      // Micro-variations to prevent repetition (variations A, B, C)
      const variations = [
        { tapStartFreq: 210, tapEndFreq: 65, swooshFreq: 1250, tapDuration: 0.055 },
        { tapStartFreq: 225, tapEndFreq: 72, swooshFreq: 1400, tapDuration: 0.050 },
        { tapStartFreq: 195, tapEndFreq: 60, swooshFreq: 1150, tapDuration: 0.060 }
      ];
      const v = variations[this.cardPlayCounter];
      const pitchJitter = 1 + (Math.random() * 0.04 - 0.02);

      // Layer 1: Soft card swoosh (gentle friction)
      const swooshBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.12), this.ctx.sampleRate);
      const data = swooshBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.18;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = swooshBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(v.swooshFreq * pitchJitter, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(750, now + 0.10);
      noiseFilter.Q.setValueAtTime(1.2, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.08 * sfxVol, now + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // Layer 2: Gentle felt/table tap (short low-pass rounded sine)
      const tapOsc = this.ctx.createOscillator();
      const tapFilter = this.ctx.createBiquadFilter();
      const tapGain = this.ctx.createGain();

      tapOsc.type = 'sine';
      tapOsc.frequency.setValueAtTime(v.tapStartFreq * pitchJitter, now + 0.02);
      tapOsc.frequency.exponentialRampToValueAtTime(v.tapEndFreq, now + 0.02 + v.tapDuration);

      tapFilter.type = 'lowpass';
      tapFilter.frequency.setValueAtTime(260, now + 0.02);

      tapGain.gain.setValueAtTime(0.001, now + 0.02);
      tapGain.gain.linearRampToValueAtTime(0.16 * sfxVol, now + 0.025);
      tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02 + v.tapDuration + 0.04);

      tapOsc.connect(tapFilter);
      tapFilter.connect(tapGain);
      tapGain.connect(this.ctx.destination);

      tapOsc.start(now + 0.02);
      tapOsc.stop(now + 0.02 + v.tapDuration + 0.05);
    } catch {}
  }

  // Alias for physical card landing onto discard pile
  playCardSlam() {
    this.playCard();
  }

  // --- 2. DRAW CARD SOUND (Soft paper shuffle/movement) ---

  playDeal() {
    this.playDrawCard();
  }

  playDrawCard() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');
      const jitter = 1 + (Math.random() * 0.06 - 0.03);

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.075);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.16;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600 * jitter, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.07);
      filter.Q.setValueAtTime(1.1, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09 * sfxVol, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch {}
  }

  // Staggered subtle draw for multi-card draws (+2, +4, penalty)
  playDrawMultiple(count = 2) {
    if (!this.sfxEnabled) return;
    const clampedCount = Math.min(4, Math.max(1, count));
    for (let i = 0; i < clampedCount; i++) {
      setTimeout(() => {
        this.playDrawCard();
      }, i * 75);
    }
  }

  // --- 3. SKIP CARD (Short soft whoosh + card snap + "SKIP!" voice) ---

  playSkip() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      // 1. Physical card whoosh (filtered bandpass noise rush)
      const whooshBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.16), this.ctx.sampleRate);
      const data = whooshBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.22;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = whooshBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1400, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(450, now + 0.15);
      noiseFilter.Q.setValueAtTime(1.8, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.15 * sfxVol, now + 0.025);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // 2. Crisp tactile card snap impact
      const tapOsc = this.ctx.createOscillator();
      const tapFilter = this.ctx.createBiquadFilter();
      const tapGain = this.ctx.createGain();

      tapOsc.type = 'triangle';
      tapOsc.frequency.setValueAtTime(190, now + 0.04);
      tapOsc.frequency.exponentialRampToValueAtTime(55, now + 0.10);

      tapFilter.type = 'lowpass';
      tapFilter.frequency.setValueAtTime(320, now + 0.04);

      tapGain.gain.setValueAtTime(0.001, now + 0.04);
      tapGain.gain.linearRampToValueAtTime(0.18 * sfxVol, now + 0.048);
      tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      tapOsc.connect(tapFilter);
      tapFilter.connect(tapGain);
      tapGain.connect(this.ctx.destination);
      tapOsc.start(now + 0.04);
      tapOsc.stop(now + 0.13);
    } catch {}

    // Announce voice callout
    this.playVoiceCallout('skip');
  }

  // --- 4. +2 CARD (Card movement -> tactile double impact -> "PLUS TWO!" voice) ---

  playDrawTwo() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      // 1. Soft card friction
      this.playDrawCard();

      // 2. Heavier physical table slap (tactile felt/wood resonance)
      const tapOsc = this.ctx.createOscillator();
      const tapGain = this.ctx.createGain();
      tapOsc.type = 'triangle';
      tapOsc.frequency.setValueAtTime(140, now + 0.03);
      tapOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      tapGain.gain.setValueAtTime(0.001, now + 0.03);
      tapGain.gain.linearRampToValueAtTime(0.22 * sfxVol, now + 0.038);
      tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      tapOsc.connect(tapGain);
      tapGain.connect(this.ctx.destination);
      tapOsc.start(now + 0.03);
      tapOsc.stop(now + 0.15);

      // Secondary snap (+2 impact)
      setTimeout(() => {
        this.playCard();
      }, 70);
    } catch {}

    // Announce voice callout
    this.playVoiceCallout('plus two');
  }

  // Alias for +2 attack impact
  playMissile() {
    this.playDrawTwo();
  }

  // --- 5. REVERSE (Smooth circular wind vortex swirl + "REVERSE!" voice) ---

  playReverse() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      // Physical wind vortex / circular swirl sound
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.32), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.20;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(2.6, now);
      // Sweep upward then downward mimicking orbit rotation
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.exponentialRampToValueAtTime(1250, now + 0.14);
      filter.frequency.exponentialRampToValueAtTime(380, now + 0.30);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18 * sfxVol, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.30);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch {}

    // Announce voice callout
    this.playVoiceCallout('reverse');
  }

  // --- 6. WILD (Delicate magical shimmer sparkle + "WILD!" voice) ---

  playWild() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      // Delicate celestial shimmer texture (sparkle grains with soft high harmonics)
      const shimmerBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.28), this.ctx.sampleRate);
      const data = shimmerBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.12;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = shimmerBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3200, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.09 * sfxVol, now + 0.04);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // Warm celestial bell shimmer
      [880.00, 1174.66].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.07 * sfxVol, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.24);
      });
    } catch {}

    // Announce voice callout
    this.playVoiceCallout('wild');
  }

  // --- 7. WILD +4 (Rising energy sweep + heavy impact + "WILD PLUS FOUR!" voice) ---

  playWildFour() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      // 1. Rising energy sweep whoosh
      const whooshBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.22), this.ctx.sampleRate);
      const data = whooshBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.25;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = whooshBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1.8, now);
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.16);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18 * sfxVol, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);

      // 2. Heavy physical impact
      const tapOsc = this.ctx.createOscillator();
      const tapGain = this.ctx.createGain();
      tapOsc.type = 'triangle';
      tapOsc.frequency.setValueAtTime(120, now + 0.10);
      tapOsc.frequency.exponentialRampToValueAtTime(40, now + 0.20);

      tapGain.gain.setValueAtTime(0.001, now + 0.10);
      tapGain.gain.linearRampToValueAtTime(0.22 * sfxVol, now + 0.11);
      tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      tapOsc.connect(tapGain);
      tapGain.connect(this.ctx.destination);
      tapOsc.start(now + 0.10);
      tapOsc.stop(now + 0.24);
    } catch {}

    // Announce voice callout
    this.playVoiceCallout('wild plus four');
  }

  // --- 8. UNO MOMENT (Bright harmonic chime + soft warm sparkle + "UNO!" voice) ---

  playUno() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      // Grand golden bell chime (C6, G6)
      [1046.50, 1567.98].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.05;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.18 * sfxVol, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.48);
      });
    } catch {}

    // Announce bold UNO voice
    this.playVoiceCallout('uno');
  }

  // --- 9. UNO SUCCESS (Satisfying positive confirmation chime + sparkle) ---

  playUnoSuccess() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      // Two uplifting bright chimes (G5 -> C6)
      [783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.09;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.15 * sfxVol, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.40);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.42);
      });
    } catch {}
  }

  // --- 10. UNO CAUGHT / FALSE UNO (Soft playful friendly 'oops' sound) ---

  playUnoCaught() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      // Playful descending marimba 'boop-boop' (A4 -> E4)
      [440.00, 329.63].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.10;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.92, t + 0.12);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.14 * sfxVol, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.15);
      });
    } catch {}
  }

  // --- 10b. TACTILE PENALTY & FRUSTRATION: +2 CARDS ---
  playFrustrationPlus2() {
    if (!this.sfxEnabled) return;
    const nowMs = Date.now();
    if (nowMs - this.lastPenaltyTime < 250) return;
    this.lastPenaltyTime = nowMs;

    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      // Comical downward cartoon wah-slide (380Hz -> 180Hz)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.24);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.24);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25 * sfxVol, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.30);

      // Tactile physical felt thud tap
      const tapOsc = this.ctx.createOscillator();
      const tapGain = this.ctx.createGain();
      tapOsc.type = 'sine';
      tapOsc.frequency.setValueAtTime(160, now);
      tapOsc.frequency.exponentialRampToValueAtTime(60, now + 0.09);

      tapGain.gain.setValueAtTime(0.001, now);
      tapGain.gain.linearRampToValueAtTime(0.18 * sfxVol, now + 0.008);
      tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      tapOsc.connect(tapGain);
      tapGain.connect(this.ctx.destination);

      tapOsc.start(now);
      tapOsc.stop(now + 0.13);
    } catch {}
  }

  // --- 10c. TACTILE PENALTY & FRUSTRATION: +4 CARDS ---
  playFrustrationPlus4() {
    if (!this.sfxEnabled) return;
    const nowMs = Date.now();
    if (nowMs - this.lastPenaltyTime < 250) return;
    this.lastPenaltyTime = nowMs;

    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      // Stronger comedic double-wah slide (480Hz -> 260Hz -> 140Hz)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.14);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.32);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(380, now + 0.32);
      filter.Q.setValueAtTime(3.5, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28 * sfxVol, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);

      // Double impact table slap
      [0, 0.08].forEach(delay => {
        const tapOsc = this.ctx.createOscillator();
        const tapGain = this.ctx.createGain();
        const t = now + delay;
        tapOsc.type = 'triangle';
        tapOsc.frequency.setValueAtTime(180, t);
        tapOsc.frequency.exponentialRampToValueAtTime(55, t + 0.08);

        tapGain.gain.setValueAtTime(0.001, t);
        tapGain.gain.linearRampToValueAtTime(0.20 * sfxVol, t + 0.008);
        tapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.10);

        tapOsc.connect(tapGain);
        tapGain.connect(this.ctx.destination);

        tapOsc.start(t);
        tapOsc.stop(t + 0.11);
      });
    } catch {}
  }

  // Backward compatible alias
  playPenaltyFrustration(type = '+2') {
    if (type === '+4' || type === 'draw4' || type === 'wild4') {
      this.playFrustrationPlus4();
    } else {
      this.playFrustrationPlus2();
    }
  }

  // --- 11. OPPONENT REACTIONS (Extremely subtle sound cues) ---

  playReaction(type = 'general') {
    if (!this.sfxEnabled) return;
    if (type === '+4' || type === 'wild4' || type === 'draw4' || type === '😵') {
      this.playFrustrationPlus4();
      return;
    }
    if (type === '+2' || type === 'draw2' || type === '😤' || type === '😱') {
      this.playFrustrationPlus2();
      return;
    }
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const reactVol = this.getMixVolume('reaction');
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (type === 'skip' || type === '😮') {
        // Soft surprised rising chirp
        osc.type = 'sine';
        osc.frequency.setValueAtTime(460, now);
        osc.frequency.exponentialRampToValueAtTime(560, now + 0.08);
      } else if (type === 'uno' || type === '👑' || type === '🤩') {
        // Small excitement chirp
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);
      } else {
        // Soft friendly pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.06);
      }

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09 * reactVol, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  // --- 12. TURN CHANGE (Very soft UI notification tone) ---

  playTurn() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const uiVol = this.getMixVolume('ui');

      // Soft warm dual tone (E5 -> G5)
      [659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.10 * uiVol, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.20);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.22);
      });
    } catch {}
  }

  // --- 13. TIMER WARNING (Subtle pings only in final 6 seconds: 6, 5, 4, 3, 2, 1) ---

  playTimerWarning(secondsRemaining) {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    // Only play warning in the final 6 seconds (6, 5, 4, 3, 2, 1) — never continuous ticking
    if (secondsRemaining > 6 || secondsRemaining < 1) return;

    try {
      const now = this.ctx.currentTime;
      const uiVol = this.getMixVolume('ui');
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Escalating pitch urgency as turn timer expires:
      // 6s: 520Hz, 5s: 560Hz, 4s: 600Hz, 3s: 660Hz, 2s: 740Hz, 1s: 880Hz
      const freqMap = {
        6: 520,
        5: 560,
        4: 600,
        3: 660,
        2: 740,
        1: 880
      };
      const freq = freqMap[secondsRemaining] || 700;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const duration = secondsRemaining <= 2 ? 0.045 : 0.035;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.10 * uiVol, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.01);
    } catch {}
  }

  // Legacy tick alias safely mapped to timer warning
  playTick() {
    this.playTimerWarning(3);
  }

  // --- 14. BUTTON CLICK (Tiny tactile UI click) ---

  playButtonClick() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const uiVol = this.getMixVolume('ui');
      const jitter = 1 + (Math.random() * 0.04 - 0.02);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(460 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(360 * jitter, now + 0.025);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08 * uiVol, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.030);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }

  // --- 15. VICTORY (Triumphant, celebratory golden herald fanfare) ---

  playVictory() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const vicVol = this.getMixVolume('victory');

      // 1. Triumphant rising herald notes: G5 (784Hz) -> C6 (1046Hz) -> E6 (1318Hz) -> High G6 (1568Hz)
      const heraldNotes = [
        { freq: 783.99, start: 0, dur: 0.12 },
        { freq: 1046.50, start: 0.10, dur: 0.12 },
        { freq: 1318.51, start: 0.20, dur: 0.16 },
        { freq: 1567.98, start: 0.34, dur: 0.55 }
      ];

      heraldNotes.forEach(({ freq, start, dur }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const t = now + start;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2800, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.30 * vicVol, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + dur + 0.02);
      });

      // 2. Rich celebratory fanfare sustained chord backing (C5, G5, C6)
      const chordNotes = [523.25, 783.99, 1046.50];
      chordNotes.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + 0.34;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.20 * vicVol, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.88);
      });
    } catch {}
  }

  // --- 16. DEFEAT (Calm, gentle encouragement tone — never depressing) ---

  playDefeat() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      // Warm peaceful triad (A3, C4, E4 resolving peacefully)
      const calmChord = [220.00, 261.63, 329.63];
      calmChord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.05;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.12 * sfxVol, t + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.70);
      });
    } catch {}
  }

  // --- 17. COIN / REWARDS SOUND ---

  playCoin() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const uiVol = this.getMixVolume('ui');

      // Crisp dual coin chime
      [1046.50, 1318.51].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.12 * uiVol, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.26);
      });
    } catch {}
  }

  // --- 18. MATCH START COUNTDOWN CHIME ---

  playMatchStart() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      // Energetic rising royal herald chime (F5 -> A5 -> C6 -> F6)
      const notes = [698.46, 880.00, 1046.50, 1396.91];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.045;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.14 * sfxVol, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.38);
      });
    } catch {}
  }

  // --- 19. GENTLE CARD FLIGHT WHOOSH ---

  playWhoosh() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sfxVol = this.getMixVolume('sfx');

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.14;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.exponentialRampToValueAtTime(1500, now + 0.06);
      filter.frequency.exponentialRampToValueAtTime(600, now + 0.12);
      filter.Q.setValueAtTime(1.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07 * sfxVol, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch {}
  }

  // --- 20. AMBIENT BACKGROUND MUSIC (Tailored procedural synth pads for 5 Arenas) ---

  // --- 20. AMBIENT BACKGROUND MUSIC (Tailored procedural synth pads for 5 Arenas) ---

  startMusic(scene = 'lobby') {
    this.init();
    if (!this.ctx || !this.musicEnabled) return;

    // Mobile autoplay suspended check
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        if (this.musicEnabled) this.startMusic(scene);
      }).catch(() => {});
      return;
    }

    this.stopMusic();

    this.currentScene = scene || 'lobby';
    const norm = String(this.currentScene).toUpperCase();
    const musicVol = this.getMixVolume('music');

    // Arena-specific chord progressions, filter cutoff, and timing
    let chords;
    let filterCutoff = 580;
    let stepInterval = 3800;

    if (norm.includes('BEACH')) {
      // SUNSET_BEACH: Breezy, warm tropical major 7th chords
      chords = [
        [220.00, 277.18, 369.99, 440.00], // Dmaj7
        [246.94, 293.66, 369.99, 493.88], // Gmaj7
        [220.00, 277.18, 329.63, 440.00], // A
        [185.00, 220.00, 293.66, 369.99]  // F#m7
      ];
      filterCutoff = 620;
      stepInterval = 3900;
    } else if (norm.includes('FOREST') || norm.includes('PARK')) {
      // MYSTIC_FOREST: Enchanted modal nature chords (Em9, Cmaj7#11, Am7)
      chords = [
        [246.94, 293.66, 370.00, 493.88], // Em9
        [196.00, 246.94, 329.63, 370.00], // Cmaj7#11
        [220.00, 261.63, 329.63, 440.00], // Am7
        [246.94, 293.66, 370.00, 440.00]  // Bm7
      ];
      filterCutoff = 540;
      stepInterval = 4000;
    } else if (norm.includes('NEON')) {
      // NEON_CITY: Synthwave analog bass pad (Fm7, Dbmaj7, Bbm7, Eb7)
      chords = [
        [207.65, 261.63, 311.13, 415.30], // Fm7
        [207.65, 261.63, 329.63, 415.30], // Dbmaj7
        [233.08, 277.18, 349.23, 466.16], // Bbm7
        [196.00, 233.08, 311.13, 392.00]  // Eb7
      ];
      filterCutoff = 720;
      stepInterval = 3600;
    } else if (norm.includes('CHAMPIONSHIP')) {
      // CHAMPIONSHIP: Driving, noble fanfare pad (Dm7, Bbmaj7, Gm7, Asus4)
      chords = [
        [220.00, 261.63, 349.23, 440.00], // Dm7
        [220.00, 261.63, 293.66, 349.23], // Bbmaj7
        [233.08, 293.66, 349.23, 466.16], // Gm7
        [220.00, 293.66, 329.63, 440.00]  // Asus4
      ];
      filterCutoff = 660;
      stepInterval = 3700;
    } else if (norm.includes('ARENA') || norm.includes('ROYAL')) {
      // ROYAL_PALACE: Rich velvet palace harmonies (Am7, Fmaj7, Cmaj7, G)
      chords = [
        [220.00, 261.63, 329.63, 440.00], // Am7
        [220.00, 261.63, 349.23, 440.00], // Fmaj7
        [261.63, 329.63, 392.00, 523.25], // Cmaj7
        [246.94, 293.66, 392.00, 493.88]  // G add9
      ];
      filterCutoff = 580;
      stepInterval = 3800;
    } else {
      // LOBBY: Warm, relaxing ambient progression
      chords = [
        [220.00, 261.63, 329.63, 440.00], // Am7
        [220.00, 261.63, 349.23, 440.00], // Fmaj7
        [261.63, 329.63, 392.00, 523.25], // Cmaj7
        [246.94, 293.66, 349.23, 440.00]  // G7
      ];
      filterCutoff = 600;
      stepInterval = 3600;
    }

    let chordIndex = 0;

    const playStep = () => {
      if (!this.musicEnabled || !this.ctx || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const currentChord = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      const duration = stepInterval / 1000;

      currentChord.forEach(freq => {
        // Dual oscillator for rich audible warmth on mobile phone speakers
        const oscSine = this.ctx.createOscillator();
        const oscTri = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        oscSine.type = 'sine';
        oscSine.frequency.setValueAtTime(freq, now);

        oscTri.type = 'triangle';
        oscTri.frequency.setValueAtTime(freq * 1.002, now); // slight chorus detune

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(filterCutoff, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.12 * musicVol, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration - 0.05);

        oscSine.connect(filter);
        oscTri.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        oscSine.start(now);
        oscSine.stop(now + duration);
        oscTri.start(now);
        oscTri.stop(now + duration);

        this.activeMusicNodes.push({ osc: oscSine, gain });
        this.activeMusicNodes.push({ osc: oscTri, gain });
      });

      // Keep recent node references
      this.activeMusicNodes = this.activeMusicNodes.slice(-24);
    };

    playStep();
    this.musicInterval = setInterval(playStep, stepInterval);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.activeMusicNodes.length > 0 && this.ctx) {
      const now = this.ctx.currentTime;
      this.activeMusicNodes.forEach(({ gain, osc }) => {
        try {
          gain.gain.cancelScheduledValues(now);
          gain.gain.linearRampToValueAtTime(0.0001, now + 0.12);
          setTimeout(() => {
            try { osc.stop(); } catch {}
          }, 150);
        } catch {}
      });
      this.activeMusicNodes = [];
    }
  }
}

export const audioService = new AudioService();

// Auto-unlock AudioContext on first interaction
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    audioService.init();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
}
