import { Component, input, output } from '@angular/core';
import { Phase } from './arcade-loop';

@Component({
  selector: 'app-arcade-controls',
  host: { '(document:keydown)': 'onKey($event)' },
  template: `
    <p class="stats"><span>Score {{ score() }}</span><span role="status">{{ labels[phase()] }}</span></p>
    <ng-content />
    <div class="controls" role="group" aria-label="Game controls">
      <button type="button" (click)="start.emit()">{{ phase() === 'ready' ? 'Start' : 'Restart' }}</button>
      <button type="button" [disabled]="phase() !== 'playing' && phase() !== 'paused'" (click)="pause.emit()">
        {{ phase() === 'paused' ? 'Resume' : 'Pause' }}
      </button>
    </div>
    <div class="controls" role="group" aria-label="Movement controls">
      @for (label of actions(); track label) {
        <button type="button" [disabled]="phase() !== 'playing'" (click)="move.emit(label)">{{ label }}</button>
      }
    </div>
    <p class="instructions">{{ instructions() }}</p>
  `,
  styles: `
    .stats, .controls {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .stats { gap: 1rem; margin: 0.75rem 0; font-variant-numeric: tabular-nums; }
    .controls { margin-top: 0.5rem; }
    button { min-height: 2.75rem; padding: 0 0.75rem; touch-action: manipulation; }
    button:disabled { opacity: 0.55; }
    .instructions { color: var(--muted); line-height: 1.5; }
  `,
})
export class ArcadeControls {
  readonly phase = input.required<Phase>();
  readonly score = input.required<number>();
  readonly actions = input.required<readonly string[]>();
  readonly instructions = input.required<string>();
  readonly start = output();
  readonly pause = output();
  readonly move = output<string>();

  protected readonly labels: Record<Phase, string> = {
    ready: 'Ready',
    playing: 'Playing',
    paused: 'Paused',
    'game-over': 'Game over',
    won: 'You win',
  };

  protected onKey(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    const phase = this.phase();
    if (event.code === 'KeyP' && (phase === 'playing' || phase === 'paused')) {
      event.preventDefault();
      if (!event.repeat) this.pause.emit();
      return;
    }

    const action = event.code.startsWith('Arrow') ? event.code.slice(5) : '';
    if (phase !== 'playing' || !this.actions().includes(action)) return;
    event.preventDefault();
    this.move.emit(action);
  }
}
