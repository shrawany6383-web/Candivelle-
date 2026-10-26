import React from 'react';
import { Play, Sparkles, Gift, Calendar, Trophy, ShoppingBag, ShieldCheck, Globe } from 'lucide-react';
import { GameSaveData } from '../services/storage';
import { TranslationDictionary } from '../i18n/types';
import { ThreeCandyHero } from '../components/ThreeCandyHero';
import { soundManager } from '../audio/soundManager';

interface HomeScreenProps {
  saveData: GameSaveData;
  t: TranslationDictionary;
  onPlay: () => void;
  onContinue: () => void;
  onOpenEvents: () => void;
  onOpenDailyRewards: () => void;
  onOpenShop: () => void;
  onOpenTrophy: () => void;
  onOpenLanguage: () => void;
  onOpenAndroidGuide: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  saveData,
  t,
  onPlay,
  onContinue,
  onOpenEvents,
  onOpenDailyRewards,
  onOpenShop,
  onOpenTrophy,
  onOpenLanguage,
  onOpenAndroidGuide,
}) => {
  const currentLevel = saveData.currentLevel || 1;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-y-auto overflow-x-hidden pb-20 select-none">
      {/* Background Candy Fantasy Wallpaper */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_20%,#a855f7_0%,#4c0519_100%)]">
        <div className="absolute top-1/4 -left-10 w-44 h-44 rounded-full bg-pink-500/30 blur-3xl" />
        <div className="absolute top-1/3 -right-10 w-48 h-48 rounded-full bg-amber-400/25 blur-3xl" />
      </div>

      {/* Brand Hero & Crown */}
      <div className="relative w-full flex flex-col items-center pt-2 z-10 px-4">
        {/* Crown with Glowing Jewels */}
        <div className="relative -mb-3 z-10">
          <svg className="w-16 h-12 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" viewBox="0 0 100 80">
            <polygon
              points="10,70 15,25 35,50 50,15 65,50 85,25 90,70"
              fill="url(#crownGradHome)"
              stroke="#fef08a"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="15" cy="22" r="6" fill="#f43f5e" />
            <circle cx="50" cy="12" r="7" fill="#06b6d4" />
            <circle cx="85" cy="22" r="6" fill="#f43f5e" />
            <defs>
              <linearGradient id="crownGradHome" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* CANDIVELLE Title */}
        <h1
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-500 tracking-wider text-center drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)]"
          style={{ textShadow: '0 3px 12px rgba(234, 179, 8, 0.7)' }}
        >
          CANDIVELLE
        </h1>

        {/* Subtitle Ribbon */}
        <div className="px-5 py-1 -mt-1 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 rounded-full border border-pink-200/50 shadow-md">
          <span className="text-[11px] font-black uppercase text-white tracking-widest drop-shadow">
            {t.tagline}
          </span>
        </div>
      </div>

      {/* 3D Cartoon Hero Centerpiece */}
      <div className="relative w-full max-w-sm h-56 md:h-64 flex items-center justify-center my-1 z-10">
        <ThreeCandyHero interactive={true} />

        {/* Floating Mascot Badge on Left */}
        <div className="absolute left-3 bottom-2 flex items-center gap-2 bg-[#2d094c]/80 backdrop-blur-sm border-2 border-pink-400/60 rounded-2xl p-1.5 shadow-lg">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-yellow-300 bg-pink-400">
            <img
              src="/assets/aistudio/file_00000000c06c82088ba454beec7b950f_a13b195c.png"
              alt="Princess"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="pr-2">
            <p className="text-[10px] text-pink-300 font-bold leading-none">{t.chapter1}</p>
            <p className="text-xs font-black text-white leading-tight">
              {t.levelNum.replace('{n}', currentLevel.toString())}
            </p>
          </div>
        </div>

        {/* Quick Language Pill on Right */}
        <button
          onClick={() => {
            soundManager.playButton();
            onOpenLanguage();
          }}
          className="absolute right-3 bottom-2 flex items-center gap-1.5 bg-[#2d094c]/85 border-2 border-indigo-400/60 rounded-full px-2.5 py-1.5 shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          <Globe className="w-4 h-4 text-cyan-300" />
          <span className="text-xs font-black text-white">{t.language}</span>
        </button>
      </div>

      {/* Main Play CTAs */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3 z-10 px-4">
        {/* Giant Juicy Green Play Button */}
        <button
          onClick={() => {
            soundManager.playButton();
            onPlay();
          }}
          className="w-full py-4 rounded-3xl bg-gradient-to-b from-[#4ade80] via-[#22c55e] to-[#15803d] border-t-4 border-l-2 border-r-2 border-[#86efac] border-b-4 border-[#14532d] shadow-[0_8px_20px_rgba(34,197,94,0.5)] flex items-center justify-center gap-3 active:translate-y-1 active:shadow-[0_3px_10px_rgba(34,197,94,0.5)] transition-all hover:brightness-110"
        >
          <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center shadow-inner">
            <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
          </div>
          <span className="text-2xl font-black text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {t.play}
          </span>
        </button>

        {/* Continue Saved Level */}
        {currentLevel > 1 && (
          <button
            onClick={() => {
              soundManager.playButton();
              onContinue();
            }}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 border-2 border-amber-300 text-white font-extrabold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>
              {t.continueGame} ({t.levelNum.replace('{n}', currentLevel.toString())})
            </span>
          </button>
        )}

        {/* Secondary Row: Events & Daily Rewards */}
        <div className="w-full grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => {
              soundManager.playButton();
              onOpenEvents();
            }}
            className="py-3 px-3 rounded-2xl bg-gradient-to-b from-[#ec4899] to-[#be185d] border-2 border-pink-300 shadow-md flex items-center justify-center gap-2 text-white hover:brightness-105 active:scale-95 transition-transform"
          >
            <Gift className="w-5 h-5 text-yellow-200" />
            <span className="text-xs font-black">{t.events}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playButton();
              onOpenDailyRewards();
            }}
            className="py-3 px-3 rounded-2xl bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] border-2 border-purple-300 shadow-md flex items-center justify-center gap-2 text-white hover:brightness-105 active:scale-95 transition-transform"
          >
            <Calendar className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-black">{t.dailyRewards}</span>
          </button>
        </div>

        {/* Android Packaging & Offline Info Pill */}
        <div className="w-full flex items-center justify-between px-2 pt-2 text-[11px] text-pink-200/80 font-bold">
          <button
            onClick={() => {
              soundManager.playButton();
              onOpenAndroidGuide();
            }}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.androidGuide}</span>
          </button>
          <span className="flex items-center gap-1 text-cyan-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            {t.offlineReady}
          </span>
        </div>
      </div>
    </div>
  );
};
