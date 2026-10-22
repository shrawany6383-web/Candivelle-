import { LanguageCode } from '../i18n/types';

export interface LevelRecord {
  stars: number;
  highScore: number;
}

export interface BoostersInventory {
  hammer: number;
  shuffle: number;
  rocket: number;
  colorSwirl: number;
}

export interface GameSettings {
  sound: boolean;
  music: boolean;
  soundVolume: number;
  musicVolume: number;
  vibration: boolean;
  reducedMotion: boolean;
  notifications: boolean;
  language: LanguageCode;
}

export interface GameSaveData {
  version: number;
  currentLevel: number;
  maxUnlockedLevel: number;
  completedLevels: Record<number, LevelRecord>;
  coins: number;
  diamonds: number;
  lives: number;
  maxLives: number;
  lastLifeRefillTime: number;
  boosters: BoostersInventory;
  dailyRewards: {
    lastClaimDate: string;
    streak: number;
  };
  achievements: Record<string, boolean>;
  settings: GameSettings;
  profile: {
    name: string;
    avatarId: number;
    totalCandiesMatched: number;
    totalStars: number;
  };
}

const SAVE_KEY = 'candivelle_save_v1';
const LIFE_RECHARGE_MS = 15 * 60 * 1000; // 15 mins per life

const DEFAULT_SAVE: GameSaveData = {
  version: 1,
  currentLevel: 1,
  maxUnlockedLevel: 1,
  completedLevels: {},
  coins: 1250,
  diamonds: 50,
  lives: 5,
  maxLives: 5,
  lastLifeRefillTime: Date.now(),
  boosters: {
    hammer: 3,
    shuffle: 3,
    rocket: 3,
    colorSwirl: 2,
  },
  dailyRewards: {
    lastClaimDate: '',
    streak: 0,
  },
  achievements: {},
  settings: {
    sound: true,
    music: true,
    soundVolume: 0.8,
    musicVolume: 0.5,
    vibration: true,
    reducedMotion: false,
    notifications: true,
    language: 'en-US',
  },
  profile: {
    name: 'Candy Princess',
    avatarId: 1,
    totalCandiesMatched: 0,
    totalStars: 0,
  },
};

export class StorageService {
  private static cachedData: GameSaveData | null = null;

  public static load(): GameSaveData {
    if (this.cachedData) return this.cachedData;

    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge with defaults in case new fields were added
        const merged: GameSaveData = {
          ...DEFAULT_SAVE,
          ...parsed,
          boosters: { ...DEFAULT_SAVE.boosters, ...(parsed.boosters || {}) },
          settings: { ...DEFAULT_SAVE.settings, ...(parsed.settings || {}) },
          profile: { ...DEFAULT_SAVE.profile, ...(parsed.profile || {}) },
          completedLevels: parsed.completedLevels || {},
        };
        this.refillLivesIfNeeded(merged);
        this.cachedData = merged;
        return merged;
      }
    } catch {
      // fallback
    }

    const initial = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    this.cachedData = initial;
    this.save(initial);
    return initial;
  }

  public static save(data: GameSaveData): void {
    this.cachedData = data;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  }

  private static refillLivesIfNeeded(data: GameSaveData): void {
    if (data.lives >= data.maxLives) {
      data.lastLifeRefillTime = Date.now();
      return;
    }
    const elapsed = Date.now() - (data.lastLifeRefillTime || Date.now());
    const livesToAdd = Math.floor(elapsed / LIFE_RECHARGE_MS);
    if (livesToAdd > 0) {
      data.lives = Math.min(data.maxLives, data.lives + livesToAdd);
      data.lastLifeRefillTime = Date.now() - (elapsed % LIFE_RECHARGE_MS);
    }
  }

  public static resetProgress(): GameSaveData {
    const fresh = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    this.save(fresh);
    return fresh;
  }
}
