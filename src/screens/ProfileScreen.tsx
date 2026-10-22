import React, { useState } from 'react';
import { Trophy, ChevronLeft, Star, Award, Sparkles, Check, Edit3 } from 'lucide-react';
import { GameSaveData } from '../services/storage';
import { TranslationDictionary } from '../i18n/types';
import { soundManager } from '../audio/soundManager';

interface ProfileScreenProps {
  saveData: GameSaveData;
  t: TranslationDictionary;
  onBack: () => void;
  onUpdateName: (name: string) => void;
  onSelectAvatar: (id: number) => void;
  onClaimAchievement: (id: string, coins: number, diamonds: number) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  saveData,
  t,
  onBack,
  onUpdateName,
  onSelectAvatar,
  onClaimAchievement,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(saveData.profile.name);

  const totalStars = Object.values(saveData.completedLevels).reduce(
    (acc, curr) => acc + curr.stars,
    0
  );
  const completedCount = Object.keys(saveData.completedLevels).length;
  const totalScore = Object.values(saveData.completedLevels).reduce(
    (acc, curr) => acc + curr.highScore,
    0
  );

  const avatars = [
    { id: 1, name: 'Princess Candivelle', icon: '👑', img: '/assets/aistudio/file_00000000c06c82088ba454beec7b950f_a13b195c.png' },
    { id: 2, name: 'Prince Bonbon', icon: '🎩' },
    { id: 3, name: 'Gummy Bear King', icon: '🐻' },
    { id: 4, name: 'Jelly Knight', icon: '⚔️' },
  ];

  const trophiesList = [
    {
      id: 'first_level',
      title: 'Sweet Beginnings',
      desc: 'Complete your first Candivelle level!',
      unlocked: completedCount >= 1,
      coins: 100,
      diamonds: 5,
      icon: '🌱',
    },
    {
      id: 'three_star',
      title: 'Three-Star Royal',
      desc: 'Achieve 3 stars on any level.',
      unlocked: Object.values(saveData.completedLevels).some((l) => l.stars === 3),
      coins: 200,
      diamonds: 10,
      icon: '⭐',
    },
    {
      id: 'level_10',
      title: 'Meadow Explorer',
      desc: 'Reach Level 10 in Sugar Meadow.',
      unlocked: (saveData.maxUnlockedLevel || 1) >= 10,
      coins: 350,
      diamonds: 15,
      icon: '🧭',
    },
    {
      id: 'candy_collector',
      title: 'Candy Baron',
      desc: 'Match over 200 delicious candies.',
      unlocked: (saveData.profile.totalCandiesMatched || 0) >= 200,
      coins: 500,
      diamonds: 20,
      icon: '🍬',
    },
    {
      id: 'all_100',
      title: 'CANDIVELLE Grand Champion',
      desc: 'Conquer all 100 royal kingdom levels!',
      unlocked: completedCount >= 100,
      coins: 5000,
      diamonds: 100,
      icon: '🏆',
    },
  ];

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
    }
    setIsEditing(false);
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
          <Trophy className="w-5 h-5 text-amber-300" />
          <h1 className="text-base font-black text-white">{t.profile} &amp; {t.trophy}</h1>
        </div>

        <div className="w-16" />
      </div>

      <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4">
        {/* Profile Card */}
        <div className="rounded-3xl bg-gradient-to-r from-pink-600 via-purple-700 to-indigo-700 border-2 border-yellow-300 p-4 shadow-xl flex flex-col gap-3 text-white">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl border-2 border-yellow-300 overflow-hidden bg-pink-400 shadow-md flex items-center justify-center text-3xl">
              {saveData.profile.avatarId === 1 ? (
                <img
                  src="/assets/aistudio/file_00000000c06c82088ba454beec7b950f_a13b195c.png"
                  alt="Princess"
                  className="w-full h-full object-cover scale-125"
                />
              ) : (
                <span>
                  {avatars.find((a) => a.id === saveData.profile.avatarId)?.icon || '👑'}
                </span>
              )}
            </div>

            {/* Name & Title */}
            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-white text-purple-950 font-black text-sm px-2 py-1 rounded-lg outline-none"
                    maxLength={16}
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 bg-emerald-500 rounded-lg text-white"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-yellow-100">{saveData.profile.name}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-pink-200 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="text-xs font-bold text-pink-200">
                Royal Kingdom Adventurer • {t.levelNum.replace('{n}', (saveData.currentLevel || 1).toString())}
              </p>
            </div>
          </div>

          {/* Avatar Switcher */}
          <div className="flex items-center gap-2 pt-1 border-t border-white/20">
            <span className="text-[10px] uppercase font-bold text-pink-200">Avatar:</span>
            <div className="flex gap-2">
              {avatars.map((av) => (
                <button
                  key={av.id}
                  onClick={() => {
                    soundManager.playButton();
                    onSelectAvatar(av.id);
                  }}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-transform ${
                    saveData.profile.avatarId === av.id
                      ? 'bg-yellow-400 text-purple-950 ring-2 ring-white scale-110 shadow'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {av.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-white">
          <div className="rounded-2xl bg-[#2e0947]/90 border border-purple-400/30 p-2.5 flex flex-col items-center shadow">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-black text-amber-300 mt-1">{totalStars}</span>
            <span className="text-[10px] text-purple-300 font-bold uppercase">Total Stars</span>
          </div>

          <div className="rounded-2xl bg-[#2e0947]/90 border border-purple-400/30 p-2.5 flex flex-col items-center shadow">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-black text-emerald-300 mt-1">{completedCount}</span>
            <span className="text-[10px] text-purple-300 font-bold uppercase">Completed</span>
          </div>

          <div className="rounded-2xl bg-[#2e0947]/90 border border-purple-400/30 p-2.5 flex flex-col items-center shadow">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-black text-cyan-300 mt-1">{totalScore.toLocaleString()}</span>
            <span className="text-[10px] text-purple-300 font-bold uppercase">High Score</span>
          </div>
        </div>

        {/* Trophies & Achievements List */}
        <h2 className="text-sm font-black uppercase text-pink-200 tracking-wider mt-2">
          {t.trophies} &amp; {t.achievements}
        </h2>

        <div className="flex flex-col gap-2.5">
          {trophiesList.map((trophy) => {
            const isClaimed = !!saveData.achievements[trophy.id];
            const canClaim = trophy.unlocked && !isClaimed;

            return (
              <div
                key={trophy.id}
                className={`rounded-2xl p-3 border-2 flex items-center justify-between gap-3 text-white transition-all ${
                  trophy.unlocked
                    ? 'bg-[#3b0f58]/90 border-amber-400/60 shadow-md'
                    : 'bg-[#25073a]/60 border-purple-400/20 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow ${
                      trophy.unlocked
                        ? 'bg-gradient-to-br from-amber-400 to-yellow-600'
                        : 'bg-purple-950 text-gray-500'
                    }`}
                  >
                    {trophy.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-black leading-tight text-white">{trophy.title}</h3>
                    <p className="text-[10px] text-purple-200">{trophy.desc}</p>
                    <span className="text-[10px] font-bold text-yellow-300">
                      +{trophy.coins} 🪙 &amp; +{trophy.diamonds} 💎
                    </span>
                  </div>
                </div>

                {isClaimed ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/80 text-white text-[10px] font-black">
                    {t.claimed}
                  </span>
                ) : canClaim ? (
                  <button
                    onClick={() => {
                      soundManager.playVictory();
                      onClaimAchievement(trophy.id, trophy.coins, trophy.diamonds);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-600 text-white font-black text-xs shadow active:scale-95"
                  >
                    {t.claim}
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-purple-400/70">Locked</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
