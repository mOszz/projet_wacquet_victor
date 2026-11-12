import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Pages reserved to logged-in users. A visitor is redirected to /login, with the
 * requested URL in `returnUrl` so the login page can bring them back afterwards.
 * Guards run before a lazy-loaded page is activated, so its code is not downloaded for nothing.
 */
export const authGuard: CanActivateFn = (_route, state) =>
  inject(AuthService).isLoggedIn() ||
  inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });

/** Pages for visitors only (login, sign-up): a logged-in user is sent to the list. */
export const guestGuard: CanActivateFn = () =>
  !inject(AuthService).isLoggedIn() || inject(Router).createUrlTree(['/pollutions']);
