import React from 'react';
import { ChevronLeft, Shield, FileText, HelpCircle, Mail } from 'lucide-react';
import { TranslationDictionary } from '../i18n/types';
import { soundManager } from '../audio/soundManager';

interface LegalScreenProps {
  type: 'privacy' | 'terms' | 'help';
  t: TranslationDictionary;
  onBack: () => void;
}

export const LegalScreen: React.FC<LegalScreenProps> = ({ type, t, onBack }) => {
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
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {type === 'privacy' && <Shield className="w-5 h-5 text-emerald-400" />}
          {type === 'terms' && <FileText className="w-5 h-5 text-sky-400" />}
          {type === 'help' && <HelpCircle className="w-5 h-5 text-amber-400" />}
          <h1 className="text-base font-black text-white">
            {type === 'privacy'
              ? t.privacyPolicy
              : type === 'terms'
              ? t.termsConditions
              : t.helpSupport}
          </h1>
        </div>

        <div className="w-16" />
      </div>

      <div className="w-full max-w-md mx-auto p-4 text-white text-xs leading-relaxed flex flex-col gap-4">
        {type === 'privacy' && (
          <div className="bg-[#2c0847]/90 border border-purple-400/40 rounded-3xl p-5 shadow-lg flex flex-col gap-3">
            <h2 className="text-sm font-black text-yellow-300">CANDIVELLE Privacy Policy</h2>
            <p className="text-[11px] text-pink-200">Last updated: October 2026</p>

            <h3 className="font-black text-white mt-2">1. Data Collection &amp; Storage</h3>
            <p className="text-purple-200">
              CANDIVELLE is designed as an offline-first casual puzzle game. All your level progress,
              high scores, coin balances, diamond balances, and settings are stored locally on your
              device using browser LocalStorage / IndexedDB.
            </p>

            <h3 className="font-black text-white mt-2">2. Personal Information</h3>
            <p className="text-purple-200">
              We do not collect personal names, emails, contacts, phone numbers, or physical
              addresses. Any player nickname configured in the Profile screen remains strictly on
              your local device.
            </p>

            <h3 className="font-black text-white mt-2">3. Third-Party Analytics &amp; Advertising</h3>
            <p className="text-purple-200">
              The core CANDIVELLE game does not include intrusive spyware or third-party behavioral
              trackers. Any optional cloud features or future Google Play Game Services integrations
              will require explicit user permission.
            </p>

            <h3 className="font-black text-white mt-2">4. Contact</h3>
            <p className="text-purple-200">
              If you have any questions about this privacy statement, you can reach the support team
              at: <span className="text-yellow-300 font-bold">support@candivelle.game</span>
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="bg-[#2c0847]/90 border border-purple-400/40 rounded-3xl p-5 shadow-lg flex flex-col gap-3">
            <h2 className="text-sm font-black text-yellow-300">Terms and Conditions</h2>
            <p className="text-[11px] text-pink-200">Last updated: October 2026</p>

            <h3 className="font-black text-white mt-2">1. Acceptance of Terms</h3>
            <p className="text-purple-200">
              By playing CANDIVELLE, you agree to these terms of service. CANDIVELLE is an original
              candy-themed match-3 puzzle game intended for entertainment purposes.
            </p>

            <h3 className="font-black text-white mt-2">2. In-Game Currencies &amp; Virtual Items</h3>
            <p className="text-purple-200">
              Coins, diamonds, boosters, and hearts earned or unlocked in CANDIVELLE have no
              real-world monetary value and cannot be exchanged for legal tender.
            </p>

            <h3 className="font-black text-white mt-2">3. Fair Play</h3>
            <p className="text-purple-200">
              Players are encouraged to enjoy puzzle progression fairly. We reserve the right to
              update level designs, scoring curves, and booster attributes to maintain puzzle balance.
            </p>
          </div>
        )}

        {type === 'help' && (
          <div className="bg-[#2c0847]/90 border border-purple-400/40 rounded-3xl p-5 shadow-lg flex flex-col gap-3">
            <h2 className="text-sm font-black text-yellow-300">Help &amp; Player Support</h2>

            <h3 className="font-black text-white mt-2">How to Play</h3>
            <ul className="list-disc pl-4 space-y-1 text-purple-200">
              <li>Swipe or tap two adjacent candies to swap them.</li>
              <li>Match 3 or more of the same color to pop candies and earn points.</li>
              <li>Match 4 in a line to create a Striped Rocket that clears rows or columns.</li>
              <li>Match 5 in a line to create a Rainbow Swirl that clears all candies of a color.</li>
              <li>Match 5 in an L or T shape to create a wrapped Candy Bomb (3x3 blast).</li>
            </ul>

            <h3 className="font-black text-white mt-2">Boosters</h3>
            <ul className="list-disc pl-4 space-y-1 text-purple-200">
              <li>🔨 <strong className="text-white">Magic Hammer:</strong> Tap any candy or jelly obstacle to smash it immediately without spending moves.</li>
              <li>🔄 <strong className="text-white">Candy Shuffle:</strong> Reshuffle the board when you want new opportunities.</li>
              <li>🚀 <strong className="text-white">Rocket Blast:</strong> Clears an entire row and column at once!</li>
              <li>🌈 <strong className="text-white">Color Swirl:</strong> Eliminates every candy of the top color from the board.</li>
            </ul>

            <div className="mt-3 p-3 bg-purple-950/70 rounded-2xl border border-purple-500/30 flex items-center gap-3">
              <Mail className="w-5 h-5 text-pink-400" />
              <div>
                <p className="text-xs font-bold text-white">Need further assistance?</p>
                <p className="text-[11px] text-yellow-300">Email: support@candivelle.game</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
