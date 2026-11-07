import { Component, computed, signal } from '@angular/core';
import { GamePage } from '../game-page/game-page';
import { corners, cornersPerSide, DotsGame } from './dots-game';

@Component({
  selector: 'app-dots',
  imports: [GamePage],
  templateUrl: './dots.html',
  styleUrl: './dots.css',
})
export class Dots {
  private game = new DotsGame();
  protected readonly state = signal(this.game.snapshot());
  protected readonly corners = corners;
  protected readonly axes = Array.from({ length: cornersPerSide }, (_, index) => index);
  protected readonly last = cornersPerSide - 1;

  protected readonly status = computed(() => {
    const { turn, finished, blue, red } = this.state();
    if (!finished) return `${turn}'s turn`;
    if (blue === red) return 'Draw';
    return blue > red ? 'Blue wins!' : 'Red wins!';
  });

  protected label(index: number): string {
    const { x, y } = corners[index];
    const dot = this.state().dots[index];
    const owner = this.state().captured[index];
    const detail = owner ? `${dot}, captured by ${owner}` : dot ?? 'empty';
    return `Row ${y + 1}, column ${x + 1}, ${detail}`;
  }

  protected play(index: number): void {
    if (this.game.play(index)) this.state.set(this.game.snapshot());
  }

  protected restart(): void {
    this.game = new DotsGame();
    this.state.set(this.game.snapshot());
  }
}
