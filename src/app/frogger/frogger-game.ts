export const size = 11;
export const homes = [1.5, 3.5, 5.5, 7.5, 9.5];
export const homeWidth = 1.35;

const radius = 0.28;
const startRow = size - 1;
const directions = { Up: [0, -1], Left: [-1, 0], Down: [0, 1], Right: [1, 0] } as const;
type Direction = keyof typeof directions;
export const actions = Object.keys(directions) as Direction[];
export type Result = 'won' | 'game-over' | undefined;

const lanes = [
  { row: 1, kind: 'river', speed: 1.25, spacing: 4.1, width: 2.6, offset: 0.8 },
  { row: 2, kind: 'river', speed: -1.55, spacing: 4.5, width: 2.8, offset: 2.3 },
  { row: 3, kind: 'river', speed: 1.05, spacing: 3.9, width: 2.5, offset: 0.2 },
  { row: 4, kind: 'river', speed: -1.3, spacing: 4.2, width: 2.7, offset: 1.6 },
  { row: 6, kind: 'road', speed: -1.8, spacing: 4.2, width: 1.35, offset: 2.7 },
  { row: 7, kind: 'road', speed: 2.15, spacing: 4.7, width: 1.3, offset: 1.2 },
  { row: 8, kind: 'road', speed: -1.5, spacing: 4.4, width: 1.75, offset: 0.6 },
  { row: 9, kind: 'road', speed: 1.7, spacing: 4.3, width: 1.4, offset: 2 },
] as const;

function obstaclePositions(lane: (typeof lanes)[number], time: number): number[] {
  const distance = lane.offset + lane.speed * time;
  const offset = ((distance % lane.spacing) + lane.spacing) % lane.spacing;
  const positions: number[] = [];
  for (let x = offset - lane.spacing; x < size; x += lane.spacing) {
    if (x + lane.width > 0) positions.push(x);
  }
  return positions;
}

export class FroggerGame {
  private x = size / 2;
  private row = startRow;
  private time = 0;
  private lives = 3;
  private readonly reached = homes.map(() => false);
  private result: Result;

  step(seconds: number): Result {
    if (this.result) return this.result;
    const lane = lanes.find(({ row }) => row === this.row);
    if (lane?.kind === 'river') this.x += lane.speed * seconds;
    this.time += seconds;
    return this.checkPosition();
  }

  move(direction: Direction): Result {
    if (this.result) return this.result;
    const [dx, dy] = directions[direction];
    const row = this.row + dy;
    if (row < 0 || row > startRow) return;
    this.x = Math.max(radius, Math.min(size - radius, this.x + dx));
    this.row = row;
    return this.checkPosition();
  }

  snapshot() {
    return {
      x: this.x,
      row: this.row,
      lives: this.lives,
      reached: [...this.reached],
      score: this.reached.filter(Boolean).length,
      lanes: lanes.map((lane) => ({ ...lane, positions: obstaclePositions(lane, this.time) })),
    };
  }

  private checkPosition(): Result {
    if (this.x < radius || this.x > size - radius) return this.loseLife();

    if (this.row === 0) {
      const home = homes.findIndex((x) => Math.abs(this.x - x) <= homeWidth / 2);
      if (home < 0 || this.reached[home]) return this.loseLife();
      this.reached[home] = true;
      if (this.reached.every(Boolean)) {
        this.result = 'won';
        return this.result;
      }
      this.resetFrog();
      return;
    }

    const lane = lanes.find(({ row }) => row === this.row);
    if (!lane) return;
    const positions = obstaclePositions(lane, this.time);
    if (lane.kind === 'road') {
      if (positions.some((x) => this.x + radius > x && this.x - radius < x + lane.width)) {
        return this.loseLife();
      }
    } else if (!positions.some((x) => this.x >= x && this.x <= x + lane.width)) {
      return this.loseLife();
    }
    return;
  }

  private loseLife(): Result {
    this.lives--;
    if (this.lives === 0) {
      this.result = 'game-over';
      return this.result;
    }
    this.resetFrog();
    return;
  }

  private resetFrog(): void {
    this.x = size / 2;
    this.row = startRow;
  }
}
