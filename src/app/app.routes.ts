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
  { path: '**', redirectTo: '' },
];
