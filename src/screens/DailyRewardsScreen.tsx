import React, { useState } from 'react';
import { Calendar, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { GameSaveData } from '../services/storage';
import { TranslationDictionary } from '../i18n/types';
import { soundManager } from '../audio/soundManager';

interface DailyRewardsScreenProps {
  saveData: GameSaveData;
  t: TranslationDictionary;
  onBack: () => void;
  onClaimReward: (day: number, coins: number, diamonds: number) => void;
}

export const DailyRewardsScreen: React.FC<DailyRewardsScreenProps> = ({
  saveData,
  t,
  onBack,
  onClaimReward,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const lastClaim = saveData.dailyRewards.lastClaimDate;
  const currentStreak = saveData.dailyRewards.streak || 0;
  const isAlreadyClaimedToday = lastClaim === todayStr;

  // Active claimable day is streak + 1 (capped at 7)
  const claimableDay = isAlreadyClaimedToday ? currentStreak : (currentStreak % 7) + 1;

  const rewardsSchedule = [
    { day: 1, coins: 100, diamonds: 2, icon: '🪙' },
    { day: 2, coins: 200, diamonds: 5, icon: '🍬' },
    { day: 3, coins: 300, diamonds: 5, icon: '💎' },
    { day: 4, coins: 500, diamonds: 10, icon: '🔨' },
    { day: 5, coins: 800, diamonds: 12, icon: '🚀' },
    { day: 6, coins: 900, diamonds: 15, icon: '🌈' },
    { day: 7, coins: 1500, diamonds: 30, icon: '👑' },
  ];

  const handleClaim = (dayItem: typeof rewardsSchedule[0]) => {
    if (isAlreadyClaimedToday) return;
    soundManager.playVictory();
    onClaimReward(dayItem.day, dayItem.coins, dayItem.diamonds);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-[#200633] via-[#3d0959] to-[#1b052d] overflow-y-auto pb-24 select-none">
      {/* Top Bar */}
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
          <Calendar className="w-5 h-5 text-emerald-400" />
          <h1 className="text-base font-black text-white">{t.dailyRewards}</h1>
        </div>

        <div className="w-16" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-pink-600 to-purple-700 border-2 border-yellow-300 p-4 shadow-xl flex items-center gap-3 text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
            🎁
          </div>
          <div>
            <h2 className="text-base font-black text-yellow-200">
              Sweet Daily Gifts
            </h2>
            <p className="text-xs text-pink-100 font-semibold">
              Log in every day to unlock royal rewards and diamonds!
            </p>
          </div>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {rewardsSchedule.slice(0, 6).map((item) => {
            const isClaimed = item.day <= currentStreak && (isAlreadyClaimedToday || item.day < claimableDay);
            const isReady = item.day === claimableDay && !isAlreadyClaimedToday;

            return (
              <div
                key={item.day}
                className={`relative rounded-2xl p-3 flex flex-col items-center justify-between border-2 transition-all ${
                  isReady
                    ? 'bg-gradient-to-b from-amber-400 to-yellow-600 border-yellow-200 text-amber-950 scale-105 shadow-lg shadow-yellow-400/40 ring-2 ring-white animate-pulse'
                    : isClaimed
                    ? 'bg-[#2a0845]/60 border-emerald-500/50 text-emerald-300 opacity-80'
                    : 'bg-[#2f0c4f]/90 border-purple-400/30 text-purple-200'
                }`}
              >
                <span className="text-[11px] font-black uppercase">
                  {t.day.replace('{n}', item.day.toString())}
                </span>

                <div className="text-3xl my-1.5">{item.icon}</div>

                <div className="flex flex-col items-center">
                  <span className="text-xs font-black">+{item.coins} 🪙</span>
                  <span className="text-[10px] font-bold">+{item.diamonds} 💎</span>
                </div>

                {isClaimed && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Day 7 Big Mega Chest */}
        {(() => {
          const day7 = rewardsSchedule[6];
          const isClaimed = day7.day <= currentStreak && isAlreadyClaimedToday;
          const isReady = day7.day === claimableDay && !isAlreadyClaimedToday;

          return (
            <div
              className={`rounded-3xl p-4 border-3 flex items-center justify-between transition-all ${
                isReady
                  ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 border-yellow-200 text-white shadow-xl shadow-pink-500/40 scale-102 ring-2 ring-white'
                  : isClaimed
                  ? 'bg-[#2a0845]/70 border-emerald-500/60 text-emerald-200'
                  : 'bg-[#2f0c4f]/90 border-purple-400/40 text-purple-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-bounce">👑</span>
                <div>
                  <h3 className="text-sm font-black text-yellow-200">
                    Day 7: Royal Grand Chest!
                  </h3>
                  <p className="text-xs font-black text-white">
                    +{day7.coins} Coins 🪙 &amp; +{day7.diamonds} Diamonds 💎
                  </p>
                </div>
              </div>

              {isClaimed ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black">
                  {t.claimed}
                </span>
              ) : isReady ? (
                <button
                  onClick={() => handleClaim(day7)}
                  className="px-4 py-2 rounded-xl bg-white text-purple-900 font-black text-xs shadow-lg active:scale-95"
                >
                  {t.claim}
                </button>
              ) : (
                <span className="text-xs font-bold text-purple-300">Locked</span>
              )}
            </div>
          );
        })()}

        {/* Claim Today CTA */}
        {!isAlreadyClaimedToday && (
          <button
            onClick={() => handleClaim(rewardsSchedule[claimableDay - 1])}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 border-2 border-emerald-200 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <span>
              {t.claim} {t.day.replace('{n}', claimableDay.toString())} Reward
            </span>
          </button>
        )}

        {isAlreadyClaimedToday && (
          <div className="text-center py-2 text-xs font-bold text-pink-200 bg-purple-900/40 rounded-2xl border border-purple-500/30">
            ✓ Today's reward collected! Next reward available tomorrow.
          </div>
        )}
      </div>
    </div>
  );
};
