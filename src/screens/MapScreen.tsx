import React, { useEffect, useRef } from 'react';
import { Star, Lock, Play, ChevronLeft, Sparkles, MapPin } from 'lucide-react';
import { GameSaveData } from '../services/storage';
import { TranslationDictionary } from '../i18n/types';
import { LEVELS } from '../game/levels';
import { soundManager } from '../audio/soundManager';

interface MapScreenProps {
  saveData: GameSaveData;
  t: TranslationDictionary;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ saveData, t, onSelectLevel, onBack }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentLevel = saveData.currentLevel || 1;
  const maxUnlocked = saveData.maxUnlockedLevel || 1;

  // Auto-scroll to current level node on mount
  useEffect(() => {
    const nodeEl = document.getElementById(`level-node-${currentLevel}`);
    if (nodeEl && scrollRef.current) {
      nodeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentLevel]);

  // Compute winding path (sine curve)
  const getXOffset = (index: number) => {
    const wave = Math.sin(index * 0.45) * 85;
    return wave;
  };

  const getChapterName = (chapter: number) => {
    switch (chapter) {
      case 1:
        return t.chapter1;
      case 2:
        return t.chapter2;
      case 3:
        return t.chapter3;
      case 4:
        return t.chapter4;
      default:
        return `Chapter ${chapter}`;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-[#1a062d] via-[#33084d] to-[#150424] overflow-hidden select-none">
      {/* Top Bar for Map */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-[#2d094c]/90 border-b border-purple-500/30 z-20 shadow-md">
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
          <span className="text-xs font-black uppercase text-pink-300 tracking-wider">
            {t.levelMap}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-pink-600/80 text-white font-extrabold">
            {currentLevel} / {LEVELS.length}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded-full border border-amber-400/50">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-black text-amber-300">
            {Object.values(saveData.completedLevels).reduce((acc, curr) => acc + curr.stars, 0)}
          </span>
        </div>
      </div>

      {/* Scrollable Fantasy Candy Road */}
      <div
        ref={scrollRef}
        className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col-reverse items-center pt-24 pb-48 px-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Background Candy Trees & Clouds */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-20 left-4 text-4xl">🍭</div>
          <div className="absolute top-96 right-6 text-4xl">🍬</div>
          <div className="absolute top-[800px] left-8 text-4xl">🧁</div>
          <div className="absolute top-[1500px] right-8 text-4xl">🏰</div>
          <div className="absolute top-[2200px] left-4 text-4xl">🍩</div>
          <div className="absolute top-[3000px] right-6 text-4xl">🍧</div>
        </div>

        {/* Level Nodes */}
        {LEVELS.map((lvl, index) => {
          const isCompleted = !!saveData.completedLevels[lvl.id];
          const record = saveData.completedLevels[lvl.id];
          const isUnlocked = lvl.id <= maxUnlocked;
          const isCurrent = lvl.id === currentLevel;
          const xOffset = getXOffset(index);

          const isChapterBoundary = lvl.id % 25 === 1;

          return (
            <React.Fragment key={lvl.id}>
              {/* Chapter Header Banner */}
              {isChapterBoundary && (
                <div className="my-8 px-6 py-2 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 border-2 border-yellow-300 shadow-xl flex items-center gap-2 z-10 text-white">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-black tracking-wide">
                    {getChapterName(lvl.chapter)}
                  </span>
                </div>
              )}

              {/* Node Row */}
              <div
                id={`level-node-${lvl.id}`}
                className="relative my-4 flex flex-col items-center z-10 transition-transform"
                style={{ transform: `translateX(${xOffset}px)` }}
              >
                {/* Current Player Avatar Marker above Node */}
                {isCurrent && (
                  <div className="absolute -top-11 flex flex-col items-center animate-bounce z-20">
                    <div className="w-8 h-8 rounded-full border-2 border-yellow-300 overflow-hidden bg-pink-400 shadow-lg">
                      <img
                        src="/assets/aistudio/file_00000000c06c82088ba454beec7b950f_a13b195c.png"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <MapPin className="w-4 h-4 fill-pink-500 text-pink-500 -mt-1 drop-shadow" />
                  </div>
                )}

                {/* Level Circular Button */}
                <button
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      soundManager.playButton();
                      onSelectLevel(lvl.id);
                    }
                  }}
                  className={`w-14 h-14 rounded-full border-3 flex flex-col items-center justify-center font-black shadow-lg transition-all active:scale-95 ${
                    isCurrent
                      ? 'bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 border-yellow-100 text-amber-950 scale-110 shadow-amber-400/50 ring-4 ring-yellow-400/40'
                      : isCompleted
                      ? 'bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-600 border-cyan-200 text-white shadow-blue-500/40'
                      : isUnlocked
                      ? 'bg-gradient-to-b from-emerald-400 via-green-500 to-green-700 border-emerald-200 text-white shadow-green-500/40'
                      : 'bg-[#3c2a52] border-[#553c74] text-purple-400/60 opacity-60'
                  }`}
                >
                  {isUnlocked ? (
                    <span className="text-base font-extrabold leading-none">{lvl.id}</span>
                  ) : (
                    <Lock className="w-5 h-5 text-purple-300/60" />
                  )}
                </button>

                {/* Stars Indicator */}
                {isCompleted && record && (
                  <div className="flex items-center gap-0.5 mt-1 bg-black/40 px-1.5 py-0.5 rounded-full shadow">
                    {[1, 2, 3].map((starNum) => (
                      <Star
                        key={starNum}
                        className={`w-3 h-3 ${
                          starNum <= record.stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-gray-600 text-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
