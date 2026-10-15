import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { buildApiUrl } from '../core/api-url';
import { RegisteredUser, SignUpRequest } from '../models/user.model';
import { MOCK_API_LATENCY_MS, mockApiInterceptor } from './mock-api.interceptor';

const REQUEST: SignUpRequest = {
  login: 'victor',
  password: 'motdepasse',
  lastName: 'Wacquet',
  firstName: 'Victor',
  email: 'victor@example.com',
};

describe('mockApiInterceptor', () => {
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockApiInterceptor])),
        provideHttpClientTesting(),
        { provide: MOCK_API_LATENCY_MS, useValue: 0 },
      ],
    });
    http = TestBed.inject(HttpClient);
  });

  const post = (body: unknown) =>
    firstValueFrom(http.post<RegisteredUser>(buildApiUrl('users'), body));

  const postError = (body: unknown) =>
    post(body).then(
      () => {
        throw new Error('expected an error');
      },
      (error: HttpErrorResponse) => error,
    );

  it('should create a user without echoing the password', async () => {
    const created = await post(REQUEST);
    expect(created).toMatchObject({ login: 'victor', email: 'victor@example.com' });
    expect(typeof created.id).toBe('number');
    expect(created).not.toHaveProperty('password');
  });

  it('should answer 409 when the login is taken, case-insensitively', async () => {
    await post(REQUEST);
    const error = await postError({ ...REQUEST, login: 'VICTOR', email: 'other@example.com' });
    expect(error.status).toBe(409);
    expect(error.error.field).toBe('login');
  });

  it('should answer 409 for the seeded demo account e-mail', async () => {
    const error = await postError({ ...REQUEST, email: 'demo@pollution-tracker.fr' });
    expect(error.status).toBe(409);
    expect(error.error.field).toBe('email');
  });

  it('should answer 400 on invalid payloads', async () => {
    expect((await postError({ ...REQUEST, password: 'court' })).status).toBe(400);
    expect((await postError({ ...REQUEST, email: 'pas-un-mail' })).status).toBe(400);
    expect((await postError(null)).status).toBe(400);
  });

  it('should let unknown requests through to the real backend', () => {
    const controller = TestBed.inject(HttpTestingController);
    http.get(buildApiUrl('pollutions')).subscribe();
    controller.expectOne(buildApiUrl('pollutions')).flush([]);
    controller.verify();
  });
});
