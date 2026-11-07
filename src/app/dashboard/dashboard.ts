import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <main class="dashboard">
      <h1>Classic Games</h1>
      <nav aria-label="Games">
        <a routerLink="/tic-tac-toe">Tic-Tac-Toe</a>
        <a routerLink="/tetris">Tetris</a>
        <a routerLink="/racing">Racing</a>
        <a routerLink="/snake">Snake</a>
        <a routerLink="/arkanoid">Arkanoid</a>
        <a routerLink="/match-3">Match-3</a>
        <a routerLink="/removals">Removals</a>
        <a routerLink="/dots">Dots</a>
        <a routerLink="/connect-four">Connect Four</a>
      </nav>
    </main>
  `,
  styleUrl: './dashboard.css',
})
export class Dashboard {}
