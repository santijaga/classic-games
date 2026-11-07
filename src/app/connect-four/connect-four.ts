import { Component, computed, signal } from '@angular/core';
import { GamePage } from '../game-page/game-page';
import { drop, newBoard, rows, type Player } from './connect-four-game';

@Component({
  selector: 'app-connect-four',
  imports: [GamePage],
  templateUrl: './connect-four.html',
  styleUrl: './connect-four.css',
})
export class ConnectFour {
  protected readonly board = signal(newBoard());
  protected readonly turn = signal<Player>('Red');
  protected readonly winning = signal<number[]>([]);
  protected readonly rows = rows;
  protected readonly full = computed(() => this.board().every((column) => column[0] !== null));
  protected readonly finished = computed(() => this.winning().length > 0 || this.full());

  protected readonly status = computed(() => {
    if (this.winning().length) return `${this.turn()} wins!`;
    if (this.full()) return 'Draw';
    return `${this.turn()}'s turn`;
  });

  protected columnLabel(index: number): string {
    const discs = this.board()[index].filter(Boolean).reverse().join(', ');
    return `Column ${index + 1}: ${discs ? `${discs} from bottom` : 'empty'}`;
  }

  protected play(column: number): void {
    if (this.finished()) return;
    const result = drop(this.board(), column, this.turn());
    if (!result) return;

    this.board.set(result.board);
    this.winning.set(result.winning);
    if (!this.finished()) this.turn.update((player) => player === 'Red' ? 'Yellow' : 'Red');
  }

  protected restart(): void {
    this.board.set(newBoard());
    this.turn.set('Red');
    this.winning.set([]);
  }
}
