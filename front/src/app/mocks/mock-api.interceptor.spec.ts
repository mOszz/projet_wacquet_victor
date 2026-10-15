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
import { RegisteredUser } from '../models/user.model';
import { JOHN_DOE_REQUEST } from '../testing/user.fixtures';
import { MOCK_API_LATENCY_MS, mockApiInterceptor } from './mock-api.interceptor';
import { MOCK_EXISTING_USERS } from './mock-data';

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
    const created = await post(JOHN_DOE_REQUEST);
    expect(created).toMatchObject({ login: JOHN_DOE_REQUEST.login, email: JOHN_DOE_REQUEST.email });
    expect(typeof created.id).toBe('number');
    expect(created).not.toHaveProperty('password');
  });

  it('should answer 409 when the login is taken, case-insensitively', async () => {
    await post(JOHN_DOE_REQUEST);
    const error = await postError({
      ...JOHN_DOE_REQUEST,
      login: JOHN_DOE_REQUEST.login.toUpperCase(),
      email: 'another.address@example.com',
    });
    expect(error.status).toBe(409);
    expect(error.error.field).toBe('login');
  });

  it('should answer 409 for the e-mail of an account that already exists', async () => {
    const error = await postError({ ...JOHN_DOE_REQUEST, email: MOCK_EXISTING_USERS[0].email });
    expect(error.status).toBe(409);
    expect(error.error.field).toBe('email');
  });

  it('should answer 400 on invalid payloads', async () => {
    expect((await postError({ ...JOHN_DOE_REQUEST, password: 'short' })).status).toBe(400);
    expect((await postError({ ...JOHN_DOE_REQUEST, email: 'not-an-email' })).status).toBe(400);
    expect((await postError(null)).status).toBe(400);
  });

  it('should let unknown requests through to the real backend', () => {
    const controller = TestBed.inject(HttpTestingController);
    http.get(buildApiUrl('pollutions')).subscribe();
    controller.expectOne(buildApiUrl('pollutions')).flush([]);
    controller.verify();
  });
});
