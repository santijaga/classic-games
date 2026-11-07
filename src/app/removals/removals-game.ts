import { neighbors, tiles } from '../tile-games/tiles';

export const width = 8;
const height = 7;
const length = width * height;
type Cell = number | null;

export function newBoard(): Cell[] {
  const board = Array<Cell>(length).fill(null);

  // Add pairs from the bottom up. Each can be removed in reverse order,
  // while the bottom row keeps columns in place until the last stage.
  function addPair(first: number, second: number): void {
    const excluded = [first, second].flatMap((index) =>
      neighbors(index, width, length).map((next) => board[next]),
    );
    const colors = tiles.map((_, color) => color).filter((color) => !excluded.includes(color));
    board[first] = board[second] = colors[Math.floor(Math.random() * colors.length)];
  }

  for (let index = length - width; index < length; index += 2) {
    addPair(index, index + 1);
  }
  for (let row = height - 2; row > 0; row -= 2) {
    for (let column = 0; column < width; column += 2) {
      const bottom = row * width + column;
      const top = bottom - width;
      if (Math.random() < 0.5) {
        addPair(bottom, bottom + 1);
        addPair(top, top + 1);
      } else {
        addPair(bottom, top);
        addPair(bottom + 1, top + 1);
      }
    }
  }
  return board;
}

export function clusterAt(board: readonly Cell[], index: number): Set<number> {
  const color = board[index];
  if (color == null) return new Set();
  const group = new Set([index]);
  for (const cell of group) {
    for (const next of neighbors(cell, width, length)) {
      if (board[next] === color) group.add(next);
    }
  }
  return group;
}

export function removeCluster(board: readonly Cell[], cluster: ReadonlySet<number>): Cell[] {
  const compacted = Array<Cell>(length).fill(null);
  let targetColumn = 0;
  for (let column = 0; column < width; column++) {
    let row = height - 1;
    for (let index = length - width + column; index >= 0; index -= width) {
      if (board[index] === null || cluster.has(index)) continue;
      compacted[row * width + targetColumn] = board[index];
      row--;
    }
    if (row < height - 1) targetColumn++;
  }
  return compacted;
}

export function hasCluster(board: readonly Cell[]): boolean {
  return board.some((color, index) => color !== null &&
    neighbors(index, width, length).some((next) => board[next] === color),
  );
}
