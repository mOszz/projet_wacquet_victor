import { Routes } from '@angular/router';

// Pages are lazy-loaded: each one is downloaded only when first visited.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pollutions' },
  {
    path: 'pollutions',
    title: 'Pollutions · Pollution Tracker',
    loadComponent: () =>
      import('./pages/pollution-list/pollution-list').then((m) => m.PollutionList),
  },
  {
    // Declared before ':id', otherwise "new" would be read as an id.
    path: 'pollutions/new',
    title: 'Déclarer une pollution · Pollution Tracker',
    loadComponent: () =>
      import('./pages/pollution-create/pollution-create').then((m) => m.PollutionCreate),
  },
  {
    path: 'pollutions/:id',
    title: 'Détail · Pollution Tracker',
    loadComponent: () =>
      import('./pages/pollution-detail/pollution-detail').then((m) => m.PollutionDetail),
  },
  {
    path: 'pollutions/:id/edit',
    title: 'Modifier · Pollution Tracker',
    loadComponent: () =>
      import('./pages/pollution-edit/pollution-edit').then((m) => m.PollutionEdit),
  },
  {
    path: 'register',
    title: 'Créer un compte · Pollution Tracker',
    loadComponent: () =>
      import('./components/register-form/register-form').then((m) => m.RegisterForm),
  },
  { path: '**', redirectTo: 'pollutions' },
];
