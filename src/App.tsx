/**
 * CANDIVELLE - 3D Cartoon Match-3 Puzzle Game
 * @license Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StorageService, GameSaveData, GameSettings } from './services/storage';
import { TRANSLATIONS } from './i18n/locales';
import { SUPPORTED_LANGUAGES, LanguageCode } from './i18n/types';
import { soundManager } from './audio/soundManager';
import { getLevelConfig } from './game/levels';

import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MapScreen } from './screens/MapScreen';
import { GameScreen } from './screens/GameScreen';
import { ShopScreen } from './screens/ShopScreen';
import { DailyRewardsScreen } from './screens/DailyRewardsScreen';
import { EventsScreen } from './screens/EventsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LegalScreen } from './screens/LegalScreen';
import { AndroidPackScreen } from './screens/AndroidPackScreen';
import { LanguageModal } from './screens/LanguageModal';

import { HeaderBar } from './components/HeaderBar';
import { BottomNav, ScreenTab } from './components/BottomNav';

export default function App() {
  const [saveData, setSaveData] = useState<GameSaveData>(() => StorageService.load());
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [legalType, setLegalType] = useState<'privacy' | 'terms' | 'help' | null>(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Sync sound settings with audio engine
  useEffect(() => {
    soundManager.setSoundEnabled(saveData.settings.sound);
    soundManager.setMusicEnabled(saveData.settings.music);
    soundManager.setSoundVolume(saveData.settings.soundVolume);
    soundManager.setMusicVolume(saveData.settings.musicVolume);
  }, [saveData.settings]);

  // Persist save changes
  const updateSave = useCallback((updater: (prev: GameSaveData) => GameSaveData) => {
    setSaveData((prev) => {
      const next = updater(prev);
      StorageService.save(next);
      return next;
    });
  }, []);

  // Current translation dictionary
  const langCode = saveData.settings.language || 'en-US';
  const t = useMemo(() => TRANSLATIONS[langCode] || TRANSLATIONS['en-US'], [langCode]);

  // RTL detection
  const isRtl = useMemo(() => {
    const info = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    return info?.dir === 'rtl';
  }, [langCode]);

  // Handle Level Selection
  const handleLaunchLevel = (lvlId: number) => {
    if (saveData.lives <= 0) {
      // Offer refill with coins
      if (saveData.coins >= 50) {
        if (window.confirm(t.outOfLives + ' ' + t.refillLives)) {
          updateSave((prev) => ({
            ...prev,
            coins: prev.coins - 50,
            lives: prev.maxLives,
          }));
          setActiveLevelId(lvlId);
          setCurrentTab('game');
        }
      } else {
        alert(t.outOfLives);
      }
      return;
    }

    setActiveLevelId(lvlId);
    setCurrentTab('game');
  };

  // Level Win
  const handleVictory = (stars: number, score: number) => {
    if (!activeLevelId) return;
    updateSave((prev) => {
      const existing = prev.completedLevels[activeLevelId] || { stars: 0, highScore: 0 };
      const newStars = Math.max(existing.stars, stars);
      const newScore = Math.max(existing.highScore, score);

      const nextLevel = activeLevelId + 1;
      const maxUnlocked = Math.max(prev.maxUnlockedLevel || 1, nextLevel);

      return {
        ...prev,
        currentLevel: nextLevel,
        maxUnlockedLevel: maxUnlocked,
        coins: prev.coins + 100,
        diamonds: prev.diamonds + 5,
        completedLevels: {
          ...prev.completedLevels,
          [activeLevelId]: { stars: newStars, highScore: newScore },
        },
        profile: {
          ...prev.profile,
          totalCandiesMatched: prev.profile.totalCandiesMatched + 30,
        },
      };
    });
  };

  // Level Defeat
  const handleDefeat = () => {
    updateSave((prev) => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1),
    }));
  };

  // Booster consumption
  const handleConsumeBooster = (
    boosterType: 'hammer' | 'shuffle' | 'rocket' | 'colorSwirl'
  ): boolean => {
    if (saveData.boosters[boosterType] > 0) {
      updateSave((prev) => ({
        ...prev,
        boosters: {
          ...prev.boosters,
          [boosterType]: prev.boosters[boosterType] - 1,
        },
      }));
      return true;
    }
    // If empty, offer to buy with coins
    if (saveData.coins >= 200) {
      updateSave((prev) => ({
        ...prev,
        coins: prev.coins - 200,
      }));
      return true;
    }
    return false;
  };

  // Spend Coins
  const handleSpendCoins = (amount: number): boolean => {
    if (saveData.coins >= amount) {
      updateSave((prev) => ({ ...prev, coins: prev.coins - amount }));
      return true;
    }
    return false;
  };

  // Buy Booster
  const handleBuyBooster = (
    booster: 'hammer' | 'shuffle' | 'rocket' | 'colorSwirl',
    costCoins: number
  ): boolean => {
    if (saveData.coins >= costCoins) {
      updateSave((prev) => ({
        ...prev,
        coins: prev.coins - costCoins,
        boosters: {
          ...prev.boosters,
          [booster]: prev.boosters[booster] + 1,
        },
      }));
      return true;
    }
    return false;
  };

  // Add Currencies
  const handleAddCurrencies = (coins: number, diamonds: number) => {
    updateSave((prev) => ({
      ...prev,
      coins: prev.coins + coins,
      diamonds: prev.diamonds + diamonds,
    }));
  };

  // Claim Daily Reward
  const handleClaimReward = (day: number, coins: number, diamonds: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    updateSave((prev) => ({
      ...prev,
      coins: prev.coins + coins,
      diamonds: prev.diamonds + diamonds,
      dailyRewards: {
        lastClaimDate: todayStr,
        streak: prev.dailyRewards.streak + 1,
      },
    }));
  };

  // Claim Event / Achievement
  const handleClaimAchievement = (id: string, coins: number, diamonds: number) => {
    updateSave((prev) => ({
      ...prev,
      coins: prev.coins + coins,
      diamonds: prev.diamonds + diamonds,
      achievements: {
        ...prev.achievements,
        [id]: true,
      },
    }));
  };

  // Refill Lives
  const handleRefillLives = () => {
    if (saveData.lives >= saveData.maxLives) {
      alert(`${t.lives}: ${t.full}!`);
      return;
    }
    if (saveData.coins < 50) {
      alert(t.outOfLives + ' (Requires 50 Coins)');
      return;
    }
    if (window.confirm(`${t.refillLives}? (Cost: 50 Coins)`)) {
      soundManager.playCoin();
      updateSave((prev) => ({
        ...prev,
        coins: prev.coins - 50,
        lives: prev.maxLives,
      }));
    }
  };

  // Reset Progress
  const handleResetProgress = () => {
    const fresh = StorageService.resetProgress();
    setSaveData(fresh);
    setCurrentTab('home');
  };

  if (!isSplashDone) {
    return (
      <SplashScreen
        t={t}
        onFinish={() => {
          setIsSplashDone(true);
          soundManager.playMusic('home');
        }}
      />
    );
  }

  const activeLevelConfig = activeLevelId ? getLevelConfig(activeLevelId) : getLevelConfig(1);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 w-screen h-screen bg-[#1c0733] text-white flex flex-col justify-between overflow-hidden select-none font-['Fredoka',sans-serif]"
    >
      {/* Header Bar - only hidden during active gameplay for full screen focus */}
      {currentTab !== 'game' && (
        <HeaderBar
          saveData={saveData}
          t={t}
          onOpenSettings={() => setCurrentTab('settings')}
          onOpenShop={() => setCurrentTab('shop')}
          onOpenProfile={() => setCurrentTab('trophy')}
          onOpenAndroidGuide={() => setCurrentTab('android')}
          onRefillLives={handleRefillLives}
        />
      )}

      {/* Screen Views */}
      <main className="flex-1 w-full h-full relative overflow-hidden flex flex-col items-center">
        {currentTab === 'home' && (
          <HomeScreen
            saveData={saveData}
            t={t}
            onPlay={() => setCurrentTab('map')}
            onContinue={() => handleLaunchLevel(saveData.currentLevel || 1)}
            onOpenEvents={() => setCurrentTab('events')}
            onOpenDailyRewards={() => setCurrentTab('daily')}
            onOpenShop={() => setCurrentTab('shop')}
            onOpenTrophy={() => setCurrentTab('trophy')}
            onOpenLanguage={() => setIsLanguageModalOpen(true)}
            onOpenAndroidGuide={() => setCurrentTab('android')}
          />
        )}

        {currentTab === 'map' && (
          <MapScreen
            saveData={saveData}
            t={t}
            onSelectLevel={handleLaunchLevel}
            onBack={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'game' && (
          <GameScreen
            level={activeLevelConfig}
            saveData={saveData}
            t={t}
            onVictory={handleVictory}
            onDefeat={handleDefeat}
            onReturnToMap={() => {
              setCurrentTab('map');
              soundManager.playMusic('home');
            }}
            onConsumeBooster={handleConsumeBooster}
            onSpendCoins={handleSpendCoins}
          />
        )}

        {currentTab === 'shop' && (
          <ShopScreen
            saveData={saveData}
            t={t}
            onBack={() => setCurrentTab('home')}
            onAddCurrencies={handleAddCurrencies}
            onBuyBooster={handleBuyBooster}
          />
        )}

        {currentTab === 'daily' && (
          <DailyRewardsScreen
            saveData={saveData}
            t={t}
            onBack={() => setCurrentTab('home')}
            onClaimReward={handleClaimReward}
          />
        )}

        {currentTab === 'events' && (
          <EventsScreen
            saveData={saveData}
            t={t}
            onBack={() => setCurrentTab('home')}
            onClaimEventReward={handleClaimAchievement}
          />
        )}

        {currentTab === 'trophy' && (
          <ProfileScreen
            saveData={saveData}
            t={t}
            onBack={() => setCurrentTab('home')}
            onUpdateName={(name) =>
              updateSave((prev) => ({
                ...prev,
                profile: { ...prev.profile, name },
              }))
            }
            onSelectAvatar={(avatarId) =>
              updateSave((prev) => ({
                ...prev,
                profile: { ...prev.profile, avatarId },
              }))
            }
            onClaimAchievement={handleClaimAchievement}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsScreen
            saveData={saveData}
            t={t}
            onBack={() => setCurrentTab('home')}
            onUpdateSettings={(newSettings) =>
              updateSave((prev) => ({
                ...prev,
                settings: { ...prev.settings, ...newSettings },
              }))
            }
            onResetProgress={handleResetProgress}
            onOpenPrivacy={() => setLegalType('privacy')}
            onOpenTerms={() => setLegalType('terms')}
            onOpenHelp={() => setLegalType('help')}
            onOpenLanguage={() => setIsLanguageModalOpen(true)}
          />
        )}

        {currentTab === 'android' && (
          <AndroidPackScreen t={t} onBack={() => setCurrentTab('home')} />
        )}

        {/* Legal Modals / Overlays */}
        {legalType && (
          <div className="fixed inset-0 z-50">
            <LegalScreen type={legalType} t={t} onBack={() => setLegalType(null)} />
          </div>
        )}

        {/* Multilingual Selector Modal */}
        {isLanguageModalOpen && (
          <LanguageModal
            currentLanguage={saveData.settings.language}
            t={t}
            onSelectLanguage={(code: LanguageCode) =>
              updateSave((prev) => ({
                ...prev,
                settings: { ...prev.settings, language: code },
              }))
            }
            onClose={() => setIsLanguageModalOpen(false)}
          />
        )}
      </main>

      {/* Bottom Nav Bar - only hidden during active gameplay */}
      {currentTab !== 'game' && (
        <BottomNav currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} t={t} />
      )}
    </div>
  );
}
