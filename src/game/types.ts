export type CandyColor = 'red' | 'yellow' | 'green' | 'blue' | 'orange' | 'purple';

export type SpecialCandyType =
  | 'none'
  | 'rocket-h'    // Clears entire horizontal row
  | 'rocket-v'    // Clears entire vertical column
  | 'bomb'        // 3x3 blast area
  | 'rainbow';    // Color swirl clears all candies of one color

export interface CandyItem {
  id: string;
  color: CandyColor;
  special: SpecialCandyType;
  row: number;
  col: number;
  isMatched?: boolean;
  isNew?: boolean;
  offsetX?: number;
  offsetY?: number;
}

export type ObjectiveType = 'score' | 'collect' | 'jelly' | 'mixed';

export interface TargetCandyObjective {
  color: CandyColor;
  count: number;
  collected: number;
}

export interface LevelConfig {
  id: number;
  chapter: number;
  rows: number;
  cols: number;
  moves: number;
  colors: CandyColor[];
  starScores: [number, number, number];
  objective: {
    type: ObjectiveType;
    targetScore?: number;
    candies?: Array<{ color: CandyColor; count: number }>;
    totalJellies?: number;
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'super-hard';
}

export interface MoveSwap {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}

export interface ActiveBooster {
  type: 'hammer' | 'shuffle' | 'rocket' | 'colorSwirl' | null;
}
