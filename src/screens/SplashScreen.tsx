import React, { useEffect, useState } from 'react';
import { TranslationDictionary } from '../i18n/types';

interface SplashScreenProps {
  t: TranslationDictionary;
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ t, onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 12;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#7e22ce] via-[#db2777] to-[#4c0519] overflow-hidden select-none">
      {/* Background Sweet Sparkles & Candy Blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 left-8 w-32 h-32 rounded-full bg-pink-400 blur-2xl" />
        <div className="absolute bottom-20 right-8 w-40 h-40 rounded-full bg-amber-400 blur-3xl" />
      </div>

      {/* Top Space */}
      <div className="h-6" />

      {/* Main Mascot & Logo Lockup */}
      <div className="flex flex-col items-center z-10 max-w-sm text-center">
        {/* Crown with Stars */}
        <div className="relative mb-2 animate-bounce">
          <svg className="w-20 h-16 drop-shadow-lg" viewBox="0 0 100 80">
            <polygon
              points="10,70 15,25 35,50 50,15 65,50 85,25 90,70"
              fill="url(#crownGrad)"
              stroke="#fef08a"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="15" cy="22" r="5" fill="#f43f5e" />
            <circle cx="50" cy="12" r="6" fill="#06b6d4" />
            <circle cx="85" cy="22" r="5" fill="#f43f5e" />
            <defs>
              <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* CANDIVELLE Logo Text */}
        <h1
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-500 tracking-wider drop-shadow-[0_5px_5px_rgba(0,0,0,0.6)]"
          style={{ textShadow: '0 4px 10px rgba(0,0,0,0.5), 0 0 20px rgba(253, 224, 71, 0.6)' }}
        >
          CANDIVELLE
        </h1>

        {/* Tagline ribbon */}
        <div className="mt-1 px-4 py-1 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 rounded-full shadow-lg border border-pink-300/60">
          <span className="text-xs md:text-sm font-extrabold text-white tracking-widest drop-shadow">
            {t.tagline}
          </span>
        </div>

        {/* Mascot Princess Artwork */}
        <div className="mt-6 relative">
          <div className="w-52 h-52 md:w-60 md:h-60 rounded-full border-4 border-yellow-300/80 shadow-[0_0_30px_rgba(244,114,182,0.8)] overflow-hidden bg-gradient-to-b from-pink-300 to-purple-800 flex items-center justify-center">
            <img
              src="/assets/aistudio/file_00000000c06c82088ba454beec7b950f_a13b195c.png"
              alt="Princess Candivelle"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Loading Bar Section */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2 z-10 pb-4">
        <span className="text-sm font-bold text-pink-100 drop-shadow animate-pulse">
          {t.loading}
        </span>
        <div className="w-full h-5 bg-purple-950/80 rounded-full p-1 border-2 border-pink-300/70 shadow-inner overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-emerald-400 shadow transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-pink-200/80">{progress}%</span>
      </div>
    </div>
  );
};
