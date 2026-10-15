import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { buildApiUrl } from '../core/api-url';
import { RegisteredUser } from '../models/user.model';
import { JOHN_DOE_FORM, JOHN_DOE_REGISTERED, JOHN_DOE_REQUEST } from '../testing/user.fixtures';
import { AuthService } from './auth.service';
import { SignUpError } from './sign-up-error';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  /** Starts a sign-up, answers it with `respond` and returns the outcome (value or error). */
  async function signUpAndRespond(
    respond: (req: ReturnType<HttpTestingController['expectOne']>) => void,
    form = JOHN_DOE_FORM,
  ): Promise<RegisteredUser | SignUpError> {
    const result = firstValueFrom(service.signUp(form)).catch((e: SignUpError) => e);
    respond(http.expectOne(buildApiUrl('users')));
    return result;
  }

  it('should POST a normalised payload without the confirmation to the configured URL', async () => {
    // Same user, typed carelessly: extra spaces and upper-case e-mail.
    const messyForm = {
      ...JOHN_DOE_FORM,
      login: `  ${JOHN_DOE_FORM.login} `,
      lastName: ` ${JOHN_DOE_FORM.lastName} `,
      email: ` ${JOHN_DOE_FORM.email.toUpperCase()} `,
    };
    const result = await signUpAndRespond((req) => {
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(JOHN_DOE_REQUEST);
      req.flush(JOHN_DOE_REGISTERED, { status: 201, statusText: 'Created' });
    }, messyForm);
    expect(result).toEqual(JOHN_DOE_REGISTERED);
  });

  it('should reject a malformed response', async () => {
    const result = await signUpAndRespond((req) => req.flush({ id: 'not-a-number' }));
    expect(result).toBeInstanceOf(SignUpError);
    expect((result as SignUpError).reason).toBe('unexpected');
  });

  it('should expose the API message on conflict', async () => {
    const result = await signUpAndRespond((req) =>
      req.flush(
        { message: 'Cet identifiant est déjà utilisé.' },
        { status: 409, statusText: 'Conflict' },
      ),
    );
    expect(result).toEqual(new SignUpError('conflict', 'Cet identifiant est déjà utilisé.'));
  });

  it('should map a validation error', async () => {
    const result = await signUpAndRespond((req) =>
      req.flush(null, { status: 400, statusText: 'Bad Request' }),
    );
    expect((result as SignUpError).reason).toBe('invalid');
  });

  it('should map a network failure', async () => {
    const result = await signUpAndRespond((req) => req.error(new ProgressEvent('error')));
    expect((result as SignUpError).reason).toBe('network');
  });

  it('should hide server internals on 5xx', async () => {
    const result = await signUpAndRespond((req) =>
      req.flush({ message: 'Internal stack trace' }, { status: 500, statusText: 'Server Error' }),
    );
    expect((result as SignUpError).reason).toBe('server');
    expect((result as SignUpError).message).not.toContain('Internal stack trace');
  });
});
