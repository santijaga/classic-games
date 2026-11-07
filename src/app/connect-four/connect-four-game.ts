export const columns = 7;
export const rows = 6;

export type Player = 'Red' | 'Yellow';
type Cell = Player | null;
export type Board = Cell[][];

export function newBoard(): Board {
  return Array.from({ length: columns }, () => Array<Cell>(rows).fill(null));
}

const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

export function drop(board: Board, column: number, player: Player) {
  const row = board[column]?.lastIndexOf(null) ?? -1;
  if (row < 0) return;

  const next = board.map((cells, x) =>
    x === column ? cells.map((cell, y) => y === row ? player : cell) : cells,
  );
  const winning: number[] = [];

  for (const [dx, dy] of directions) {
    const line = [column * rows + row];
    for (const direction of [-1, 1]) {
      let x = column + dx * direction;
      let y = row + dy * direction;
      while (next[x]?.[y] === player) {
        line.push(x * rows + y);
        x += dx * direction;
        y += dy * direction;
      }
    }
    if (line.length >= 4) winning.push(...line);
  }

  return { board: next, winning };
}
