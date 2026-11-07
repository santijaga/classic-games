const width = 10;
const height = 20;

const shapes = {
  I: ['0000', '1111', '0000', '0000'],
  J: ['100', '111', '000'],
  L: ['001', '111', '000'],
  O: ['11', '11'],
  S: ['011', '110', '000'],
  T: ['010', '111', '000'],
  Z: ['110', '011', '000'],
};

type Kind = keyof typeof shapes;
type Cell = Kind | null;
type Point = { x: number; y: number };
type Piece = { kind: Kind; cells: Point[]; x: number; y: number };

export type Phase = 'ready' | 'playing' | 'paused' | 'game-over';

function emptyRow(): Cell[] {
  return Array<Cell>(width).fill(null);
}

export class TetrisGame {
  private board = Array.from({ length: height }, emptyRow);
  private bag: Kind[] = [];
  private piece?: Piece;

  phase: Phase = 'ready';
  lines = 0;
  score = 0;

  start(): void {
    this.board = Array.from({ length: height }, emptyRow);
    this.bag = [];
    this.lines = 0;
    this.score = 0;
    this.phase = 'playing';
    this.spawn();
  }

  togglePause(): void {
    if (this.phase === 'playing') this.phase = 'paused';
    else if (this.phase === 'paused') this.phase = 'playing';
  }

  move(offset: number): void {
    if (this.phase !== 'playing' || !this.piece) return;
    const moved = { ...this.piece, x: this.piece.x + offset };
    if (this.fits(moved)) this.piece = moved;
  }

  rotate(): void {
    if (this.phase !== 'playing' || !this.piece || this.piece.kind === 'O') return;
    const size = shapes[this.piece.kind].length;
    const cells = this.piece.cells.map(({ x, y }) => ({ x: size - 1 - y, y: x }));

    // Try small offsets when the piece is against a wall, the floor, or the stack.
    for (const [dx, dy] of [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1], [0, -2]]) {
      const rotated = { ...this.piece, cells, x: this.piece.x + dx, y: this.piece.y + dy };
      if (this.fits(rotated)) {
        this.piece = rotated;
        return;
      }
    }
  }

  step(): void {
    if (this.phase !== 'playing' || !this.piece) return;
    const lowered = { ...this.piece, y: this.piece.y + 1 };
    if (this.fits(lowered)) this.piece = lowered;
    else this.lock();
  }

  drop(): void {
    if (this.phase !== 'playing' || !this.piece) return;
    let lowered = { ...this.piece, y: this.piece.y + 1 };
    while (this.fits(lowered)) {
      this.piece = lowered;
      lowered = { ...lowered, y: lowered.y + 1 };
    }
    this.lock();
  }

  snapshot() {
    const cells = this.board.map((row) => [...row]);
    if (this.piece) this.draw(cells, this.piece);
    return { cells: cells.flat(), phase: this.phase, lines: this.lines, score: this.score };
  }

  private spawn(): void {
    if (this.bag.length === 0) {
      this.bag = Object.keys(shapes) as Kind[];
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
    }

    const kind = this.bag.pop()!;
    const shape = shapes[kind];
    const cells = shape.flatMap((row, y) =>
      Array.from(row).flatMap((cell, x) => cell === '1' ? [{ x, y }] : []),
    );
    const piece = {
      kind,
      cells,
      x: Math.floor((width - shape.length) / 2),
      y: -Math.min(...cells.map((cell) => cell.y)),
    };
    if (this.fits(piece)) this.piece = piece;
    else this.phase = 'game-over';
  }

  private fits(piece: Piece): boolean {
    return piece.cells.every((cell) => {
      const x = piece.x + cell.x;
      const y = piece.y + cell.y;
      return x >= 0 && x < width && y >= 0 && y < height && this.board[y][x] === null;
    });
  }

  private lock(): void {
    if (!this.piece) return;
    this.draw(this.board, this.piece);
    this.piece = undefined;

    const remaining = this.board.filter((row) => row.some((cell) => cell === null));
    const cleared = height - remaining.length;
    if (cleared) {
      this.board = [...Array.from({ length: cleared }, emptyRow), ...remaining];
      this.lines += cleared;
      this.score += [0, 100, 300, 500, 800][cleared];
    }

    this.spawn();
  }

  private draw(board: Cell[][], piece: Piece): void {
    for (const { x, y } of piece.cells) board[piece.y + y][piece.x + x] = piece.kind;
  }
}
