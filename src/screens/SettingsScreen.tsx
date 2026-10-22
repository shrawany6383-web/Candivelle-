import React, { useState } from 'react';
import {
  Settings,
  ChevronLeft,
  Volume2,
  Music,
  Globe,
  Bell,
  Smartphone,
  Shield,
  FileText,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { GameSaveData, GameSettings } from '../services/storage';
import { TranslationDictionary, SUPPORTED_LANGUAGES, LanguageCode } from '../i18n/types';
import { soundManager } from '../audio/soundManager';

interface SettingsScreenProps {
  saveData: GameSaveData;
  t: TranslationDictionary;
  onBack: () => void;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenHelp: () => void;
  onOpenLanguage: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  saveData,
  t,
  onBack,
  onUpdateSettings,
  onResetProgress,
  onOpenPrivacy,
  onOpenTerms,
  onOpenHelp,
  onOpenLanguage,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === saveData.settings.language) || SUPPORTED_LANGUAGES[0];

  const handleToggleSound = () => {
    const next = !saveData.settings.sound;
    soundManager.setSoundEnabled(next);
    onUpdateSettings({ sound: next });
    if (next) soundManager.playButton();
  };

  const handleToggleMusic = () => {
    const next = !saveData.settings.music;
    soundManager.setMusicEnabled(next);
    onUpdateSettings({ music: next });
    soundManager.playButton();
  };

  const handleToggleVibration = () => {
    soundManager.playButton();
    const next = !saveData.settings.vibration;
    onUpdateSettings({ vibration: next });
    if (next && 'vibrate' in navigator) {
      try {
        navigator.vibrate(50);
      } catch {}
    }
  };

  const handleToggleNotifications = () => {
    soundManager.playButton();
    onUpdateSettings({ notifications: !saveData.settings.notifications });
  };

  const handleToggleReducedMotion = () => {
    soundManager.playButton();
    onUpdateSettings({ reducedMotion: !saveData.settings.reducedMotion });
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-[#200633] via-[#3d0959] to-[#1b052d] overflow-y-auto pb-28 select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 bg-[#2d094c]/90 border-b border-purple-500/30 sticky top-0 z-20 shadow-md">
        <button
          onClick={() => {
            soundManager.playButton();
            onBack();
          }}
          className="flex items-center gap-1 text-sm font-bold text-white bg-purple-900/60 hover:bg-purple-800 px-3 py-1.5 rounded-full border border-purple-400/50 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-300" />
          <h1 className="text-base font-black text-white">{t.settings}</h1>
        </div>

        <div className="w-16" />
      </div>

      <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4">
        {/* Audio Controls */}
        <div className="rounded-3xl bg-[#2e0947]/90 border border-purple-400/40 p-4 shadow-md flex flex-col gap-3.5">
          <h2 className="text-xs font-black uppercase text-pink-300 tracking-wider">
            Audio Preferences
          </h2>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
              <Volume2 className="w-5 h-5 text-pink-400" />
              <span className="text-sm font-black">{t.sound}</span>
            </div>
            <button
              onClick={handleToggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                saveData.settings.sound ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  saveData.settings.sound ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Music Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
              <Music className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-black">{t.music}</span>
            </div>
            <button
              onClick={handleToggleMusic}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                saveData.settings.music ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  saveData.settings.music ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Language & Accessibility */}
        <div className="rounded-3xl bg-[#2e0947]/90 border border-purple-400/40 p-4 shadow-md flex flex-col gap-3.5">
          <h2 className="text-xs font-black uppercase text-pink-300 tracking-wider">
            Language &amp; Controls
          </h2>

          {/* Language Selector */}
          <button
            onClick={() => {
              soundManager.playButton();
              onOpenLanguage();
            }}
            className="flex items-center justify-between text-white hover:bg-white/5 p-1 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-black">{t.language}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-400/50">
              <span className="text-sm">{currentLang.flag}</span>
              <span className="text-xs font-bold text-yellow-200">{currentLang.nativeName}</span>
            </div>
          </button>

          {/* Haptics / Vibration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
              <Smartphone className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-black">{t.vibration}</span>
            </div>
            <button
              onClick={handleToggleVibration}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                saveData.settings.vibration ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  saveData.settings.vibration ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
              <Bell className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-black">{t.notifications}</span>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                saveData.settings.notifications ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  saveData.settings.notifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span className="text-sm font-black">{t.reducedMotion}</span>
            </div>
            <button
              onClick={handleToggleReducedMotion}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                saveData.settings.reducedMotion ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  saveData.settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Legal & Help Links */}
        <div className="rounded-3xl bg-[#2e0947]/90 border border-purple-400/40 p-3 shadow-md flex flex-col gap-1 text-white">
          <button
            onClick={() => {
              soundManager.playButton();
              onOpenPrivacy();
            }}
            className="flex items-center justify-between p-2.5 hover:bg-white/5 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black">{t.privacyPolicy}</span>
            </div>
            <span className="text-xs text-purple-300">›</span>
          </button>

          <button
            onClick={() => {
              soundManager.playButton();
              onOpenTerms();
            }}
            className="flex items-center justify-between p-2.5 hover:bg-white/5 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-black">{t.termsConditions}</span>
            </div>
            <span className="text-xs text-purple-300">›</span>
          </button>

          <button
            onClick={() => {
              soundManager.playButton();
              onOpenHelp();
            }}
            className="flex items-center justify-between p-2.5 hover:bg-white/5 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black">{t.helpSupport}</span>
            </div>
            <span className="text-xs text-purple-300">›</span>
          </button>
        </div>

        {/* Reset Progress Section */}
        <button
          onClick={() => {
            soundManager.playButton();
            setShowResetConfirm(true);
          }}
          className="w-full py-3 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-300 font-black text-xs shadow flex items-center justify-center gap-2 hover:bg-rose-900/60 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.resetProgress}</span>
        </button>

        {/* Version information */}
        <div className="text-center text-[10px] text-purple-400/70 font-semibold">
          CANDIVELLE v1.0.0 (Android Build 101) • Offline PWA Ready
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-gradient-to-b from-[#4a0d2a] to-[#250414] border-3 border-rose-500 rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-3 text-white text-center">
            <AlertTriangle className="w-10 h-10 text-rose-400 animate-bounce" />
            <h3 className="text-base font-black text-white">{t.resetConfirmTitle}</h3>
            <p className="text-xs text-rose-200">{t.resetConfirmDesc}</p>

            <div className="w-full flex gap-2 mt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-purple-900 text-white font-bold text-xs"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  soundManager.playButton();
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs shadow-md"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
