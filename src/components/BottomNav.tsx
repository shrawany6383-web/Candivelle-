import React from 'react';
import { Home, Play, ShoppingBag, Gift, Trophy, Settings } from 'lucide-react';
import { TranslationDictionary } from '../i18n/types';

export type ScreenTab = 'home' | 'map' | 'shop' | 'daily' | 'trophy' | 'settings' | 'game' | 'events' | 'privacy' | 'android';

interface BottomNavProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  t: TranslationDictionary;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, t }) => {
  const tabs = [
    { id: 'home' as ScreenTab, label: 'Home', icon: Home, bg: 'from-blue-500 to-indigo-600' },
    { id: 'map' as ScreenTab, label: t.play, icon: Play, bg: 'from-emerald-400 to-green-600' },
    { id: 'shop' as ScreenTab, label: t.shop, icon: ShoppingBag, bg: 'from-amber-400 to-orange-500' },
    { id: 'daily' as ScreenTab, label: t.rewards, icon: Gift, bg: 'from-pink-500 to-rose-600' },
    { id: 'trophy' as ScreenTab, label: t.trophy, icon: Trophy, bg: 'from-yellow-400 to-amber-500' },
    { id: 'settings' as ScreenTab, label: t.settings, icon: Settings, bg: 'from-purple-500 to-indigo-600' },
  ];

  return (
    <nav className="w-full max-w-md mx-auto px-3 py-2 bg-gradient-to-t from-[#1b052d] via-[#2d0a4e] to-transparent flex items-center justify-between gap-1 z-30 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-150 active:scale-90 ${
              isActive
                ? 'bg-gradient-to-b ' + tab.bg + ' shadow-lg shadow-pink-500/20 text-white scale-105 border border-white/50'
                : 'text-purple-200/70 hover:text-white hover:bg-purple-900/30'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-black tracking-tight mt-0.5 max-w-[50px] truncate text-center">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
