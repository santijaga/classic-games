import { Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GamePage } from '../game-page/game-page';
import { TetrisGame } from './tetris-game';

type Action = 'left' | 'right' | 'rotate' | 'down' | 'drop' | 'pause';

const keyActions: Readonly<Partial<Record<string, Action>>> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'rotate',
  ArrowDown: 'down',
  Space: 'drop',
  KeyP: 'pause',
};

@Component({
  selector: 'app-tetris',
  imports: [GamePage],
  templateUrl: './tetris.html',
  styleUrl: './tetris.css',
  host: { '(document:keydown)': 'onKey($event)' },
})
export class Tetris {
  private readonly game = new TetrisGame();
  private readonly board = viewChild.required<ElementRef<HTMLElement>>('board');
  private timer?: ReturnType<typeof setInterval>;

  protected readonly view = signal(this.game.snapshot());

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  protected start(): void {
    clearInterval(this.timer);
    this.game.start();
    this.refresh();
    this.timer = setInterval(() => {
      if (this.game.phase === 'playing') this.act('down');
    }, 650);
    this.board().nativeElement.focus({ preventScroll: true });
  }

  protected act(action: Action): void {
    switch (action) {
      case 'left': this.game.move(-1); break;
      case 'right': this.game.move(1); break;
      case 'rotate': this.game.rotate(); break;
      case 'down': this.game.step(); break;
      case 'drop': this.game.drop(); break;
      case 'pause': this.game.togglePause(); break;
    }

    this.refresh();
    if (this.game.phase === 'game-over') clearInterval(this.timer);
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const action = keyActions[event.code];
    if (!action || (action === 'drop' && event.target instanceof HTMLButtonElement)) return;

    const phase = this.game.phase;
    if (phase !== 'playing' && !(phase === 'paused' && action === 'pause')) return;
    event.preventDefault();
    if (event.repeat && (action === 'pause' || action === 'drop')) return;
    this.act(action);
  }

  private refresh(): void {
    this.view.set(this.game.snapshot());
  }
}
