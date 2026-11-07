import { Component, computed, signal } from '@angular/core';
import { GamePage } from '../game-page/game-page';
import { neighbors, tileLabel, tiles } from '../tile-games/tiles';
import { newBoard, resolveSwap, width } from './match-3-game';

@Component({
  selector: 'app-match-3',
  imports: [GamePage],
  templateUrl: './match-3.html',
  styleUrl: '../tile-games/tiles.css',
})
export class Match3 {
  protected readonly board = signal(newBoard());
  protected readonly selected = signal<number | null>(null);
  protected readonly score = signal(0);
  protected readonly moves = signal(25);
  protected readonly goal = 100;
  protected readonly finished = computed(() => this.score() >= this.goal || this.moves() === 0);
  protected readonly status = signal('Select a tile to start.');
  protected readonly tiles = tiles;

  protected label(index: number, color: number): string {
    return tileLabel(index, width, color);
  }

  protected choose(index: number): void {
    if (this.finished()) return;
    const first = this.selected();
    if (first === index) {
      this.selected.set(null);
      this.status.set('Select a tile.');
      return;
    }
    if (first === null || !neighbors(first, width, this.board().length).includes(index)) {
      this.selected.set(index);
      this.status.set('Select a neighboring tile.');
      return;
    }

    this.selected.set(null);
    const result = resolveSwap(this.board(), first, index);
    if (!result) {
      this.status.set('That swap makes no match.');
      return;
    }
    this.board.set(result.board);
    this.score.update((score) => score + result.count);
    this.moves.update((moves) => moves - 1);
    if (this.score() >= this.goal) this.status.set('You win!');
    else if (this.moves() === 0) this.status.set('Out of moves.');
    else this.status.set(result.refreshed ? 'No swaps left. New tiles added.' : `Cleared ${result.count} tiles.`);
  }

  protected restart(): void {
    this.board.set(newBoard());
    this.selected.set(null);
    this.score.set(0);
    this.moves.set(25);
    this.status.set('Select a tile to start.');
  }
}
