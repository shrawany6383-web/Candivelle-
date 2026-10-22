import React from 'react';
import { CandyColor, SpecialCandyType } from '../game/types';

interface CandyPieceProps {
  color: CandyColor;
  special?: SpecialCandyType;
  isSelected?: boolean;
  isMatched?: boolean;
  size?: number;
}

export const CandyPiece: React.FC<CandyPieceProps> = ({
  color,
  special = 'none',
  isSelected = false,
  isMatched = false,
  size = 52,
}) => {
  // Color themes with gradients, shadows and specular highlights
  const colorGradients: Record<CandyColor, { bg: string; border: string; glow: string }> = {
    red: {
      bg: 'radial-gradient(circle at 35% 30%, #ff8da1 0%, #ef4444 55%, #991b1b 100%)',
      border: '#fca5a5',
      glow: 'rgba(239, 68, 68, 0.6)',
    },
    yellow: {
      bg: 'radial-gradient(circle at 35% 30%, #fef08a 0%, #eab308 55%, #854d0e 100%)',
      border: '#fde047',
      glow: 'rgba(234, 179, 8, 0.6)',
    },
    green: {
      bg: 'radial-gradient(circle at 35% 30%, #86efac 0%, #22c55e 55%, #14532d 100%)',
      border: '#bbf7d0',
      glow: 'rgba(34, 197, 94, 0.6)',
    },
    blue: {
      bg: 'radial-gradient(circle at 35% 30%, #7dd3fc 0%, #0284c7 55%, #0c4a6e 100%)',
      border: '#bae6fd',
      glow: 'rgba(2, 132, 199, 0.6)',
    },
    orange: {
      bg: 'radial-gradient(circle at 35% 30%, #fdba74 0%, #f97316 55%, #9a3412 100%)',
      border: '#fed7aa',
      glow: 'rgba(249, 115, 22, 0.6)',
    },
    purple: {
      bg: 'radial-gradient(circle at 35% 30%, #d8b4fe 0%, #a855f7 55%, #581c87 100%)',
      border: '#e9d5ff',
      glow: 'rgba(168, 85, 247, 0.6)',
    },
  };

  const theme = colorGradients[color] || colorGradients.red;

  // Shapes
  const renderShape = () => {
    if (special === 'rainbow') {
      return (
        <div
          className="w-full h-full rounded-full relative flex items-center justify-center overflow-hidden animate-pulse shadow-lg"
          style={{
            background:
              'conic-gradient(from 0deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #a855f7, #ef4444)',
            boxShadow: '0 0 15px rgba(236, 72, 153, 0.8), inset 0 2px 4px rgba(255,255,255,0.8)',
          }}
        >
          {/* Central chocolate swirl */}
          <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-amber-900 to-amber-700 flex items-center justify-center border-2 border-white/80 shadow-inner">
            <span className="text-white text-xs font-black drop-shadow">★</span>
          </div>
        </div>
      );
    }

    if (color === 'red') {
      // 3D Cartoon Heart
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="redHeartGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ff99b0" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </radialGradient>
            <filter id="softGlow">
              <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#7f1d1d" floodOpacity="0.5" />
            </filter>
          </defs>
          <path
            d="M 50,30 C 50,15 30,8 18,22 C 6,36 12,56 50,86 C 88,56 94,36 82,22 C 70,8 50,15 50,30 Z"
            fill="url(#redHeartGrad)"
            stroke="#fecdd3"
            strokeWidth="3"
            filter="url(#softGlow)"
          />
          {/* Gloss highlight */}
          <ellipse cx="32" cy="28" rx="8" ry="4" transform="rotate(-30 32 28)" fill="white" opacity="0.6" />
        </svg>
      );
    }

    if (color === 'yellow') {
      // 3D Cartoon Star
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="yellowStarGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="45%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#854d0e" />
            </radialGradient>
          </defs>
          <polygon
            points="50,10 63,38 93,40 70,60 77,90 50,73 23,90 30,60 7,40 37,38"
            fill="url(#yellowStarGrad)"
            stroke="#fef08a"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Specular highlight */}
          <circle cx="42" cy="35" r="5" fill="white" opacity="0.75" />
        </svg>
      );
    }

    if (color === 'green') {
      // 3D Cartoon Gummy Bear / Sweet Drop
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="greenDropGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#bbf7d0" />
              <stop offset="55%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#14532d" />
            </radialGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="url(#greenDropGrad)"
            stroke="#dcfce7"
            strokeWidth="3.5"
          />
          {/* Curved gloss streak */}
          <path d="M 28,34 Q 50,22 68,30" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" />
        </svg>
      );
    }

    if (color === 'blue') {
      // 3D Cartoon Diamond / Gem
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="blueGemGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </radialGradient>
          </defs>
          <polygon
            points="50,12 86,50 50,88 14,50"
            fill="url(#blueGemGrad)"
            stroke="#bae6fd"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <line x1="50" y1="12" x2="50" y2="88" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />
          <line x1="14" y1="50" x2="86" y2="50" stroke="#38bdf8" strokeWidth="2" opacity="0.5" />
          <circle cx="44" cy="38" r="4.5" fill="white" opacity="0.8" />
        </svg>
      );
    }

    if (color === 'orange') {
      // Rounded Jelly Lozenge
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="orangeGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffedd5" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#7c2d12" />
            </radialGradient>
          </defs>
          <rect
            x="18"
            y="26"
            width="64"
            height="48"
            rx="24"
            fill="url(#orangeGrad)"
            stroke="#ffedd5"
            strokeWidth="3.5"
          />
          <ellipse cx="40" cy="38" rx="10" ry="4" transform="rotate(-15 40 38)" fill="white" opacity="0.65" />
        </svg>
      );
    }

    // Purple Bonbon
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        <defs>
          <radialGradient id="purpleGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#4c1d95" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="36" fill="url(#purpleGrad)" stroke="#f3e8ff" strokeWidth="3.5" />
        <ellipse cx="50" cy="50" rx="30" ry="12" stroke="#d8b4fe" strokeWidth="2.5" fill="none" opacity="0.6" />
        <circle cx="40" cy="36" r="4.5" fill="white" opacity="0.8" />
      </svg>
    );
  };

  return (
    <div
      className={`relative select-none transition-transform duration-150 flex items-center justify-center ${
        isSelected ? 'scale-115 ring-3 ring-white ring-offset-2 ring-offset-purple-900 z-20' : ''
      } ${isMatched ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {renderShape()}

      {/* Special Badge Overlays */}
      {special === 'rocket-h' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-2.5 bg-white/90 rounded-full shadow-md flex justify-between px-1 border border-pink-400 animate-pulse">
            <span className="text-[9px] font-black text-pink-600 leading-none">◀</span>
            <span className="text-[9px] font-black text-pink-600 leading-none">▶</span>
          </div>
        </div>
      )}

      {special === 'rocket-v' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-full w-2.5 bg-white/90 rounded-full shadow-md flex flex-col justify-between py-1 border border-pink-400 animate-pulse">
            <span className="text-[9px] font-black text-pink-600 leading-none">▲</span>
            <span className="text-[9px] font-black text-pink-600 leading-none">▼</span>
          </div>
        </div>
      )}

      {special === 'bomb' && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-red-500 rounded-full p-1 shadow-md border-2 border-white animate-bounce pointer-events-none">
          <span className="text-[10px] font-black text-white leading-none">💣</span>
        </div>
      )}
    </div>
  );
};
