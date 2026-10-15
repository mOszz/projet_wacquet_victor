import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { RegisteredUser, User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { SignUpError } from '../../services/sign-up-error';
import { JOHN_DOE_FORM, JOHN_DOE_REGISTERED } from '../../testing/user.fixtures';
import { RegisterForm } from './register-form';

describe('RegisterForm', () => {
  let fixture: ComponentFixture<RegisterForm>;
  let el: HTMLElement;
  let response: Subject<RegisteredUser>;
  let signUp: ReturnType<typeof vi.fn<(user: User) => Subject<RegisteredUser>>>;

  beforeEach(async () => {
    // The service is faked: the component is tested in isolation from HTTP.
    response = new Subject<RegisteredUser>();
    signUp = vi.fn(() => response);
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: { signUp } }],
    });
    fixture = TestBed.createComponent(RegisterForm);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  async function type(id: keyof User, value: string) {
    const input = el.querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  /** Types every field of `user` in the form, as a person would. */
  async function fill(user: User) {
    for (const field of Object.keys(user) as (keyof User)[]) {
      await type(field, user[field]);
    }
  }

  async function submit() {
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await settle();
  }

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should not call the service when the form is invalid', async () => {
    await submit();
    expect(signUp).not.toHaveBeenCalled();
    expect(el.querySelectorAll('.error').length).toBeGreaterThan(0);
  });

  it('should reject mismatching passwords without calling the service', async () => {
    await fill({ ...JOHN_DOE_FORM, passwordConfirmation: 'SomethingElse' });
    await submit();
    expect(el.textContent).toContain('Les mots de passe ne correspondent pas.');
    expect(signUp).not.toHaveBeenCalled();
  });

  it('should disable the form while the request is pending and ignore re-submits', async () => {
    await fill(JOHN_DOE_FORM);
    await submit();
    await submit();
    expect(signUp).toHaveBeenCalledTimes(1);
    expect(el.querySelector('fieldset')!.disabled).toBe(true);
    expect(el.querySelector<HTMLButtonElement>('button[type=submit]')!.disabled).toBe(true);
  });

  it('should display the API result and clear the form on success', async () => {
    await fill(JOHN_DOE_FORM);
    await submit();
    response.next(JOHN_DOE_REGISTERED);
    response.complete();
    await settle();
    expect(el.querySelector('app-register-result')?.textContent).toContain(
      `Bienvenue, ${JOHN_DOE_REGISTERED.firstName}`,
    );
    expect(el.querySelector<HTMLInputElement>('#login')!.value).toBe('');
    expect(el.querySelector('fieldset')!.disabled).toBe(false);
  });

  it('should display the error message on failure and keep the input for a retry', async () => {
    await fill(JOHN_DOE_FORM);
    await submit();
    response.error(new SignUpError('conflict', 'Cet identifiant est déjà utilisé.'));
    await settle();
    expect(el.querySelector('[role=alert]')?.textContent).toContain(
      'Cet identifiant est déjà utilisé.',
    );
    expect(el.querySelector('app-register-result')).toBeNull();
    expect(el.querySelector<HTMLInputElement>('#login')!.value).toBe(JOHN_DOE_FORM.login);
    expect(el.querySelector('fieldset')!.disabled).toBe(false);
  });

  it('should cancel the pending request on reset', async () => {
    await fill(JOHN_DOE_FORM);
    await submit();
    el.querySelector<HTMLButtonElement>('button[type=button]')!.click();
    await settle();
    expect(response.observed).toBe(false);
    expect(el.querySelector('fieldset')!.disabled).toBe(false);
  });
});
