import { TestBed } from '@angular/core/testing';
import { RegisterForm } from './register-form';

describe('RegisterForm', () => {
  async function render() {
    const fixture = TestBed.createComponent(RegisterForm);
    await fixture.whenStable();
    return fixture;
  }

  async function type(fixture: Awaited<ReturnType<typeof render>>, id: string, value: string) {
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  async function submit(fixture: Awaited<ReturnType<typeof render>>) {
    (fixture.nativeElement as HTMLElement)
      .querySelector('form')!
      .dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async function fillValid(
    fixture: Awaited<ReturnType<typeof render>>,
    confirmation = 'motdepasse',
  ) {
    await type(fixture, 'login', 'victor');
    await type(fixture, 'password', 'motdepasse');
    await type(fixture, 'passwordConfirmation', confirmation);
    await type(fixture, 'lastName', 'Wacquet');
    await type(fixture, 'firstName', 'Victor');
    await type(fixture, 'email', 'victor@example.com');
  }

  it('should show errors and no welcome message when submitted empty', async () => {
    const fixture = await render();
    await submit(fixture);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.error').length).toBeGreaterThan(0);
    expect(el.querySelector('.success')).toBeNull();
  });

  it('should reject mismatching passwords', async () => {
    const fixture = await render();
    await fillValid(fixture, 'autrechose');
    await submit(fixture);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Les mots de passe ne correspondent pas.');
    expect(el.querySelector('.success')).toBeNull();
  });

  it('should display a welcome message when valid', async () => {
    const fixture = await render();
    await fillValid(fixture);
    await submit(fixture);
    expect((fixture.nativeElement as HTMLElement).querySelector('.success')?.textContent).toContain(
      'Bienvenue, Victor',
    );
  });
});
