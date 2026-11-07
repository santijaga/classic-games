import { Component, signal } from '@angular/core';
import { ArcadeControls } from '../arcade/arcade-controls';
import { ArcadeLoop } from '../arcade/arcade-loop';
import { GamePage } from '../game-page/game-page';

const size = 18;
const directions = {
  Up: { x: 0, y: -1 },
  Left: { x: -1, y: 0 },
  Down: { x: 0, y: 1 },
  Right: { x: 1, y: 0 },
};
type Direction = keyof typeof directions;
type Point = { x: number; y: number };

function initialSnake(): Point[] {
  return [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
}

function sameCell(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

@Component({
  selector: 'app-snake',
  imports: [GamePage, ArcadeControls],
  templateUrl: './snake.html',
  styles: `
    svg {
      display: block;
      width: min(100%, 22rem);
      height: auto;
      margin-inline: auto;
      border: 1px solid var(--border);
      background: var(--surface);
    }
    .segment { fill: #3e8051; }
    .head { fill: #245937; }
    .food { fill: #a43c3c; }
  `,
})
export class Snake {
  protected readonly loop = new ArcadeLoop();
  protected readonly body = signal(initialSnake());
  protected readonly food = signal<Point | undefined>({ x: 13, y: 9 });
  protected readonly score = signal(0);
  protected readonly viewBox = `0 0 ${size} ${size}`;
  protected readonly actions = Object.keys(directions);
  private direction: Direction = 'Right';
  private nextDirection?: Direction;

  protected start(): void {
    this.body.set(initialSnake());
    this.score.set(0);
    this.direction = 'Right';
    this.nextDirection = undefined;
    this.placeFood();
    this.loop.start(() => this.step(), 140);
  }

  protected turn(action: string): void {
    if (this.nextDirection || action === this.direction) return;
    const direction = action as Direction;
    const next = directions[direction];
    const current = directions[this.direction];
    if (next.x + current.x !== 0 || next.y + current.y !== 0) this.nextDirection = direction;
  }

  private step(): void {
    this.direction = this.nextDirection ?? this.direction;
    this.nextDirection = undefined;
    const [head, ...rest] = this.body();
    const delta = directions[this.direction];
    const next = { x: head.x + delta.x, y: head.y + delta.y };
    const food = this.food();
    const eating = food !== undefined && sameCell(next, food);

    // A move into the tail is legal when the tail moves away on the same tick.
    if (!eating) rest.pop();
    const remaining = [head, ...rest];
    const outside = next.x < 0 || next.x >= size || next.y < 0 || next.y >= size;
    if (outside || remaining.some((segment) => sameCell(segment, next))) {
      this.loop.finish('game-over');
      return;
    }

    this.body.set([next, ...remaining]);
    if (eating) {
      this.score.update((score) => score + 1);
      this.placeFood();
      if (!this.food()) this.loop.finish('won');
    }
  }

  private placeFood(): void {
    const occupied = new Set(this.body().map(({ x, y }) => y * size + x));
    const open = Array.from({ length: size * size }, (_, index) => index)
      .filter((index) => !occupied.has(index));
    const index = open[Math.floor(Math.random() * open.length)];
    this.food.set(index === undefined ? undefined : { x: index % size, y: Math.floor(index / size) });
  }
}
