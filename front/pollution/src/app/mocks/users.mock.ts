import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisteredUser } from '../models/user.model';
import { mockError, mockResponse } from './mock-http';

// In-memory "users" table of the fake backend (emptied on page reload).
const users: RegisteredUser[] = [];
// Fake backend only: passwords kept in clear, by login, to let the mock check logins.
const passwords = new Map<string, string>();
let nextId = 1;

/** Fake `/users` endpoint: list (GET) and sign-up (POST). */
export function handleUsers(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> | null {
  if (req.method === 'GET') {
    return mockResponse(structuredClone(users));
  }
  if (req.method !== 'POST') {
    return null;
  }

  const body = req.body as Omit<RegisteredUser, 'id'> & { password: string };

  // Like a real API: login and e-mail must be unique.
  if (users.some((u) => u.login === body.login || u.email === body.email)) {
    return mockError(409, 'Cet identifiant ou cet e-mail est déjà utilisé.');
  }

  // Only the public fields are returned, never the password.
  const created: RegisteredUser = {
    id: nextId++,
    login: body.login,
    lastName: body.lastName,
    firstName: body.firstName,
    email: body.email,
  };
  users.push(created);
  passwords.set(created.login, body.password);
  return mockResponse(created, 201);
}

/** Fake `POST /login`: returns the user when login and password match, 401 otherwise. */
export function handleLogin(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> | null {
  if (req.method !== 'POST') {
    return null;
  }
  const { login, password } = req.body as { login: string; password: string };
  const user = users.find((u) => u.login === login);
  return user && passwords.get(login) === password
    ? mockResponse(structuredClone(user))
    : mockError(401, 'Identifiant ou mot de passe incorrect.');
}
