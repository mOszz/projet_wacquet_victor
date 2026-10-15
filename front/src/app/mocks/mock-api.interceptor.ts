import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';
import { Observable, delay, mergeMap, of, throwError, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { buildApiUrl } from '../core/api-url';
import { ApiErrorBody, SignUpRequest } from '../models/user.model';
import { MockUserStore } from './mock-user-store';

/** Simulated latency; overridable (e.g. 0 in unit tests). */
export const MOCK_API_LATENCY_MS = new InjectionToken<number>('MOCK_API_LATENCY_MS', {
  providedIn: 'root',
  factory: () => environment.mockLatencyMs,
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOGIN_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 8;

/**
 * Stands in for the backend until it exists: answers the API routes it knows
 * and lets every other request through untouched. Registered in app.config.ts
 * only when `environment.useMockApi` is true.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'POST' && req.url === buildApiUrl('users')) {
    return handleSignUp(req, inject(MockUserStore), inject(MOCK_API_LATENCY_MS));
  }
  return next(req);
};

function handleSignUp(
  req: HttpRequest<unknown>,
  store: MockUserStore,
  latency: number,
): Observable<HttpEvent<unknown>> {
  // Validate server-side as a real API would: the client must not be trusted.
  const body = req.body;
  const validationError = validateSignUpRequest(body);
  if (validationError) {
    return failAfter(latency, req, 400, validationError);
  }

  const conflict = store.findConflict(body as SignUpRequest);
  if (conflict) {
    const message =
      conflict === 'login' ? 'Cet identifiant est déjà utilisé.' : 'Cet e-mail est déjà utilisé.';
    return failAfter(latency, req, 409, { message, field: conflict });
  }

  const created = store.create(body as SignUpRequest);
  return of(
    new HttpResponse({ status: 201, statusText: 'Created', url: req.url, body: created }),
  ).pipe(delay(latency));
}

function validateSignUpRequest(body: unknown): ApiErrorBody | null {
  if (typeof body !== 'object' || body === null) {
    return { message: 'Corps de requête invalide.' };
  }
  const value = body as Record<string, unknown>;
  const text = (key: string) => (typeof value[key] === 'string' ? (value[key] as string) : '');

  if (text('login').trim().length < LOGIN_MIN_LENGTH) {
    return { message: 'Identifiant invalide.', field: 'login' };
  }
  if (text('password').length < PASSWORD_MIN_LENGTH) {
    return { message: 'Mot de passe trop court.', field: 'password' };
  }
  if (!text('lastName').trim()) {
    return { message: 'Le nom est obligatoire.', field: 'lastName' };
  }
  if (!text('firstName').trim()) {
    return { message: 'Le prénom est obligatoire.', field: 'firstName' };
  }
  if (!EMAIL_PATTERN.test(text('email'))) {
    return { message: 'Adresse e-mail invalide.', field: 'email' };
  }
  return null;
}

/** Emits an HttpErrorResponse after the simulated latency, like a failed network call. */
function failAfter(
  latency: number,
  req: HttpRequest<unknown>,
  status: number,
  error: ApiErrorBody,
): Observable<never> {
  return timer(latency).pipe(
    mergeMap(() =>
      throwError(
        () =>
          new HttpErrorResponse({
            status,
            statusText: status === 409 ? 'Conflict' : 'Bad Request',
            url: req.url,
            error,
          }),
      ),
    ),
  );
}
