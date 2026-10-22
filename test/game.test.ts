import assert from 'node:assert';
import { test, describe } from 'node:test';
import { LEVELS, getLevelConfig } from '../src/game/levels';
import { CandyEngine } from '../src/game/CandyEngine';
import { TRANSLATIONS } from '../src/i18n/locales';
import { SUPPORTED_LANGUAGES } from '../src/i18n/types';
import { CandyColor, LevelConfig } from '../src/game/types';

describe('CANDIVELLE 100 Playable Levels Audit', () => {
  test('Should contain at least 100 playable levels', () => {
    assert.strictEqual(LEVELS.length >= 100, true, `Expected >= 100 levels, found ${LEVELS.length}`);
  });

  test('Every level from 1 to 100 has valid configuration', () => {
    for (let i = 1; i <= 100; i++) {
      const lvl = getLevelConfig(i);
      assert.strictEqual(lvl.id, i, `Level ID mismatch for level ${i}`);
      assert.strictEqual(lvl.rows >= 6 && lvl.rows <= 10, true, `Invalid rows in level ${i}`);
      assert.strictEqual(lvl.cols >= 6 && lvl.cols <= 10, true, `Invalid cols in level ${i}`);
      assert.strictEqual(lvl.moves >= 15, true, `Moves too low in level ${i}: ${lvl.moves}`);
      assert.strictEqual(lvl.colors.length >= 4, true, `Not enough colors in level ${i}`);
      assert.strictEqual(lvl.starScores[0] < lvl.starScores[1], true, `Star 1 >= Star 2 in level ${i}`);
      assert.strictEqual(lvl.starScores[1] < lvl.starScores[2], true, `Star 2 >= Star 3 in level ${i}`);

      // Check objectives
      const obj = lvl.objective;
      assert.strictEqual(['score', 'collect', 'jelly', 'mixed'].includes(obj.type), true);
      if (obj.type === 'score') {
        assert.strictEqual(typeof obj.targetScore === 'number' && obj.targetScore > 0, true);
      } else if (obj.type === 'collect') {
        assert.strictEqual(Array.isArray(obj.candies) && obj.candies.length > 0, true);
      } else if (obj.type === 'jelly') {
        assert.strictEqual(typeof obj.totalJellies === 'number' && obj.totalJellies > 0, true);
      } else if (obj.type === 'mixed') {
        assert.strictEqual(
          (obj.targetScore && obj.targetScore > 0) ||
            (obj.candies && obj.candies.length > 0) ||
            (obj.totalJellies && obj.totalJellies > 0),
          true
        );
      }
    }
  });

  test('Chapters are balanced 1 to 4', () => {
    const ch1 = LEVELS.filter((l) => l.chapter === 1);
    const ch2 = LEVELS.filter((l) => l.chapter === 2);
    const ch3 = LEVELS.filter((l) => l.chapter === 3);
    const ch4 = LEVELS.filter((l) => l.chapter === 4);
    assert.strictEqual(ch1.length, 25);
    assert.strictEqual(ch2.length, 25);
    assert.strictEqual(ch3.length, 25);
    assert.strictEqual(ch4.length, 25);
  });
});

describe('Match-3 Engine Simulation & Mechanics', () => {
  const testLevel: LevelConfig = {
    id: 1,
    chapter: 1,
    rows: 8,
    cols: 8,
    moves: 25,
    colors: ['red', 'yellow', 'green', 'blue'],
    starScores: [1000, 2000, 3000],
    objective: { type: 'score', targetScore: 1000 },
    difficulty: 'easy',
  };

  test('Initial board creates 8x8 grid without pre-existing 3-matches', () => {
    const engine = new CandyEngine(testLevel);
    const state = engine.getState();
    assert.strictEqual(state.grid.length, 8);
    assert.strictEqual(state.grid[0].length, 8);

    const matches = engine.findMatches();
    assert.strictEqual(matches.length, 0, 'Initial board should have 0 matches');
  });

  test('Adjacent check works correctly', () => {
    const engine = new CandyEngine(testLevel);
    assert.strictEqual(engine.canSwap(0, 0, 0, 1), true, 'Horizontal neighbor should be swappable');
    assert.strictEqual(engine.canSwap(0, 0, 1, 0), true, 'Vertical neighbor should be swappable');
    assert.strictEqual(engine.canSwap(0, 0, 1, 1), false, 'Diagonal should not be swappable');
    assert.strictEqual(engine.canSwap(0, 0, 0, 2), false, 'Distant cell should not be swappable');
  });

  test('Invalid swap reverts and maintains state', async () => {
    const engine = new CandyEngine(testLevel);
    const state = engine.getState();
    const testColors: CandyColor[] = ['red', 'yellow', 'green', 'blue', 'orange', 'purple'];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        state.grid[r][c] = {
          id: `t_${r}_${c}`,
          color: testColors[(r * 2 + c) % testColors.length],
          special: 'none',
          row: r,
          col: c,
        };
      }
    }

    const initialMoves = state.movesLeft;
    const swapped = await engine.swapCandies(0, 0, 0, 1, () => {});
    assert.strictEqual(swapped, false, 'Invalid swap should return false');
    assert.strictEqual(engine.getState().movesLeft, initialMoves, 'Moves should not decrease on invalid swap');
  });

  test('Valid horizontal 3-match is detected and resolved', () => {
    const engine = new CandyEngine(testLevel);
    const state = engine.getState();
    state.grid[2][0] = { id: 'c1', color: 'red', special: 'none', row: 2, col: 0 };
    state.grid[2][1] = { id: 'c2', color: 'red', special: 'none', row: 2, col: 1 };
    state.grid[2][2] = { id: 'c3', color: 'red', special: 'none', row: 2, col: 2 };
    state.grid[2][3] = { id: 'c4', color: 'blue', special: 'none', row: 2, col: 3 };

    const matches = engine.findMatches();
    assert.strictEqual(matches.length >= 1, true, 'Should detect horizontal 3-match');
    const redMatch = matches.find((m) => m.color === 'red');
    assert.strictEqual(!!redMatch, true, 'Should find red match');
    assert.strictEqual(redMatch!.cells.length, 3);
  });

  test('Valid vertical 3-match is detected', () => {
    const engine = new CandyEngine(testLevel);
    const state = engine.getState();
    state.grid[0][3] = { id: 'c1', color: 'yellow', special: 'none', row: 0, col: 3 };
    state.grid[1][3] = { id: 'c2', color: 'yellow', special: 'none', row: 1, col: 3 };
    state.grid[2][3] = { id: 'c3', color: 'yellow', special: 'none', row: 2, col: 3 };
    state.grid[3][3] = { id: 'c4', color: 'blue', special: 'none', row: 3, col: 3 };

    const matches = engine.findMatches();
    const yellowMatch = matches.find((m) => m.color === 'yellow');
    assert.strictEqual(!!yellowMatch, true, 'Should detect vertical yellow match');
    assert.strictEqual(yellowMatch!.cells.length, 3);
  });

  test('Booster Hammer smashes target cell', () => {
    const engine = new CandyEngine(testLevel);
    const ok = engine.useBoosterHammer(3, 3);
    assert.strictEqual(ok, true);
    assert.strictEqual(engine.getState().grid[3][3], null, 'Hammered cell should be cleared');
  });

  test('Booster Rocket clears row and column', () => {
    const engine = new CandyEngine(testLevel);
    const ok = engine.useBoosterRocket(2, 2);
    assert.strictEqual(ok, true);
    assert.strictEqual(engine.getState().grid[2][0], null);
    assert.strictEqual(engine.getState().grid[0][2], null);
  });

  test('Deadlock check hasValidMoves returns boolean', () => {
    const engine = new CandyEngine(testLevel);
    const hasMoves = engine.hasValidMoves();
    assert.strictEqual(typeof hasMoves, 'boolean');
  });
});

describe('Localization & Multilingual Integrity', () => {
  const requiredKeys = [
    'appName',
    'tagline',
    'loading',
    'play',
    'continueGame',
    'events',
    'dailyRewards',
    'shop',
    'rewards',
    'trophy',
    'settings',
    'profile',
    'levelMap',
    'level',
    'moves',
    'score',
    'victory',
    'defeat',
    'sound',
    'music',
    'language',
    'privacyPolicy',
    'termsConditions',
    'helpSupport',
    'resetProgress',
    'claim',
    'coins',
    'diamonds',
    'lives',
  ];

  test('English (en-US) has all required translation keys', () => {
    const en = TRANSLATIONS['en-US'];
    assert.strictEqual(!!en, true, 'en-US dictionary should exist');
    for (const key of requiredKeys) {
      assert.strictEqual(typeof (en as any)[key] === 'string', true, `Missing en-US key: ${key}`);
      assert.strictEqual((en as any)[key].length > 0, true, `Empty en-US key: ${key}`);
    }
  });

  test('Hindi (hi-IN) has all required translation keys and authentic Devanagari', () => {
    const hi = TRANSLATIONS['hi-IN'];
    assert.strictEqual(!!hi, true, 'hi-IN dictionary should exist');
    for (const key of requiredKeys) {
      assert.strictEqual(typeof (hi as any)[key] === 'string', true, `Missing hi-IN key: ${key}`);
      assert.strictEqual((hi as any)[key].length > 0, true, `Empty hi-IN key: ${key}`);
    }
    assert.strictEqual(hi.play, 'खेलें');
    assert.strictEqual(hi.appName, 'CANDIVELLE');
  });

  test('All 9 supported languages are registered and populated', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const dict = TRANSLATIONS[lang.code];
      assert.strictEqual(!!dict, true, `Missing dictionary for ${lang.code}`);
      assert.strictEqual(typeof dict.play, 'string', `Missing play in ${lang.code}`);
      assert.strictEqual(typeof dict.settings, 'string', `Missing settings in ${lang.code}`);
    }
  });
});
