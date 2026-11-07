import { Component, signal } from '@angular/core';
import { ArcadeControls } from '../arcade/arcade-controls';
import { ArcadeLoop } from '../arcade/arcade-loop';
import { GamePage } from '../game-page/game-page';
import {
  ArkanoidGame,
  ballRadius,
  brickHeight,
  brickWidth,
  fieldHeight,
  fieldWidth,
  paddleHeight,
  paddleWidth,
  paddleY,
} from './arkanoid-game';

@Component({
  selector: 'app-arkanoid',
  imports: [GamePage, ArcadeControls],
  templateUrl: './arkanoid.html',
  styles: `
    svg {
      display: block;
      width: min(100%, 26rem);
      height: auto;
      margin-inline: auto;
      border: 1px solid var(--border);
      background: var(--surface);
      touch-action: none;
    }
    .paddle { fill: #1459a1; }
    .ball { fill: #20201e; }
    .lives { margin: 0.75rem 0 0; }
  `,
})
export class Arkanoid {
  private game = new ArkanoidGame();
  protected readonly loop = new ArcadeLoop();
  protected readonly view = signal(this.game.snapshot());
  protected readonly actions = ['Left', 'Right'];
  protected readonly viewBox = `0 0 ${fieldWidth} ${fieldHeight}`;
  protected readonly paddle = { y: paddleY, width: paddleWidth, height: paddleHeight };
  protected readonly brick = { width: brickWidth, height: brickHeight };
  protected readonly ballRadius = ballRadius;
  protected readonly colors = ['#a43c3c', '#a85c25', '#a17919', '#37774d', '#365f9e'];

  protected start(): void {
    this.game = new ArkanoidGame();
    this.view.set(this.game.snapshot());
    this.loop.start(() => {
      const result = this.game.step();
      this.view.set(this.game.snapshot());
      if (result) this.loop.finish(result);
    }, 16);
  }

  protected move(action: string): void {
    const offset = action === 'Left' ? -17 : 17;
    this.game.movePaddle(this.game.paddleX + paddleWidth / 2 + offset);
    this.view.set(this.game.snapshot());
  }

  protected moveTo(event: PointerEvent): void {
    if (this.loop.phase() !== 'playing' || !event.isPrimary) return;
    if (event.type === 'pointermove' && event.pointerType !== 'mouse' && !event.buttons) return;

    const field = event.currentTarget as SVGSVGElement;
    if (event.type === 'pointerdown') field.setPointerCapture(event.pointerId);
    const bounds = field.getBoundingClientRect();
    this.game.movePaddle((event.clientX - bounds.left) * fieldWidth / bounds.width);
    this.view.set(this.game.snapshot());
  }
}
