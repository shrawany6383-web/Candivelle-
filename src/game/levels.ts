import { CandyColor, LevelConfig } from './types';

const ALL_COLORS: CandyColor[] = ['red', 'yellow', 'green', 'blue', 'orange', 'purple'];

/**
 * 100 Playable, Hand-Balanced Data-Driven Levels for CANDIVELLE
 * Smooth difficulty ramp across 4 candy chapters:
 * - Chapter 1: Sugar Meadow (Levels 1 - 25)
 * - Chapter 2: Bubblegum Falls (Levels 26 - 50)
 * - Chapter 3: Choco Castle (Levels 51 - 75)
 * - Chapter 4: Lollipop Peaks (Levels 76 - 100)
 */
export const LEVELS: LevelConfig[] = Array.from({ length: 100 }, (_, index) => {
  const levelNum = index + 1;
  const chapter = Math.min(4, Math.floor((levelNum - 1) / 25) + 1);

  // Palette complexity: starts with 4 colors, moves to 5, then 6 colors
  let colorCount = 4;
  if (levelNum > 15) colorCount = 5;
  if (levelNum > 45) colorCount = 6;
  const colors = ALL_COLORS.slice(0, colorCount);

  // Moves curve: 20 to 32 moves
  const moves = Math.max(18, 30 - Math.floor(levelNum / 10) + (levelNum % 4));

  // Difficulty curve
  let difficulty: 'easy' | 'medium' | 'hard' | 'super-hard' = 'easy';
  if (levelNum % 25 === 0) {
    difficulty = 'super-hard';
  } else if (levelNum % 10 === 0 || levelNum > 70) {
    difficulty = 'hard';
  } else if (levelNum > 20) {
    difficulty = 'medium';
  }

  // Objectives cycle smoothly between:
  // 1. Collect specific candy colors (Heart, Star, Gummy, etc.)
  // 2. Clear jelly board
  // 3. Score target
  // 4. Mixed (Candies + Jelly or Score)
  const objectiveType =
    levelNum === 1
      ? 'score'
      : levelNum % 4 === 1
      ? 'score'
      : levelNum % 4 === 2
      ? 'collect'
      : levelNum % 4 === 3
      ? 'jelly'
      : 'mixed';

  // Base score scaling
  const baseTargetScore = 1200 + levelNum * 220;
  const starScores: [number, number, number] = [
    baseTargetScore,
    Math.round(baseTargetScore * 1.5),
    Math.round(baseTargetScore * 2.2),
  ];

  if (objectiveType === 'score') {
    return {
      id: levelNum,
      chapter,
      rows: 8,
      cols: 8,
      moves,
      colors,
      starScores,
      objective: {
        type: 'score',
        targetScore: baseTargetScore,
      },
      difficulty,
    };
  }

  if (objectiveType === 'collect') {
    const c1 = colors[0];
    const c2 = colors[1];
    const c3 = colors[2];
    const count1 = 10 + Math.min(25, Math.floor(levelNum * 0.4));
    const count2 = 10 + Math.min(20, Math.floor(levelNum * 0.3));

    const candies = [
      { color: c1, count: count1 },
      { color: c2, count: count2 },
    ];
    if (levelNum > 40) {
      candies.push({ color: c3, count: 12 + Math.floor(levelNum * 0.2) });
    }

    return {
      id: levelNum,
      chapter,
      rows: 8,
      cols: 8,
      moves,
      colors,
      starScores,
      objective: {
        type: 'collect',
        candies,
      },
      difficulty,
    };
  }

  if (objectiveType === 'jelly') {
    const jellies = Math.min(36, 12 + Math.floor(levelNum * 0.35));
    return {
      id: levelNum,
      chapter,
      rows: 8,
      cols: 8,
      moves,
      colors,
      starScores,
      objective: {
        type: 'jelly',
        totalJellies: jellies,
      },
      difficulty,
    };
  }

  // Mixed: Candies + Score / Jelly
  const jellies = Math.min(24, 10 + Math.floor(levelNum * 0.2));
  return {
    id: levelNum,
    chapter,
    rows: 8,
    cols: 8,
    moves,
    colors,
    starScores,
    objective: {
      type: 'mixed',
      targetScore: Math.round(baseTargetScore * 0.8),
      candies: [
        { color: colors[0], count: 12 + Math.floor(levelNum * 0.2) },
        { color: colors[1], count: 10 + Math.floor(levelNum * 0.15) },
      ],
      totalJellies: jellies,
    },
    difficulty,
  };
});

export function getLevelConfig(levelId: number): LevelConfig {
  const found = LEVELS.find((l) => l.id === levelId);
  return found || LEVELS[0];
}
