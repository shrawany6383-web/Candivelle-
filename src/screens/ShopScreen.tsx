import React, { useState } from 'react';
import { ShoppingBag, ChevronLeft, Sparkles, Check, Gift } from 'lucide-react';
import { GameSaveData } from '../services/storage';
import { TranslationDictionary } from '../i18n/types';
import { soundManager } from '../audio/soundManager';

interface ShopScreenProps {
  saveData: GameSaveData;
  t: TranslationDictionary;
  onBack: () => void;
  onAddCurrencies: (coins: number, diamonds: number) => void;
  onBuyBooster: (booster: 'hammer' | 'shuffle' | 'rocket' | 'colorSwirl', costCoins: number) => boolean;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  saveData,
  t,
  onBack,
  onAddCurrencies,
  onBuyBooster,
}) => {
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);

  const handleClaimFreeDailyGift = () => {
    soundManager.playCoin();
    onAddCurrencies(250, 5);
    setPurchaseNotice('Claimed 250 Coins + 5 Diamonds!');
    setTimeout(() => setPurchaseNotice(null), 2500);
  };

  const handleClaimSpecialOffer = () => {
    soundManager.playVictory();
    onAddCurrencies(5000, 50);
    setPurchaseNotice('Special Offer Claimed: 5,000 Coins + 50 Diamonds!');
    setTimeout(() => setPurchaseNotice(null), 3000);
  };

  const handleBuyItem = (
    booster: 'hammer' | 'shuffle' | 'rocket' | 'colorSwirl',
    cost: number,
    name: string
  ) => {
    const success = onBuyBooster(booster, cost);
    if (success) {
      soundManager.playCoin();
      setPurchaseNotice(`Purchased 1x ${name}!`);
      setTimeout(() => setPurchaseNotice(null), 2000);
    } else {
      soundManager.playInvalid();
      setPurchaseNotice('Not enough coins!');
      setTimeout(() => setPurchaseNotice(null), 2000);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-[#200633] via-[#3d0959] to-[#1b052d] overflow-y-auto pb-24 select-none">
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
          <ShoppingBag className="w-5 h-5 text-amber-300" />
          <h1 className="text-base font-black text-white">{t.shop}</h1>
        </div>

        <div className="w-16" />
      </div>

      {/* Floating Notice Toast */}
      {purchaseNotice && (
        <div className="sticky top-14 z-30 flex justify-center px-4 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-300 rounded-full shadow-xl text-white text-xs font-black flex items-center gap-2">
            <Check className="w-4 h-4 text-yellow-300 stroke-[3]" />
            <span>{purchaseNotice}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4">
        {/* Special Offer Banner (matching reference mockup!) */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#db2777] via-[#9333ea] to-[#4f46e5] border-3 border-yellow-300 p-4 shadow-xl overflow-hidden text-white flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider bg-yellow-400 text-purple-950 px-2.5 py-0.5 rounded-full shadow">
              {t.specialOffer}
            </span>
            <span className="text-xs font-black text-yellow-200">LIMITED TIME</span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col">
              <h2 className="text-lg font-black leading-tight text-yellow-100">
                Royal Starter Pack
              </h2>
              <p className="text-xs font-bold text-pink-200">
                +5,000 Coins 🪙 &amp; +50 Diamonds 💎
              </p>
            </div>
            <div className="text-3xl animate-bounce">🎁</div>
          </div>

          <button
            onClick={handleClaimSpecialOffer}
            className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 border-2 border-emerald-200 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>Claim Offer (Free Trial Pack)</span>
          </button>
        </div>

        {/* Free Daily Coin Grant */}
        <div className="rounded-2xl bg-[#370e57]/90 border border-purple-400/40 p-3 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl shadow">
              🎁
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white">Daily Gift Box</span>
              <span className="text-[10px] text-pink-200 font-semibold">+250 Coins &amp; +5 Diamonds</span>
            </div>
          </div>
          <button
            onClick={handleClaimFreeDailyGift}
            className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xs shadow active:scale-95"
          >
            Claim
          </button>
        </div>

        {/* Boosters Market */}
        <h2 className="text-sm font-black uppercase text-pink-200 tracking-wider mt-2">
          Magic Boosters
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {/* Hammer */}
          <div className="rounded-2xl bg-[#2e0947]/90 border border-purple-400/40 p-3 flex flex-col items-center text-center gap-1.5 shadow">
            <span className="text-3xl">🔨</span>
            <span className="text-xs font-black text-white">{t.boosterHammer}</span>
            <span className="text-[10px] text-purple-300 line-clamp-2">
              {t.boosterHammerDesc}
            </span>
            <button
              onClick={() => handleBuyItem('hammer', 200, t.boosterHammer)}
              className="w-full mt-1 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-300 text-white font-black text-xs shadow flex items-center justify-center gap-1 active:scale-95"
            >
              <span>200</span>
              <span>🪙</span>
            </button>
          </div>

          {/* Shuffle */}
          <div className="rounded-2xl bg-[#2e0947]/90 border border-purple-400/40 p-3 flex flex-col items-center text-center gap-1.5 shadow">
            <span className="text-3xl">🔄</span>
            <span className="text-xs font-black text-white">{t.boosterShuffle}</span>
            <span className="text-[10px] text-purple-300 line-clamp-2">
              {t.boosterShuffleDesc}
            </span>
            <button
              onClick={() => handleBuyItem('shuffle', 150, t.boosterShuffle)}
              className="w-full mt-1 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-300 text-white font-black text-xs shadow flex items-center justify-center gap-1 active:scale-95"
            >
              <span>150</span>
              <span>🪙</span>
            </button>
          </div>

          {/* Rocket */}
          <div className="rounded-2xl bg-[#2e0947]/90 border border-purple-400/40 p-3 flex flex-col items-center text-center gap-1.5 shadow">
            <span className="text-3xl">🚀</span>
            <span className="text-xs font-black text-white">{t.boosterRocket}</span>
            <span className="text-[10px] text-purple-300 line-clamp-2">
              {t.boosterRocketDesc}
            </span>
            <button
              onClick={() => handleBuyItem('rocket', 250, t.boosterRocket)}
              className="w-full mt-1 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-300 text-white font-black text-xs shadow flex items-center justify-center gap-1 active:scale-95"
            >
              <span>250</span>
              <span>🪙</span>
            </button>
          </div>

          {/* Color Swirl */}
          <div className="rounded-2xl bg-[#2e0947]/90 border border-purple-400/40 p-3 flex flex-col items-center text-center gap-1.5 shadow">
            <span className="text-3xl">🌈</span>
            <span className="text-xs font-black text-white">{t.boosterColor}</span>
            <span className="text-[10px] text-purple-300 line-clamp-2">
              {t.boosterColorDesc}
            </span>
            <button
              onClick={() => handleBuyItem('colorSwirl', 300, t.boosterColor)}
              className="w-full mt-1 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-300 text-white font-black text-xs shadow flex items-center justify-center gap-1 active:scale-95"
            >
              <span>300</span>
              <span>🪙</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
