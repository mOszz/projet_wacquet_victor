import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisteredUser } from '../models/user.model';
import { mockError, mockResponse } from './mock-http';

// In-memory "users" table of the fake backend (emptied on page reload).
const users: RegisteredUser[] = [];
let nextId = 1;

/** Fake `/users` endpoint: only sign-up (POST) is supported. */
export function handleUsers(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> | null {
  if (req.method !== 'POST') {
    return null;
  }

  const body = req.body as Omit<RegisteredUser, 'id'>;

  // Like a real API: login and e-mail must be unique.
  if (users.some((u) => u.login === body.login || u.email === body.email)) {
    return mockError(409, 'Cet identifiant ou cet e-mail est déjà utilisé.');
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
  return mockResponse(created, 201);
}
