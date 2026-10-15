import { Injectable } from '@angular/core';
import { RegisteredUser, SignUpRequest } from '../models/user.model';
import { MOCK_EXISTING_USERS } from './mock-data';

/**
 * In-memory "database" behind the mock API. Data is lost on page reload.
 * It starts with the fictitious accounts of mock-data.ts.
 */
@Injectable({ providedIn: 'root' })
export class MockUserStore {
  private readonly users: RegisteredUser[] = MOCK_EXISTING_USERS.map((user) => ({ ...user }));

  /** Returns the name of the field already taken, if any (comparison is case-insensitive). */
  findConflict(request: SignUpRequest): 'login' | 'email' | null {
    const login = request.login.toLowerCase();
    const email = request.email.toLowerCase();
    if (this.users.some((u) => u.login.toLowerCase() === login)) {
      return 'login';
    }
    if (this.users.some((u) => u.email.toLowerCase() === email)) {
      return 'email';
    }
    return null;
  }

  create(request: SignUpRequest): RegisteredUser {
    // The password is deliberately not stored, as a real API would hash it.
    const user: RegisteredUser = {
      id: Math.max(0, ...this.users.map((u) => u.id)) + 1,
      login: request.login,
      lastName: request.lastName,
      firstName: request.firstName,
      email: request.email,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    return { ...user };
  }
}
