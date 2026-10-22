import React from 'react';
import { Settings, Plus, Heart, ShieldCheck } from 'lucide-react';
import { GameSaveData } from '../services/storage';
import { TranslationDictionary } from '../i18n/types';

interface HeaderBarProps {
  saveData: GameSaveData;
  t: TranslationDictionary;
  onOpenSettings: () => void;
  onOpenShop: () => void;
  onOpenProfile?: () => void;
  onOpenAndroidGuide?: () => void;
  onRefillLives?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  saveData,
  t,
  onOpenSettings,
  onOpenShop,
  onOpenProfile,
  onOpenAndroidGuide,
  onRefillLives,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-b from-[#2a0845]/90 to-transparent z-30 select-none">
      {/* Lives / Energy */}
      <button
        onClick={onRefillLives}
        className="flex items-center gap-1.5 bg-[#401267]/80 border-2 border-[#a855f7]/50 rounded-full pl-2 pr-3 py-1 shadow-md hover:scale-105 active:scale-95 transition-transform"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-inner text-white">
          <Heart className="w-4 h-4 fill-white animate-pulse" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-pink-200 uppercase font-black tracking-wide leading-none">
            {t.lives}
          </span>
          <span className="text-xs font-black text-white leading-tight">
            {saveData.lives >= saveData.maxLives ? t.full : `${saveData.lives}/${saveData.maxLives}`}
          </span>
        </div>
      </button>

      {/* Middle Currencies: Coins & Diamonds */}
      <div className="flex items-center gap-2">
        {/* Coins */}
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1.5 bg-[#3b1260]/85 border-2 border-amber-400/60 rounded-full pl-1.5 pr-2 py-1 shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 flex items-center justify-center text-[11px] font-black text-amber-950 shadow">
            🪙
          </div>
          <span className="text-xs font-black text-amber-200 tabular-nums">
            {saveData.coins.toLocaleString()}
          </span>
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            <Plus className="w-3 h-3 stroke-[3]" />
          </div>
        </button>

        {/* Diamonds */}
        <button
          onClick={onOpenShop}
          className="flex items-center gap-1.5 bg-[#3b1260]/85 border-2 border-cyan-400/60 rounded-full pl-1.5 pr-2 py-1 shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-600 flex items-center justify-center text-[11px] font-black text-sky-950 shadow">
            💎
          </div>
          <span className="text-xs font-black text-cyan-200 tabular-nums">
            {saveData.diamonds.toLocaleString()}
          </span>
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            <Plus className="w-3 h-3 stroke-[3]" />
          </div>
        </button>
      </div>

      {/* Right Actions: Android guide & Settings */}
      <div className="flex items-center gap-1.5">
        {onOpenAndroidGuide && (
          <button
            onClick={onOpenAndroidGuide}
            title={t.androidGuide}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 border-2 border-emerald-300 flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onOpenSettings}
          title={t.settings}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 border-2 border-cyan-300 flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
