/**
 * Candivelle Procedural Audio Engine
 * Uses Web Audio API for zero-dependency, zero-latency, high-fidelity sound synthesis
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private isSoundEnabled: boolean = true;
  private isMusicEnabled: boolean = true;
  private soundVolume: number = 0.8;
  private musicVolume: number = 0.5;

  private currentBgmInterval: number | null = null;
  private currentBgmTrack: 'home' | 'game' | null = null;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.isMusicEnabled ? this.musicVolume : 0;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.isSoundEnabled ? this.soundVolume : 0;
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(enabled ? this.soundVolume : 0, this.ctx.currentTime, 0.05);
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.isMusicEnabled = enabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(enabled ? this.musicVolume : 0, this.ctx.currentTime, 0.05);
    }
    if (!enabled) {
      this.stopMusic();
    } else if (this.currentBgmTrack) {
      this.playMusic(this.currentBgmTrack);
    }
  }

  public setSoundVolume(volume: number) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain && this.ctx && this.isSoundEnabled) {
      this.sfxGain.gain.setTargetAtTime(this.soundVolume, this.ctx.currentTime, 0.05);
    }
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain && this.ctx && this.isMusicEnabled) {
      this.musicGain.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.05);
    }
  }

  // --- SOUND EFFECTS ---

  public playButton() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playSwap() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playInvalid() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playMatch(comboLevel: number = 1) {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const baseFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    const pitchIndex = Math.min(comboLevel - 1, baseFreqs.length - 1);
    const freq = baseFreqs[pitchIndex];

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.5, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  public playRocket() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  public playBomb() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  public playRainbow() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98, 2093.0];
    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startT = now + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startT);

      gain.gain.setValueAtTime(0.12, startT);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(startT);
      osc.stop(startT + 0.25);
    });
  }

  public playHammer() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playCoin() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(now);
    osc1.stop(now + 0.08);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.35);
  }

  public playVictory() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + idx * 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, startTime);

      const dur = idx === 3 ? 0.8 : 0.2;
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(startTime);
      osc.stop(startTime + dur);
    });
  }

  public playDefeat() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4
    notes.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = now + idx * 0.18;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  // --- BACKGROUND MUSIC SYNTHESIS ---

  public playMusic(track: 'home' | 'game') {
    this.currentBgmTrack = track;
    if (!this.isMusicEnabled) return;
    this.initContext();
    this.stopMusic();

    let step = 0;
    // Cheerful, magical candy pentatonic scale
    const homeMelody = [
      523.25, 659.25, 783.99, 659.25, 880.0, 783.99, 659.25, 523.25,
      587.33, 659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25,
    ];
    // Bouncy, playful candy puzzle rhythm
    const gameMelody = [
      659.25, 659.25, 783.99, 880.0, 1046.5, 783.99, 659.25, 587.33,
      523.25, 587.33, 659.25, 523.25, 659.25, 783.99, 880.0, 1046.5,
    ];

    const melody = track === 'home' ? homeMelody : gameMelody;
    const tempo = track === 'home' ? 260 : 200; // ms per step

    this.currentBgmInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || !this.isMusicEnabled) return;
      const noteFreq = melody[step % melody.length];
      const now = this.ctx.currentTime;

      // Bell / Marimba synth
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = track === 'home' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(noteFreq, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (tempo / 1000) * 0.9);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + (tempo / 1000) * 0.95);

      // Bass note every 4 beats
      if (step % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(noteFreq * 0.25, now);
        bassGain.gain.setValueAtTime(0.06, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + (tempo / 1000) * 1.8);
        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);
        bassOsc.start(now);
        bassOsc.stop(now + (tempo / 1000) * 1.8);
      }

      step++;
    }, tempo);
  }

  public stopMusic() {
    if (this.currentBgmInterval !== null) {
      clearInterval(this.currentBgmInterval);
      this.currentBgmInterval = null;
    }
  }
}

export const soundManager = new SoundManager();
