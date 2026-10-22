import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Pause,
  Play,
  RotateCcw,
  Home,
  Check,
  Star,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { LevelConfig, CandyColor, SpecialCandyType } from '../game/types';
import { CandyEngine, BoardState } from '../game/CandyEngine';
import { CandyPiece } from '../components/CandyPiece';
import { soundManager } from '../audio/soundManager';
import { GameSaveData } from '../services/storage';
import { TranslationDictionary } from '../i18n/types';

interface GameScreenProps {
  level: LevelConfig;
  saveData: GameSaveData;
  t: TranslationDictionary;
  onVictory: (stars: number, score: number) => void;
  onDefeat: () => void;
  onReturnToMap: () => void;
  onConsumeBooster: (boosterType: 'hammer' | 'shuffle' | 'rocket' | 'colorSwirl') => boolean;
  onSpendCoins: (amount: number) => boolean;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  level,
  saveData,
  t,
  onVictory,
  onDefeat,
  onReturnToMap,
  onConsumeBooster,
  onSpendCoins,
}) => {
  const engineRef = useRef<CandyEngine | null>(null);
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeBooster, setActiveBooster] = useState<'hammer' | 'rocket' | null>(null);
  const [showOutMovesModal, setShowOutMovesModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showDefeatModal, setShowDefeatModal] = useState(false);
  const [earnedStars, setEarnedStars] = useState(1);
  const [floatingScores, setFloatingScores] = useState<
    Array<{ id: number; text: string; x: number; y: number }>
  >([]);

  // Initialize Candy Engine
  const startLevel = useCallback(() => {
    const engine = new CandyEngine(level);
    engineRef.current = engine;
    const initial = engine.getState();
    setBoardState({ ...initial });
    setSelectedCell(null);
    setIsPaused(false);
    setActiveBooster(null);
    setShowOutMovesModal(false);
    setShowVictoryModal(false);
    setShowDefeatModal(false);
    soundManager.playMusic('game');
  }, [level]);

  useEffect(() => {
    startLevel();
    return () => {
      soundManager.stopMusic();
    };
  }, [startLevel]);

  // Handle Win/Lose transitions
  useEffect(() => {
    if (!boardState) return;

    if (boardState.isWon && !showVictoryModal) {
      // Calculate stars
      let stars = 1;
      if (boardState.score >= level.starScores[2]) stars = 3;
      else if (boardState.score >= level.starScores[1]) stars = 2;
      setEarnedStars(stars);

      soundManager.playVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#eab308', '#22c55e', '#06b6d4'],
      });

      setShowVictoryModal(true);
      onVictory(stars, boardState.score);
    } else if (boardState.isLost && !showDefeatModal && !showVictoryModal) {
      soundManager.playDefeat();
      setShowOutMovesModal(true);
    }
  }, [boardState, level, showVictoryModal, showDefeatModal, onVictory]);

  // Handle Cell Tap/Drag
  const handleCellClick = async (r: number, c: number, e?: React.MouseEvent) => {
    if (!engineRef.current || !boardState || boardState.isProcessing || isPaused) return;

    // Handle Active Booster Use
    if (activeBooster === 'hammer') {
      const ok = onConsumeBooster('hammer');
      if (ok) {
        soundManager.playHammer();
        engineRef.current.useBoosterHammer(r, c);
        setBoardState({ ...engineRef.current.getState() });
        await engineRef.current.resolveMatchesAndCascades((s) => setBoardState({ ...s }));
        engineRef.current.checkGameStatus();
        setBoardState({ ...engineRef.current.getState() });
      }
      setActiveBooster(null);
      return;
    }

    if (activeBooster === 'rocket') {
      const ok = onConsumeBooster('rocket');
      if (ok) {
        soundManager.playRocket();
        engineRef.current.useBoosterRocket(r, c);
        setBoardState({ ...engineRef.current.getState() });
        await engineRef.current.resolveMatchesAndCascades((s) => setBoardState({ ...s }));
        engineRef.current.checkGameStatus();
        setBoardState({ ...engineRef.current.getState() });
      }
      setActiveBooster(null);
      return;
    }

    // Standard Swap Selection
    if (!selectedCell) {
      setSelectedCell({ r, c });
      soundManager.playButton();
      return;
    }

    // Same cell selected -> deselect
    if (selectedCell.r === r && selectedCell.c === c) {
      setSelectedCell(null);
      return;
    }

    // Check adjacent
    const canSwap = engineRef.current.canSwap(selectedCell.r, selectedCell.c, r, c);
    if (!canSwap) {
      // Switch selection to new cell
      setSelectedCell({ r, c });
      soundManager.playButton();
      return;
    }

    await executeSwap(selectedCell.r, selectedCell.c, r, c);
  };

  const executeSwap = async (fromR: number, fromC: number, toR: number, toC: number) => {
    if (!engineRef.current || !boardState || boardState.isProcessing || isPaused) return;
    setSelectedCell(null);
    soundManager.playSwap();

    const success = await engineRef.current.swapCandies(fromR, fromC, toR, toC, (updated) => {
      setBoardState({ ...updated });
    });

    if (!success) {
      soundManager.playInvalid();
    } else {
      if (saveData.settings.vibration && 'vibrate' in navigator) {
        try {
          navigator.vibrate(30);
        } catch {}
      }
      soundManager.playMatch(engineRef.current.getState().comboCount);
    }
  };

  const pointerStartRef = useRef<{ r: number; c: number; x: number; y: number } | null>(null);

  const handlePointerDown = (r: number, c: number, e: React.PointerEvent) => {
    if (activeBooster || boardState?.isProcessing || isPaused) return;
    pointerStartRef.current = { r, c, x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = async (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const { r, c, x, y } = pointerStartRef.current;
    pointerStartRef.current = null;

    const dx = e.clientX - x;
    const dy = e.clientY - y;
    const dist = Math.hypot(dx, dy);

    if (dist > 20) {
      let targetR = r;
      let targetC = c;
      if (Math.abs(dx) > Math.abs(dy)) {
        targetC = dx > 0 ? c + 1 : c - 1;
      } else {
        targetR = dy > 0 ? r + 1 : r - 1;
      }

      if (targetR >= 0 && targetR < level.rows && targetC >= 0 && targetC < level.cols) {
        await executeSwap(r, c, targetR, targetC);
        return;
      }
    }

    handleCellClick(r, c);
  };

  // Booster Actions
  const handleBoosterShuffle = async () => {
    if (!engineRef.current || !boardState || boardState.isProcessing) return;
    const ok = onConsumeBooster('shuffle');
    if (ok) {
      soundManager.playButton();
      engineRef.current.shuffleBoard();
      setBoardState({ ...engineRef.current.getState() });
    }
  };

  const handleBoosterColorSwirl = async () => {
    if (!engineRef.current || !boardState || boardState.isProcessing) return;
    const ok = onConsumeBooster('colorSwirl');
    if (ok) {
      soundManager.playRainbow();
      engineRef.current.useBoosterColorSwirl();
      setBoardState({ ...engineRef.current.getState() });
      await engineRef.current.resolveMatchesAndCascades((s) => setBoardState({ ...s }));
      engineRef.current.checkGameStatus();
      setBoardState({ ...engineRef.current.getState() });
    }
  };

  // Buy extra moves
  const handleBuyExtraMoves = () => {
    if (!engineRef.current || !boardState) return;
    const ok = onSpendCoins(100);
    if (ok) {
      soundManager.playCoin();
      engineRef.current.addExtraMoves(5);
      setBoardState({ ...engineRef.current.getState() });
      setShowOutMovesModal(false);
    }
  };

  if (!boardState) return null;

  const { rows, cols } = level;
  const cellSize = Math.min(46, Math.floor((window.innerWidth - 32) / cols));

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center bg-gradient-to-b from-[#25073c] via-[#450a5f] to-[#1a0529] select-none overflow-hidden pb-1">
      {/* Header HUD: Moves, Objectives, Score */}
      <div className="w-full max-w-md px-3 pt-2 pb-1 flex flex-col gap-1 z-20">
        <div className="flex items-center justify-between gap-2">
          {/* Moves Left Cluster */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-rose-500 to-pink-700 px-3 py-1 rounded-2xl border-2 border-pink-300 shadow-lg min-w-[70px]">
            <span className="text-[10px] font-black uppercase text-pink-200 tracking-wider">
              {t.moves}
            </span>
            <span className="text-2xl font-black text-white tabular-nums leading-none drop-shadow">
              {boardState.movesLeft}
            </span>
          </div>

          {/* Objectives Display */}
          <div className="flex-1 flex items-center justify-center gap-3 bg-[#3a0b5a]/85 border-2 border-purple-400/60 rounded-2xl px-2.5 py-1.5 shadow-md">
            {level.objective.type === 'score' && (
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>
                  {boardState.score} / {level.objective.targetScore}
                </span>
              </div>
            )}

            {level.objective.candies &&
              level.objective.candies.map((target, idx) => {
                const collected = boardState.collectedCandies[target.color] || 0;
                const done = collected >= target.count;
                return (
                  <div key={idx} className="flex items-center gap-1">
                    <div className="w-6 h-6">
                      <CandyPiece color={target.color} size={24} />
                    </div>
                    <span className="text-xs font-black text-white">
                      {done ? (
                        <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                      ) : (
                        Math.max(0, target.count - collected)
                      )}
                    </span>
                  </div>
                );
              })}

            {level.objective.totalJellies && (
              <div className="flex items-center gap-1">
                <span className="text-base">🧊</span>
                <span className="text-xs font-black text-cyan-200">
                  {boardState.clearedJellies >= level.objective.totalJellies ? (
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  ) : (
                    level.objective.totalJellies - boardState.clearedJellies
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Score Cluster & Pause */}
          <div className="flex items-center gap-1.5">
            <div className="flex flex-col items-end bg-gradient-to-b from-indigo-600 to-purple-800 px-3 py-1 rounded-2xl border-2 border-indigo-300 shadow-lg min-w-[75px]">
              <span className="text-[10px] font-black uppercase text-indigo-200 tracking-wider">
                {t.score}
              </span>
              <span className="text-base font-black text-amber-300 tabular-nums leading-tight">
                {boardState.score}
              </span>
            </div>

            <button
              onClick={() => {
                soundManager.playButton();
                setIsPaused(true);
              }}
              className="w-9 h-9 rounded-2xl bg-[#581c87] border-2 border-purple-300 flex items-center justify-center text-white shadow-md active:scale-95"
            >
              <Pause className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>

        {/* Score Progress Bar with 3-Star Badges */}
        <div className="w-full relative h-2.5 bg-purple-950/80 rounded-full border border-purple-400/50 shadow-inner px-0.5 flex items-center">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-pink-400 to-emerald-400 shadow transition-all duration-300"
            style={{
              width: `${Math.min(100, (boardState.score / level.starScores[2]) * 100)}%`,
            }}
          />
          {/* Star markers */}
          <div className="absolute left-[33%] -top-1">
            <Star
              className={`w-4 h-4 ${
                boardState.score >= level.starScores[0]
                  ? 'fill-amber-400 text-amber-400 scale-110'
                  : 'fill-gray-600 text-gray-400'
              }`}
            />
          </div>
          <div className="absolute left-[66%] -top-1">
            <Star
              className={`w-4 h-4 ${
                boardState.score >= level.starScores[1]
                  ? 'fill-amber-400 text-amber-400 scale-110'
                  : 'fill-gray-600 text-gray-400'
              }`}
            />
          </div>
          <div className="absolute right-1 -top-1">
            <Star
              className={`w-4 h-4 ${
                boardState.score >= level.starScores[2]
                  ? 'fill-amber-400 text-amber-400 scale-110'
                  : 'fill-gray-600 text-gray-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Combo Callout Banner */}
      {boardState.lastCallout && (
        <div className="absolute top-20 z-30 animate-bounce pointer-events-none">
          <div className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 border-2 border-yellow-300 shadow-2xl text-white font-black text-xl tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {boardState.lastCallout}
          </div>
        </div>
      )}

      {/* Interactive Candy Board Grid */}
      <div className="flex-1 flex items-center justify-center p-2 z-10 w-full max-w-md">
        <div
          className="relative bg-[#220738]/90 border-4 border-[#86198f] rounded-3xl p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-sm grid gap-1 touch-none"
          style={{
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          }}
        >
          {boardState.grid.map((row, r) =>
            row.map((candy, c) => {
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const hasJelly = boardState.jellyGrid[r]?.[c];

              return (
                <div
                  key={`${r}-${c}`}
                  onPointerDown={(e) => handlePointerDown(r, c, e)}
                  onPointerUp={(e) => handlePointerUp(e)}
                  className={`relative rounded-xl flex items-center justify-center transition-colors cursor-pointer select-none touch-none ${
                    hasJelly
                      ? 'bg-cyan-500/35 border border-cyan-300/60 shadow-inner'
                      : (r + c) % 2 === 0
                      ? 'bg-purple-900/30'
                      : 'bg-purple-950/40'
                  } hover:bg-purple-700/40`}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                >
                  {/* Jelly coating effect */}
                  {hasJelly && (
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-xl pointer-events-none animate-pulse" />
                  )}

                  {/* Render Candy Item */}
                  {candy && (
                    <CandyPiece
                      color={candy.color}
                      special={candy.special}
                      isSelected={isSelected}
                      size={cellSize - 4}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Boosters Bottom Dock */}
      <div className="w-full max-w-md px-4 py-2 bg-gradient-to-t from-[#1b052d] via-[#2d0a4e] to-transparent flex items-center justify-around z-20">
        {/* Magical Hammer */}
        <button
          onClick={() => {
            soundManager.playButton();
            setActiveBooster(activeBooster === 'hammer' ? null : 'hammer');
          }}
          className={`flex flex-col items-center gap-0.5 rounded-2xl p-2 transition-transform active:scale-90 ${
            activeBooster === 'hammer'
              ? 'bg-amber-500 text-white ring-4 ring-yellow-300 scale-110'
              : 'bg-[#3b0f58] border-2 border-purple-400/50 text-purple-200'
          }`}
        >
          <span className="text-xl">🔨</span>
          <span className="text-[10px] font-black">{saveData.boosters.hammer}</span>
        </button>

        {/* Candy Shuffle */}
        <button
          onClick={handleBoosterShuffle}
          className="flex flex-col items-center gap-0.5 rounded-2xl p-2 bg-[#3b0f58] border-2 border-purple-400/50 text-purple-200 active:scale-90 transition-transform"
        >
          <span className="text-xl">🔄</span>
          <span className="text-[10px] font-black">{saveData.boosters.shuffle}</span>
        </button>

        {/* Rocket Blast */}
        <button
          onClick={() => {
            soundManager.playButton();
            setActiveBooster(activeBooster === 'rocket' ? null : 'rocket');
          }}
          className={`flex flex-col items-center gap-0.5 rounded-2xl p-2 transition-transform active:scale-90 ${
            activeBooster === 'rocket'
              ? 'bg-rose-500 text-white ring-4 ring-pink-300 scale-110'
              : 'bg-[#3b0f58] border-2 border-purple-400/50 text-purple-200'
          }`}
        >
          <span className="text-xl">🚀</span>
          <span className="text-[10px] font-black">{saveData.boosters.rocket}</span>
        </button>

        {/* Color Swirl */}
        <button
          onClick={handleBoosterColorSwirl}
          className="flex flex-col items-center gap-0.5 rounded-2xl p-2 bg-[#3b0f58] border-2 border-purple-400/50 text-purple-200 active:scale-90 transition-transform"
        >
          <span className="text-xl">🌈</span>
          <span className="text-[10px] font-black">{saveData.boosters.colorSwirl}</span>
        </button>
      </div>

      {/* PAUSE MODAL */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-gradient-to-b from-[#4a1270] to-[#25073c] border-4 border-yellow-300 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-white">
            <h2 className="text-2xl font-black text-yellow-300 drop-shadow">
              {t.paused}
            </h2>

            <div className="w-full flex flex-col gap-2.5">
              <button
                onClick={() => {
                  soundManager.playButton();
                  setIsPaused(false);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 border-2 border-emerald-200 font-black text-white text-base shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{t.resume}</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playButton();
                  startLevel();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 border-2 border-amber-200 font-black text-white text-base shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                <span>{t.restart}</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playButton();
                  onReturnToMap();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 border-2 border-purple-300 font-black text-white text-base shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <Home className="w-5 h-5" />
                <span>{t.map}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OUT OF MOVES / EXTRA MOVES MODAL */}
      {showOutMovesModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-gradient-to-b from-[#5c1374] to-[#2a0845] border-4 border-pink-400 rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-3 text-white text-center">
            <span className="text-4xl">🍭</span>
            <h2 className="text-xl font-black text-yellow-300">{t.defeat}</h2>
            <p className="text-xs text-pink-200 font-semibold">{t.noMovesLeft}</p>

            <button
              onClick={handleBuyExtraMoves}
              disabled={saveData.coins < 100}
              className={`w-full py-3 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 ${
                saveData.coins >= 100
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 border-2 border-emerald-300 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{t.getExtraMoves}</span>
            </button>

            <button
              onClick={() => {
                setShowOutMovesModal(false);
                setShowDefeatModal(true);
                onDefeat();
              }}
              className="text-xs text-pink-300/80 hover:text-white underline font-bold mt-1"
            >
              Give Up
            </button>
          </div>
        </div>
      )}

      {/* VICTORY MODAL */}
      {showVictoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-xs bg-gradient-to-b from-[#6b1c8f] via-[#48116b] to-[#250838] border-4 border-yellow-300 rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-3 text-white text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg -mt-10 border-4 border-white animate-bounce">
              <Sparkles className="w-8 h-8 text-white fill-white" />
            </div>

            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-300 to-yellow-500">
              {t.victory}
            </h2>

            {/* Stars Row */}
            <div className="flex items-center gap-2 my-1">
              {[1, 2, 3].map((starIdx) => (
                <div
                  key={starIdx}
                  className={`p-1.5 rounded-full ${
                    starIdx <= earnedStars ? 'bg-amber-400 text-white scale-110 shadow-lg' : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </div>
              ))}
            </div>

            <div className="bg-purple-950/70 rounded-2xl px-4 py-2 w-full border border-purple-400/40">
              <p className="text-xs text-purple-300 font-bold">{t.score}</p>
              <p className="text-xl font-black text-amber-300">{boardState.score.toLocaleString()}</p>
              <div className="flex items-center justify-center gap-3 mt-1 text-xs font-black text-emerald-300">
                <span>+100 🪙</span>
                <span>+5 💎</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playButton();
                onReturnToMap();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 border-2 border-emerald-200 font-black text-white text-base shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{t.nextLevel}</span>
            </button>
          </div>
        </div>
      )}

      {/* DEFEAT MODAL */}
      {showDefeatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-gradient-to-b from-[#4c1257] to-[#20042d] border-4 border-rose-500 rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-3 text-white text-center">
            <span className="text-4xl">💔</span>
            <h2 className="text-2xl font-black text-rose-400">{t.failed}</h2>

            <p className="text-xs text-pink-200 font-medium">
              Don't give up! Try again to conquer this sweet level.
            </p>

            <button
              onClick={() => {
                soundManager.playButton();
                startLevel();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 border-2 border-amber-200 font-black text-white text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.replay}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playButton();
                onReturnToMap();
              }}
              className="w-full py-3 rounded-2xl bg-purple-900/80 border border-purple-400/50 font-bold text-white text-sm shadow flex items-center justify-center gap-2 active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>{t.map}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
