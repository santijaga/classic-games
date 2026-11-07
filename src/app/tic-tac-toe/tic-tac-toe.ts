import { Component, computed, signal } from '@angular/core';
import { GamePage } from '../game-page/game-page';

type Mark = 'X' | 'O';
type Cell = Mark | null;

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

@Component({
  selector: 'app-tic-tac-toe',
  imports: [GamePage],
  templateUrl: './tic-tac-toe.html',
  styleUrl: './tic-tac-toe.css',
})
export class TicTacToe {
  protected readonly board = signal<Cell[]>(Array(9).fill(null));
  protected readonly turn = signal<Mark>('X');

  protected readonly winningLine = computed(() => {
    const board = this.board();
    return winningLines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
  });

  protected readonly status = computed(() => {
    const line = this.winningLine();
    if (line) return `${this.board()[line[0]]} wins`;
    if (this.board().every(Boolean)) return 'Draw';
    return `${this.turn()}'s turn`;
  });

  protected play(index: number): void {
    if (this.board()[index] || this.winningLine()) return;
    this.board.update((board) => board.map((cell, i) => i === index ? this.turn() : cell));
    this.turn.update((mark) => mark === 'X' ? 'O' : 'X');
  }

  protected reset(): void {
    this.board.set(Array(9).fill(null));
    this.turn.set('X');
  }
}
