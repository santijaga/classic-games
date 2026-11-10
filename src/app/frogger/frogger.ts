import { Component, signal } from '@angular/core';
import { ArcadeControls } from '../arcade/arcade-controls';
import { ArcadeLoop } from '../arcade/arcade-loop';
import { GamePage } from '../game-page/game-page';
import { actions, FroggerGame, homes, homeWidth, size, type Result } from './frogger-game';

const tickMs = 25;

@Component({
  selector: 'app-frogger',
  imports: [GamePage, ArcadeControls],
  templateUrl: './frogger.html',
  styleUrl: './frogger.css',
})
export class Frogger {
  private game = new FroggerGame();
  protected readonly view = signal(this.game.snapshot());
  protected readonly loop = new ArcadeLoop();
  protected readonly homes = homes;
  protected readonly homeWidth = homeWidth;
  protected readonly size = size;
  protected readonly viewBox = `0 0 ${size} ${size}`;
  protected readonly actions = actions;

  protected start(): void {
    this.game = new FroggerGame();
    this.view.set(this.game.snapshot());
    this.loop.start(() => this.refresh(this.game.step(tickMs / 1000)), tickMs);
  }

  protected move(action: string): void {
    const direction = actions.find((name) => name === action);
    if (direction && this.loop.phase() === 'playing') this.refresh(this.game.move(direction));
  }

  private refresh(result: Result): void {
    this.view.set(this.game.snapshot());
    if (result) this.loop.finish(result);
  }
}
