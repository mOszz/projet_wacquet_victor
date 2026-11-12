import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guards';

// Everything is lazy-loaded: code is downloaded only when a page is first visited.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pollutions' },
  {
    path: 'pollutions',
    loadChildren: () => import('./pages/pollution.routes').then((m) => m.POLLUTION_ROUTES),
  },
  {
    path: 'users',
    title: 'Utilisateurs · Pollution Tracker',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user-list/user-list').then((m) => m.UserList),
  },
  {
    path: 'login',
    title: 'Connexion · Pollution Tracker',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    title: 'Créer un compte · Pollution Tracker',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./components/register-form/register-form').then((m) => m.RegisterForm),
  },
  { path: '**', redirectTo: 'pollutions' },
];
