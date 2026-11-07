import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Classic Games',
    loadComponent: () => import('./dashboard/dashboard').then((module) => module.Dashboard),
  },
  { path: '**', redirectTo: '' },
];
