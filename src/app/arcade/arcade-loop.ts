import { DestroyRef, inject, signal } from '@angular/core';

export type Phase = 'ready' | 'playing' | 'paused' | 'game-over' | 'won';

export class ArcadeLoop {
  private readonly state = signal<Phase>('ready');
  readonly phase = this.state.asReadonly();
  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  start(step: () => void, interval: number): void {
    clearInterval(this.timer);
    this.state.set('playing');
    this.timer = setInterval(() => {
      if (this.phase() === 'playing') step();
    }, interval);
  }

  togglePause(): void {
    if (this.phase() === 'playing') this.state.set('paused');
    else if (this.phase() === 'paused') this.state.set('playing');
  }

  finish(result: 'game-over' | 'won'): void {
    clearInterval(this.timer);
    this.state.set(result);
  }
}
