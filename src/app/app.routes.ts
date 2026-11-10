import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Classic Games',
    loadComponent: () => import('./dashboard/dashboard').then((module) => module.Dashboard),
  },
  {
    path: 'tic-tac-toe',
    title: 'Tic-Tac-Toe | Classic Games',
    loadComponent: () => import('./tic-tac-toe/tic-tac-toe').then((module) => module.TicTacToe),
  },
  {
    path: 'tetris',
    title: 'Tetris | Classic Games',
    loadComponent: () => import('./tetris/tetris').then((module) => module.Tetris),
  },
  {
    path: 'racing',
    title: 'Racing | Classic Games',
    loadComponent: () => import('./racing/racing').then((module) => module.Racing),
  },
  {
    path: 'snake',
    title: 'Snake | Classic Games',
    loadComponent: () => import('./snake/snake').then((module) => module.Snake),
  },
  {
    path: 'arkanoid',
    title: 'Arkanoid | Classic Games',
    loadComponent: () => import('./arkanoid/arkanoid').then((module) => module.Arkanoid),
  },
  {
    path: 'match-3',
    title: 'Match-3 | Classic Games',
    loadComponent: () => import('./match-3/match-3').then((module) => module.Match3),
  },
  {
    path: 'removals',
    title: 'Removals | Classic Games',
    loadComponent: () => import('./removals/removals').then((module) => module.Removals),
  },
  {
    path: 'dots',
    title: 'Dots | Classic Games',
    loadComponent: () => import('./dots/dots').then((module) => module.Dots),
  },
  {
    path: 'connect-four',
    title: 'Connect Four | Classic Games',
    loadComponent: () => import('./connect-four/connect-four').then((module) => module.ConnectFour),
  },
  {
    path: 'frogger',
    title: 'Frogger | Classic Games',
    loadComponent: () => import('./frogger/frogger').then((module) => module.Frogger),
  },
  { path: '**', redirectTo: '' },
];
