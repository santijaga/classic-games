import { Component, computed, signal } from '@angular/core';
import { GamePage } from '../game-page/game-page';
import { tileLabel, tiles } from '../tile-games/tiles';
import { clusterAt, hasCluster, newBoard, removeCluster, width } from './removals-game';

@Component({
  selector: 'app-removals',
  imports: [GamePage],
  templateUrl: './removals.html',
  styleUrl: '../tile-games/tiles.css',
})
export class Removals {
  private initialBoard = newBoard();
  protected readonly board = signal(this.initialBoard);
  protected readonly remaining = computed(() => this.board().filter((color) => color !== null).length);
  protected readonly finished = computed(() => !hasCluster(this.board()));
  protected readonly status = signal('Select a group.');
  protected readonly tiles = tiles;

  protected label(index: number, color: number): string {
    return tileLabel(index, width, color);
  }

  protected remove(index: number): void {
    if (this.finished()) return;
    const cluster = clusterAt(this.board(), index);
    if (cluster.size < 2) {
      this.status.set('Choose a group of at least two.');
      return;
    }

    this.board.set(removeCluster(this.board(), cluster));
    if (this.remaining() === 0) this.status.set('Board cleared!');
    else if (this.finished()) this.status.set('No groups left. Try again.');
    else this.status.set(`Removed ${cluster.size} tiles.`);
  }

  protected retry(): void {
    this.board.set(this.initialBoard);
    this.status.set('Select a group.');
  }

  protected startNew(): void {
    this.initialBoard = newBoard();
    this.retry();
  }
}
