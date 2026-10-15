import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, switchMap, throwError, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisteredUser } from '../models/user.model';

/** Simulated network delay, so the loading state is visible. */
const LATENCY_MS = 500;

// In-memory "database" of the fake backend (emptied on page reload).
const users: RegisteredUser[] = [];
let nextId = 1;

/**
 * Fake backend used while there is no API: answers `POST {apiUrl}/users`
 * and lets every other request through. Enabled in app.config.ts when
 * `environment.useMockApi` is true.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'POST' || req.url !== `${environment.apiUrl}/users`) {
    return next(req);
  }

  const body = req.body as Omit<RegisteredUser, 'id'>;

  // Like a real API: login and e-mail must be unique.
  if (users.some((u) => u.login === body.login || u.email === body.email)) {
    return timer(LATENCY_MS).pipe(
      switchMap(() =>
        throwError(
          () =>
            new HttpErrorResponse({
              status: 409,
              url: req.url,
              error: { message: 'Cet identifiant ou cet e-mail est déjà utilisé.' },
            }),
        ),
      ),
    );
  }

  // Only the public fields are kept: the password is never stored nor returned.
  const created: RegisteredUser = {
    id: nextId++,
    login: body.login,
    lastName: body.lastName,
    firstName: body.firstName,
    email: body.email,
  };
  users.push(created);

  return timer(LATENCY_MS).pipe(
    switchMap(() => of(new HttpResponse({ status: 201, url: req.url, body: created }))),
  );
};
