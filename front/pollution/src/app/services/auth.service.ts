import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisteredUser } from '../models/user.model';

const STORAGE_KEY = 'pollution-tracker.user';

/**
 * Fictitious authentication: `POST {apiUrl}/login` checks the credentials and returns
 * the user, kept in memory and in localStorage so the session survives a page reload.
 * There is no token: the API itself is not protected.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly user = signal<RegisteredUser | null>(readStoredUser());

  readonly currentUser = this.user.asReadonly();
  readonly isLoggedIn = computed(() => this.user() !== null);

  login(login: string, password: string): Observable<RegisteredUser> {
    return this.http
      .post<RegisteredUser>(`${environment.apiUrl}/login`, { login: login.trim(), password })
      .pipe(tap((user) => this.setUser(user)));
  }

  logout(): void {
    this.setUser(null);
  }

  private setUser(user: RegisteredUser | null): void {
    this.user.set(user);
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage unavailable (private mode...): the session simply won't survive a reload.
    }
  }
}

/** Session saved by a previous visit, or null if missing/unreadable. */
function readStoredUser(): RegisteredUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as RegisteredUser) : null;
  } catch {
    return null;
  }
}
