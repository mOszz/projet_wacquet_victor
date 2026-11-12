import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RegisteredUser, User } from '../models/user.model';

/** Access to the users REST API (`{apiUrl}/users`). */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/users`;

  getAll(): Observable<RegisteredUser[]> {
    return this.http.get<RegisteredUser[]>(this.url);
  }

  create(user: User): Observable<RegisteredUser> {
    // The password confirmation is only a form check: it is not sent to the API.
    return this.http.post<RegisteredUser>(this.url, {
      login: user.login.trim(),
      password: user.password,
      lastName: user.lastName.trim(),
      firstName: user.firstName.trim(),
      email: user.email.trim().toLowerCase(),
    });
  }
}
