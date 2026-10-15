import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, TimeoutError, catchError, map, throwError, timeout } from 'rxjs';
import { buildApiUrl } from '../core/api-url';
import { ApiErrorBody, RegisteredUser, SignUpRequest, User } from '../models/user.model';
import { SignUpError } from './sign-up-error';

/** Above this delay the request is aborted and reported as a timeout. */
export const SIGN_UP_TIMEOUT_MS = 10_000;

/**
 * Wraps the HTTP calls related to user accounts.
 * The base URL comes from `environment.apiUrl`; whether a real server or the
 * mock API answers is decided in app.config.ts, so this class never changes.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = buildApiUrl('users');

  signUp(user: User): Observable<RegisteredUser> {
    return this.http.post<unknown>(this.usersUrl, toSignUpRequest(user)).pipe(
      timeout({ first: SIGN_UP_TIMEOUT_MS }),
      // Never trust the payload blindly: a malformed body would otherwise crash the view.
      map((body) => {
        if (!isRegisteredUser(body)) {
          throw new SignUpError('unexpected', 'Réponse du serveur inattendue.');
        }
        return body;
      }),
      catchError((error: unknown) => throwError(() => toSignUpError(error))),
    );
  }
}

/** Builds the API payload: drops the confirmation and normalises user input. */
function toSignUpRequest(user: User): SignUpRequest {
  return {
    login: user.login.trim(),
    password: user.password, // passwords are sent as typed, spaces included
    lastName: user.lastName.trim(),
    firstName: user.firstName.trim(),
    email: user.email.trim().toLowerCase(),
  };
}

function isRegisteredUser(value: unknown): value is RegisteredUser {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['id'] === 'number' &&
    ['login', 'lastName', 'firstName', 'email', 'createdAt'].every(
      (key) => typeof candidate[key] === 'string',
    )
  );
}

function hasApiMessage(body: unknown): body is ApiErrorBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as Record<string, unknown>)['message'] === 'string'
  );
}

/** Maps any failure (HTTP, timeout, parsing) to a SignUpError with a message fit for display. */
function toSignUpError(error: unknown): SignUpError {
  if (error instanceof SignUpError) {
    return error;
  }
  if (error instanceof TimeoutError) {
    return new SignUpError('timeout', 'Le serveur met trop de temps à répondre. Réessayez.');
  }
  if (!(error instanceof HttpErrorResponse)) {
    return new SignUpError('unexpected', 'Une erreur inattendue est survenue.');
  }

  // Server-provided messages are only shown for client errors, where they describe the input.
  const apiMessage = hasApiMessage(error.error) ? error.error.message : null;
  switch (true) {
    case error.status === 0:
      return new SignUpError(
        'network',
        'Impossible de joindre le serveur. Vérifiez votre connexion.',
      );
    case error.status === 409:
      return new SignUpError('conflict', apiMessage ?? 'Ce compte existe déjà.');
    case error.status === 400 || error.status === 422:
      return new SignUpError('invalid', apiMessage ?? 'Les informations saisies sont invalides.');
    case error.status >= 500:
      return new SignUpError('server', 'Le serveur a rencontré une erreur. Réessayez plus tard.');
    default:
      return new SignUpError('unexpected', 'Une erreur inattendue est survenue.');
  }
}
