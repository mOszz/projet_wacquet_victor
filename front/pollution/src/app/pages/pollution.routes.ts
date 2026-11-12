import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guards';

/**
 * "Pollutions" feature, lazy-loaded as a whole by app.routes.ts (`loadChildren`),
 * then each page is lazy-loaded on its own (`loadComponent`).
 * Reading is public; declaring and editing require to be logged in.
 */
export const POLLUTION_ROUTES: Routes = [
  {
    path: '',
    title: 'Pollutions · Pollution Tracker',
    loadComponent: () => import('./pollution-list/pollution-list').then((m) => m.PollutionList),
  },
  {
    // Declared before ':id', otherwise "new" would be read as an id.
    path: 'new',
    title: 'Déclarer une pollution · Pollution Tracker',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pollution-create/pollution-create').then((m) => m.PollutionCreate),
  },
  {
    path: ':id',
    title: 'Détail · Pollution Tracker',
    loadComponent: () =>
      import('./pollution-detail/pollution-detail').then((m) => m.PollutionDetail),
  },
  {
    path: ':id/edit',
    title: 'Modifier · Pollution Tracker',
    canActivate: [authGuard],
    loadComponent: () => import('./pollution-edit/pollution-edit').then((m) => m.PollutionEdit),
  },
];
