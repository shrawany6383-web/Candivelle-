import React from 'react';
import { Gift, ChevronLeft, Trophy, Clock, Star, Sparkles } from 'lucide-react';
import { GameSaveData } from '../services/storage';
import { TranslationDictionary } from '../i18n/types';
import { soundManager } from '../audio/soundManager';

interface EventsScreenProps {
  saveData: GameSaveData;
  t: TranslationDictionary;
  onBack: () => void;
  onClaimEventReward: (name: string, coins: number, diamonds: number) => void;
}

export const EventsScreen: React.FC<EventsScreenProps> = ({
  saveData,
  t,
  onBack,
  onClaimEventReward,
}) => {
  const events = [
    {
      id: 'candy_rush',
      title: 'Candy Rush Tournament',
      desc: 'Clear 100 candies in any level to earn the tournament prize!',
      target: 100,
      current: Math.min(100, saveData.profile.totalCandiesMatched || 45),
      coins: 500,
      diamonds: 10,
      timeLeft: '2d 14h',
      icon: '🏆',
      bg: 'from-amber-500 to-rose-600',
    },
    {
      id: 'star_hunt',
      title: 'Weekend Star Hunt',
      desc: 'Collect 15 total stars across the candy kingdom.',
      target: 15,
      current: Math.min(
        15,
        Object.values(saveData.completedLevels).reduce((acc, c) => acc + c.stars, 0)
      ),
      coins: 800,
      diamonds: 15,
      timeLeft: '4d 08h',
      icon: '⭐',
      bg: 'from-purple-600 to-indigo-700',
    },
    {
      id: 'princess_quest',
      title: "Princess Candivelle's Quest",
      desc: 'Reach Level 10 to receive the Royal Tiara booster pack!',
      target: 10,
      current: Math.min(10, saveData.maxUnlockedLevel || 1),
      coins: 1000,
      diamonds: 25,
      timeLeft: '6d 21h',
      icon: '👑',
      bg: 'from-pink-500 to-purple-700',
    },
  ];

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
          <Gift className="w-5 h-5 text-pink-300" />
          <h1 className="text-base font-black text-white">{t.events}</h1>
        </div>

        <div className="w-16" />
      </div>

      {/* Main Events List */}
      <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4">
        {events.map((evt) => {
          const isComplete = evt.current >= evt.target;
          const isClaimed = !!saveData.achievements[evt.id];

          return (
            <div
              key={evt.id}
              className={`rounded-3xl p-4 border-2 shadow-lg flex flex-col gap-3 bg-gradient-to-r ${evt.bg} text-white border-white/30`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{evt.icon}</span>
                  <div>
                    <h2 className="text-sm font-black leading-tight">{evt.title}</h2>
                    <span className="text-[10px] text-pink-200 flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3 inline" /> {evt.timeLeft} left
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-yellow-300">
                    +{evt.coins} 🪙 / +{evt.diamonds} 💎
                  </span>
                </div>
              </div>

              <p className="text-xs text-white/90 font-medium">{evt.desc}</p>

              {/* Progress Bar */}
              <div className="w-full flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-bold text-white/80">
                  <span>Progress</span>
                  <span>
                    {evt.current} / {evt.target}
                  </span>
                </div>
                <div className="w-full h-3 bg-black/30 rounded-full p-0.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-emerald-400"
                    style={{ width: `${Math.min(100, (evt.current / evt.target) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Claim Button */}
              {isClaimed ? (
                <div className="text-center py-2 text-xs font-black text-emerald-200 bg-black/20 rounded-xl">
                  {t.claimed}
                </div>
              ) : (
                <button
                  disabled={!isComplete}
                  onClick={() => {
                    soundManager.playVictory();
                    onClaimEventReward(evt.id, evt.coins, evt.diamonds);
                  }}
                  className={`w-full py-2.5 rounded-xl font-black text-xs shadow flex items-center justify-center gap-1.5 transition-transform active:scale-95 ${
                    isComplete
                      ? 'bg-gradient-to-r from-emerald-400 to-green-600 text-white border-2 border-emerald-200'
                      : 'bg-black/30 text-white/50 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isComplete ? t.claim : 'In Progress'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
