export type LanguageCode =
  | 'en-US'
  | 'hi-IN'
  | 'es-ES'
  | 'fr-FR'
  | 'de-DE'
  | 'ja-JP'
  | 'ko-KR'
  | 'ar-SA'
  | 'pt-BR';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en-US', name: 'English (USA)', nativeName: 'English (USA)', flag: '🇺🇸', dir: 'ltr' },
  { code: 'hi-IN', name: 'Hindi (India)', nativeName: 'हिन्दी (Hindi)', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español (Spanish)', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français (French)', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch (German)', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語 (Japanese)', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko-KR', name: 'Korean', nativeName: '한국어 (Korean)', flag: '🇰🇷', dir: 'ltr' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية (Arabic)', flag: '🇸🇦', dir: 'rtl' },
  { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português (Portuguese)', flag: '🇧🇷', dir: 'ltr' },
];

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  loading: string;
  play: string;
  continueGame: string;
  events: string;
  dailyRewards: string;
  shop: string;
  rewards: string;
  trophy: string;
  settings: string;
  profile: string;
  levelMap: string;
  level: string;
  levelNum: string;
  moves: string;
  score: string;
  target: string;
  victory: string;
  defeat: string;
  completed: string;
  failed: string;
  nextLevel: string;
  replay: string;
  map: string;
  resume: string;
  paused: string;
  restart: string;
  sound: string;
  music: string;
  soundVolume: string;
  musicVolume: string;
  language: string;
  notifications: string;
  vibration: string;
  reducedMotion: string;
  privacyPolicy: string;
  termsConditions: string;
  helpSupport: string;
  resetProgress: string;
  resetConfirmTitle: string;
  resetConfirmDesc: string;
  confirm: string;
  cancel: string;
  claim: string;
  claimed: string;
  day: string;
  coins: string;
  diamonds: string;
  lives: string;
  full: string;
  specialOffer: string;
  boosterHammer: string;
  boosterShuffle: string;
  boosterRocket: string;
  boosterColor: string;
  boosterHammerDesc: string;
  boosterShuffleDesc: string;
  boosterRocketDesc: string;
  boosterColorDesc: string;
  sweetCombo: string;
  tastyCombo: string;
  deliciousCombo: string;
  sugarCrush: string;
  noMovesLeft: string;
  getExtraMoves: string;
  extraMovesOffer: string;
  outOfLives: string;
  refillLives: string;
  achievements: string;
  trophies: string;
  androidGuide: string;
  offlineReady: string;
  chapter1: string;
  chapter2: string;
  chapter3: string;
  chapter4: string;
}
