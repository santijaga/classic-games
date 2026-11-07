import { neighbors } from '../tile-games/tiles';

export const width = 8;
const length = width * width;
const colorCount = 6;

function randomColor(): number {
  return Math.floor(Math.random() * colorCount);
}

export function swap(board: number[], first: number, second: number): void {
  [board[first], board[second]] = [board[second], board[first]];
}

function matches(board: readonly number[]): Set<number> {
  const found = new Set<number>();
  for (let index = 0; index < length; index++) {
    const color = board[index];
    if (index % width < width - 2 && color === board[index + 1] && color === board[index + 2]) {
      found.add(index).add(index + 1).add(index + 2);
    }
    if (index + 2 * width < length && color === board[index + width] && color === board[index + 2 * width]) {
      found.add(index).add(index + width).add(index + 2 * width);
    }
  }
  return found;
}

function hasMove(board: number[]): boolean {
  for (let index = 0; index < length; index++) {
    for (const next of neighbors(index, width, length)) {
      if (next <= index || board[index] === board[next]) continue;
      swap(board, index, next);
      const valid = matches(board).size > 0;
      swap(board, index, next);
      if (valid) return true;
    }
  }
  return false;
}

export function newBoard(): number[] {
  const board: number[] = [];
  do {
    for (let index = 0; index < length; index++) {
      const excluded: number[] = [];
      if (index % width >= 2 && board[index - 1] === board[index - 2]) {
        excluded.push(board[index - 1]);
      }
      if (index >= 2 * width && board[index - width] === board[index - 2 * width]) {
        excluded.push(board[index - width]);
      }
      const colors = Array.from({ length: colorCount }, (_, color) => color)
        .filter((color) => !excluded.includes(color));
      board[index] = colors[Math.floor(Math.random() * colors.length)];
    }
  } while (!hasMove(board));
  return board;
}

export function resolveSwap(board: readonly number[], first: number, second: number) {
  if (!neighbors(first, width, length).includes(second)) return;
  const next = [...board];
  swap(next, first, second);
  let cleared = matches(next);
  if (!cleared.size) return;

  let count = 0;
  while (cleared.size) {
    count += cleared.size;
    for (let column = 0; column < width; column++) {
      let target = length - width + column;
      for (let index = target; index >= 0; index -= width) {
        if (cleared.has(index)) continue;
        next[target] = next[index];
        target -= width;
      }
      for (; target >= 0; target -= width) next[target] = randomColor();
    }
    cleared = matches(next);
  }

  const refreshed = !hasMove(next);
  return { board: refreshed ? newBoard() : next, count, refreshed };
}
