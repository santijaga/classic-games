import { Component, signal } from '@angular/core';
import { ArcadeControls } from '../arcade/arcade-controls';
import { ArcadeLoop } from '../arcade/arcade-loop';
import { GamePage } from '../game-page/game-page';

const playerY = 84;
const carHeight = 10;
const carWidth = 14;

interface Obstacle {
  id: number;
  lane: number;
  y: number;
}

@Component({
  selector: 'app-racing',
  imports: [GamePage, ArcadeControls],
  templateUrl: './racing.html',
  styles: `
    svg {
      display: block;
      width: min(100%, clamp(10rem, 32dvh, 18rem));
      height: auto;
      margin-inline: auto;
      border: 1px solid var(--border);
      background: var(--surface);
    }
    .divider { stroke: #93938c; stroke-width: 0.5; stroke-dasharray: 4 3; }
    .player { fill: #1459a1; }
    .obstacle { fill: #a43c3c; }
    .lanes { display: flex; justify-content: center; gap: 0.5rem; }
    .lanes button { min-height: 2.75rem; padding: 0 0.75rem; }
    .lanes button[aria-pressed='true'] { background: var(--hover); font-weight: 600; }
  `,
})
export class Racing {
  protected readonly loop = new ArcadeLoop();
  protected readonly laneCount = signal<2 | 3>(2);
  protected readonly lane = signal(0);
  protected readonly obstacles = signal<Obstacle[]>([]);
  protected readonly score = signal(0);
  protected readonly playerY = playerY;
  protected readonly carHeight = carHeight;
  protected readonly carWidth = carWidth;
  protected readonly actions = ['Left', 'Right'];
  private ticksUntilSpawn = 0;
  private nextId = 0;

  protected selectLanes(count: 2 | 3): void {
    if (this.laneCount() === count) return;
    this.laneCount.set(count);
    if (this.loop.phase() === 'ready') this.lane.set(0);
    else this.start();
  }

  protected start(): void {
    this.lane.set(0);
    this.score.set(0);
    this.obstacles.set([]);
    this.ticksUntilSpawn = 0;
    this.loop.start(() => this.step(), 25);
  }

  protected move(direction: string): void {
    const next = this.lane() + (direction === 'Left' ? -1 : 1);
    this.lane.set(Math.max(0, Math.min(this.laneCount() - 1, next)));
  }

  protected carX(lane: number): number {
    return ((lane + 0.5) * 100) / this.laneCount() - carWidth / 2;
  }

  private step(): void {
    const speed = 0.85 + Math.min(this.score() * 0.05, 0.9);
    const moved = this.obstacles().map((car) => ({ ...car, y: car.y + speed }));
    if (this.ticksUntilSpawn === 0) {
      moved.push({ id: this.nextId++, lane: Math.floor(Math.random() * this.laneCount()), y: -carHeight });
      this.ticksUntilSpawn = Math.ceil(42 / speed);
    }
    this.ticksUntilSpawn--;

    const onRoad = moved.filter((car) => car.y < 100);
    this.obstacles.set(onRoad);
    this.score.update((score) => score + moved.length - onRoad.length);

    if (onRoad.some((car) => car.lane === this.lane() && car.y + carHeight > playerY && car.y < playerY + carHeight)) {
      this.loop.finish('game-over');
    }
  }
}
