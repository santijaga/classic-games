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
  { path: '**', redirectTo: '' },
];
