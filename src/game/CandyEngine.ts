import { CandyColor, CandyItem, LevelConfig, SpecialCandyType } from './types';

export interface BoardState {
  grid: (CandyItem | null)[][];
  jellyGrid: boolean[][];
  score: number;
  movesLeft: number;
  comboCount: number;
  isProcessing: boolean;
  collectedCandies: Record<CandyColor, number>;
  clearedJellies: number;
  isWon: boolean;
  isLost: boolean;
  lastCallout: string | null;
}

export class CandyEngine {
  private config: LevelConfig;
  private state: BoardState;
  private idCounter = 1;

  constructor(config: LevelConfig) {
    this.config = config;
    this.state = this.initBoard();
  }

  public getState(): BoardState {
    return this.state;
  }

  private nextId(): string {
    return `candy_${this.idCounter++}`;
  }

  private getRandomColor(): CandyColor {
    const list = this.config.colors;
    return list[Math.floor(Math.random() * list.length)];
  }

  private createCandy(row: number, col: number, color?: CandyColor, special: SpecialCandyType = 'none'): CandyItem {
    return {
      id: this.nextId(),
      color: color || this.getRandomColor(),
      special,
      row,
      col,
    };
  }

  public initBoard(): BoardState {
    const { rows, cols } = this.config;
    const grid: (CandyItem | null)[][] = [];

    // Initialize jelly grid if objective requires it
    const jellyGrid: boolean[][] = [];
    const hasJellies = this.config.objective.totalJellies && this.config.objective.totalJellies > 0;
    let jellyCount = 0;
    const targetJellies = this.config.objective.totalJellies || 0;

    for (let r = 0; r < rows; r++) {
      jellyGrid[r] = [];
      for (let c = 0; c < cols; c++) {
        // Place jellies in center cluster if needed
        const isCenter = r >= 2 && r <= rows - 3 && c >= 2 && c <= cols - 3;
        if (hasJellies && isCenter && jellyCount < targetJellies) {
          jellyGrid[r][c] = true;
          jellyCount++;
        } else {
          jellyGrid[r][c] = false;
        }
      }
    }

    // Fill candies with zero initial 3-matches
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        let color: CandyColor;
        let attempts = 0;
        do {
          color = this.getRandomColor();
          attempts++;
        } while (
          attempts < 50 &&
          ((c >= 2 && grid[r][c - 1]?.color === color && grid[r][c - 2]?.color === color) ||
            (r >= 2 && grid[r - 1][c]?.color === color && grid[r - 2][c]?.color === color))
        );
        grid[r][c] = this.createCandy(r, c, color);
      }
    }

    const state: BoardState = {
      grid,
      jellyGrid,
      score: 0,
      movesLeft: this.config.moves,
      comboCount: 0,
      isProcessing: false,
      collectedCandies: {
        red: 0,
        yellow: 0,
        green: 0,
        blue: 0,
        orange: 0,
        purple: 0,
      },
      clearedJellies: 0,
      isWon: false,
      isLost: false,
      lastCallout: null,
    };

    this.state = state;
    return state;
  }

  public canSwap(r1: number, c1: number, r2: number, c2: number): boolean {
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
  }

  public async swapCandies(
    r1: number,
    c1: number,
    r2: number,
    c2: number,
    onStepUpdate: (s: BoardState) => void
  ): Promise<boolean> {
    if (this.state.isProcessing || this.state.isWon || this.state.isLost) return false;
    if (!this.canSwap(r1, c1, r2, c2)) return false;

    const item1 = this.state.grid[r1][c1];
    const item2 = this.state.grid[r2][c2];
    if (!item1 || !item2) return false;

    this.state.isProcessing = true;

    // Check special combo swap (e.g. Rainbow + Color or Rocket + Bomb)
    const isSpecialCombo =
      item1.special === 'rainbow' ||
      item2.special === 'rainbow' ||
      (item1.special !== 'none' && item2.special !== 'none');

    // Perform tentative swap
    this.state.grid[r1][c1] = { ...item2, row: r1, col: c1 };
    this.state.grid[r2][c2] = { ...item1, row: r2, col: c2 };

    const matches = this.findMatches();

    if (matches.length === 0 && !isSpecialCombo) {
      // Revert swap
      this.state.grid[r1][c1] = item1;
      this.state.grid[r2][c2] = item2;
      this.state.isProcessing = false;
      onStepUpdate({ ...this.state });
      return false;
    }

    // Valid move!
    this.state.movesLeft--;
    this.state.comboCount = 1;
    onStepUpdate({ ...this.state });

    if (isSpecialCombo && matches.length === 0) {
      await this.triggerSpecialCombo(r1, c1, r2, c2, onStepUpdate);
    } else {
      await this.resolveMatchesAndCascades(onStepUpdate);
    }

    // Check win/lose
    this.checkGameStatus();

    // Check deadlocks
    if (!this.state.isWon && !this.state.isLost && !this.hasValidMoves()) {
      this.state.lastCallout = 'Shuffling Board!';
      this.shuffleBoard();
      onStepUpdate({ ...this.state });
      await new Promise((res) => setTimeout(res, 600));
    }

    this.state.isProcessing = false;
    onStepUpdate({ ...this.state });
    return true;
  }

  private async triggerSpecialCombo(
    r1: number,
    c1: number,
    r2: number,
    c2: number,
    onStepUpdate: (s: BoardState) => void
  ) {
    const item1 = this.state.grid[r1][c1]!;
    const item2 = this.state.grid[r2][c2]!;

    const toRemove: { r: number; c: number }[] = [];

    if (item1.special === 'rainbow' && item2.special === 'rainbow') {
      // Clear entire board!
      this.state.lastCallout = 'Mega Super Blast!';
      for (let r = 0; r < this.config.rows; r++) {
        for (let c = 0; c < this.config.cols; c++) {
          toRemove.push({ r, c });
        }
      }
    } else if (item1.special === 'rainbow' || item2.special === 'rainbow') {
      const targetColor = item1.special === 'rainbow' ? item2.color : item1.color;
      this.state.lastCallout = 'Color Extravaganza!';
      toRemove.push({ r: r1, c: c1 }, { r: r2, c: c2 });
      for (let r = 0; r < this.config.rows; r++) {
        for (let c = 0; c < this.config.cols; c++) {
          if (this.state.grid[r][c]?.color === targetColor) {
            toRemove.push({ r, c });
          }
        }
      }
    } else if (
      (item1.special.startsWith('rocket') && item2.special === 'bomb') ||
      (item2.special.startsWith('rocket') && item1.special === 'bomb')
    ) {
      // 3 Rows and 3 Columns cleared
      this.state.lastCallout = 'Mega Cross Blast!';
      for (let offset = -1; offset <= 1; offset++) {
        const row = r2 + offset;
        const col = c2 + offset;
        if (row >= 0 && row < this.config.rows) {
          for (let c = 0; c < this.config.cols; c++) toRemove.push({ r: row, c });
        }
        if (col >= 0 && col < this.config.cols) {
          for (let r = 0; r < this.config.rows; r++) toRemove.push({ r, c: col });
        }
      }
    } else {
      // Rocket + Rocket or Bomb + Bomb
      this.state.lastCallout = 'Double Blast!';
      for (let c = 0; c < this.config.cols; c++) toRemove.push({ r: r2, c });
      for (let r = 0; r < this.config.rows; r++) toRemove.push({ r, c: c2 });
    }

    this.removeCells(toRemove);
    await new Promise((res) => setTimeout(res, 250));
    await this.applyGravityAndRefill(onStepUpdate);
    await this.resolveMatchesAndCascades(onStepUpdate);
  }

  public findMatches(): { cells: { r: number; c: number }[]; color: CandyColor }[] {
    const { rows, cols } = this.config;
    const matches: { cells: { r: number; c: number }[]; color: CandyColor }[] = [];

    // Horizontal matches
    for (let r = 0; r < rows; r++) {
      let matchLen = 1;
      for (let c = 1; c < cols; c++) {
        const prev = this.state.grid[r][c - 1];
        const curr = this.state.grid[r][c];
        if (prev && curr && prev.color === curr.color && prev.special !== 'rainbow') {
          matchLen++;
        } else {
          if (matchLen >= 3) {
            const cells = [];
            for (let i = c - matchLen; i < c; i++) cells.push({ r, c: i });
            matches.push({ cells, color: prev!.color });
          }
          matchLen = 1;
        }
      }
      if (matchLen >= 3) {
        const prev = this.state.grid[r][cols - 1];
        const cells = [];
        for (let i = cols - matchLen; i < cols; i++) cells.push({ r, c: i });
        if (prev) matches.push({ cells, color: prev.color });
      }
    }

    // Vertical matches
    for (let c = 0; c < cols; c++) {
      let matchLen = 1;
      for (let r = 1; r < rows; r++) {
        const prev = this.state.grid[r - 1][c];
        const curr = this.state.grid[r][c];
        if (prev && curr && prev.color === curr.color && prev.special !== 'rainbow') {
          matchLen++;
        } else {
          if (matchLen >= 3) {
            const cells = [];
            for (let i = r - matchLen; i < r; i++) cells.push({ r: i, c });
            matches.push({ cells, color: prev!.color });
          }
          matchLen = 1;
        }
      }
      if (matchLen >= 3) {
        const prev = this.state.grid[rows - 1][c];
        const cells = [];
        for (let i = rows - matchLen; i < rows; i++) cells.push({ r: i, c });
        if (prev) matches.push({ cells, color: prev.color });
      }
    }

    return matches;
  }

  public async resolveMatchesAndCascades(onStepUpdate: (s: BoardState) => void) {
    let cascadeCount = 0;

    while (true) {
      const matches = this.findMatches();
      if (matches.length === 0) break;

      cascadeCount++;
      this.state.comboCount = cascadeCount;

      if (cascadeCount === 2) this.state.lastCallout = 'Sweet!';
      else if (cascadeCount === 3) this.state.lastCallout = 'Tasty!';
      else if (cascadeCount >= 4) this.state.lastCallout = 'Delicious!';

      const cellsToRemove: { r: number; c: number }[] = [];
      const specialsToSpawn: { r: number; c: number; special: SpecialCandyType; color: CandyColor }[] = [];

      // Detect L/T shape intersections to spawn Wrapped Candy Bombs
      const hMatches = matches.filter((m) => m.cells.length > 1 && m.cells[0].r === m.cells[1].r);
      const vMatches = matches.filter((m) => m.cells.length > 1 && m.cells[0].c === m.cells[1].c);
      const bombCells = new Set<string>();

      for (const hm of hMatches) {
        for (const vm of vMatches) {
          if (hm.color === vm.color) {
            for (const hc of hm.cells) {
              if (vm.cells.some((vc) => vc.r === hc.r && vc.c === hc.c)) {
                const key = `${hc.r},${hc.c}`;
                if (!bombCells.has(key)) {
                  bombCells.add(key);
                  specialsToSpawn.push({
                    r: hc.r,
                    c: hc.c,
                    special: 'bomb',
                    color: hm.color,
                  });
                }
              }
            }
          }
        }
      }

      for (const m of matches) {
        const len = m.cells.length;
        const middleCell = m.cells[Math.floor(len / 2)];
        const middleKey = `${middleCell.r},${middleCell.c}`;

        // Don't override an intersection bomb
        if (!bombCells.has(middleKey)) {
          if (len >= 5) {
            specialsToSpawn.push({
              r: middleCell.r,
              c: middleCell.c,
              special: 'rainbow',
              color: m.color,
            });
          } else if (len === 4) {
            const isHoriz = m.cells[0].r === m.cells[1].r;
            specialsToSpawn.push({
              r: middleCell.r,
              c: middleCell.c,
              special: isHoriz ? 'rocket-v' : 'rocket-h',
              color: m.color,
            });
          }
        }

        for (const cell of m.cells) {
          cellsToRemove.push(cell);
        }
      }

      // Check special candy activations (e.g. rockets, bombs)
      const expandedRemoval = this.expandSpecialExplosions(cellsToRemove);

      // Score calculation
      const points = expandedRemoval.length * 60 * cascadeCount;
      this.state.score += points;

      this.removeCells(expandedRemoval);

      // Spawn special candies in designated cells
      for (const sp of specialsToSpawn) {
        this.state.grid[sp.r][sp.c] = this.createCandy(sp.r, sp.c, sp.color, sp.special);
      }

      onStepUpdate({ ...this.state });
      await new Promise((res) => setTimeout(res, 220));

      await this.applyGravityAndRefill(onStepUpdate);
      onStepUpdate({ ...this.state });
      await new Promise((res) => setTimeout(res, 180));
    }
  }

  private expandSpecialExplosions(initialCells: { r: number; c: number }[]): { r: number; c: number }[] {
    const queue = [...initialCells];
    const visited = new Set<string>();
    const result: { r: number; c: number }[] = [];

    while (queue.length > 0) {
      const cell = queue.shift()!;
      const key = `${cell.r},${cell.c}`;
      if (visited.has(key)) continue;
      visited.add(key);
      result.push(cell);

      const item = this.state.grid[cell.r]?.[cell.c];
      if (!item) continue;

      if (item.special === 'rocket-h') {
        for (let c = 0; c < this.config.cols; c++) {
          queue.push({ r: cell.r, c });
        }
      } else if (item.special === 'rocket-v') {
        for (let r = 0; r < this.config.rows; r++) {
          queue.push({ r, c: cell.c });
        }
      } else if (item.special === 'bomb') {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = cell.r + dr;
            const nc = cell.c + dc;
            if (nr >= 0 && nr < this.config.rows && nc >= 0 && nc < this.config.cols) {
              queue.push({ r: nr, c: nc });
            }
          }
        }
      }
    }

    return result;
  }

  private removeCells(cells: { r: number; c: number }[]) {
    for (const { r, c } of cells) {
      const item = this.state.grid[r][c];
      if (item) {
        this.state.collectedCandies[item.color] = (this.state.collectedCandies[item.color] || 0) + 1;
        this.state.grid[r][c] = null;
      }
      // Clear jelly if present
      if (this.state.jellyGrid[r] && this.state.jellyGrid[r][c]) {
        this.state.jellyGrid[r][c] = false;
        this.state.clearedJellies++;
        this.state.score += 150;
      }
    }
  }

  private async applyGravityAndRefill(onStepUpdate: (s: BoardState) => void) {
    const { rows, cols } = this.config;

    // Drop candies down
    for (let c = 0; c < cols; c++) {
      let emptyRow = rows - 1;
      for (let r = rows - 1; r >= 0; r--) {
        if (this.state.grid[r][c] !== null) {
          if (r !== emptyRow) {
            this.state.grid[emptyRow][c] = {
              ...this.state.grid[r][c]!,
              row: emptyRow,
              col: c,
            };
            this.state.grid[r][c] = null;
          }
          emptyRow--;
        }
      }

      // Fill from top with new candies
      for (let r = emptyRow; r >= 0; r--) {
        this.state.grid[r][c] = this.createCandy(r, c);
      }
    }

    onStepUpdate({ ...this.state });
  }

  public checkGameStatus() {
    const obj = this.config.objective;
    let won = true;

    if (obj.type === 'score' || obj.type === 'mixed') {
      if (obj.targetScore && this.state.score < obj.targetScore) {
        won = false;
      }
    }

    if (obj.type === 'collect' || obj.type === 'mixed') {
      if (obj.candies) {
        for (const target of obj.candies) {
          if ((this.state.collectedCandies[target.color] || 0) < target.count) {
            won = false;
            break;
          }
        }
      }
    }

    if (obj.type === 'jelly' || obj.type === 'mixed') {
      if (obj.totalJellies && this.state.clearedJellies < obj.totalJellies) {
        won = false;
      }
    }

    if (won) {
      this.state.isWon = true;
      this.state.lastCallout = 'Sugar Crush!';
    } else if (this.state.movesLeft <= 0) {
      this.state.isLost = true;
    }
  }

  public hasValidMoves(): boolean {
    const { rows, cols } = this.config;
    // Test all adjacent swaps
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Swap right
        if (c + 1 < cols) {
          if (this.testSwapHasMatch(r, c, r, c + 1)) return true;
        }
        // Swap down
        if (r + 1 < rows) {
          if (this.testSwapHasMatch(r, c, r + 1, c)) return true;
        }
      }
    }
    return false;
  }

  private testSwapHasMatch(r1: number, c1: number, r2: number, c2: number): boolean {
    const item1 = this.state.grid[r1][c1];
    const item2 = this.state.grid[r2][c2];
    if (!item1 || !item2) return false;

    // Rainbow candies always have valid moves
    if (item1.special === 'rainbow' || item2.special === 'rainbow') return true;

    // Simulate swap
    this.state.grid[r1][c1] = item2;
    this.state.grid[r2][c2] = item1;

    const matches = this.findMatches();

    // Revert
    this.state.grid[r1][c1] = item1;
    this.state.grid[r2][c2] = item2;

    return matches.length > 0;
  }

  public shuffleBoard() {
    const candies: CandyItem[] = [];
    const { rows, cols } = this.config;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (this.state.grid[r][c]) {
          candies.push(this.state.grid[r][c]!);
        }
      }
    }

    // Fisher-Yates shuffle
    for (let i = candies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candies[i], candies[j]] = [candies[j], candies[i]];
    }

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        candies[idx].row = r;
        candies[idx].col = c;
        this.state.grid[r][c] = candies[idx];
        idx++;
      }
    }
  }

  // --- BOOSTERS IMPLEMENTATION ---

  public useBoosterHammer(r: number, c: number): boolean {
    if (this.state.isProcessing || this.state.isWon || this.state.isLost) return false;
    this.removeCells([{ r, c }]);
    return true;
  }

  public useBoosterRocket(r: number, c: number): boolean {
    if (this.state.isProcessing || this.state.isWon || this.state.isLost) return false;
    const cells: { r: number; c: number }[] = [];
    for (let col = 0; col < this.config.cols; col++) cells.push({ r, c: col });
    for (let row = 0; row < this.config.rows; row++) cells.push({ r: row, c });
    this.removeCells(cells);
    return true;
  }

  public useBoosterColorSwirl(): boolean {
    if (this.state.isProcessing || this.state.isWon || this.state.isLost) return false;
    // Find most common color
    const counts: Record<string, number> = {};
    for (let r = 0; r < this.config.rows; r++) {
      for (let c = 0; c < this.config.cols; c++) {
        const item = this.state.grid[r][c];
        if (item) counts[item.color] = (counts[item.color] || 0) + 1;
      }
    }
    let topColor: CandyColor = this.config.colors[0];
    let max = 0;
    for (const [col, cnt] of Object.entries(counts)) {
      if (cnt > max) {
        max = cnt;
        topColor = col as CandyColor;
      }
    }

    const cells: { r: number; c: number }[] = [];
    for (let r = 0; r < this.config.rows; r++) {
      for (let c = 0; c < this.config.cols; c++) {
        if (this.state.grid[r][c]?.color === topColor) {
          cells.push({ r, c });
        }
      }
    }
    this.removeCells(cells);
    return true;
  }

  public addExtraMoves(count: number = 5) {
    this.state.movesLeft += count;
    this.state.isLost = false;
  }
}
