import { TestBed } from '@angular/core/testing';
import { JOHN_DOE_REGISTERED } from '../../testing/user.fixtures';
import { RegisterResult } from './register-result';

describe('RegisterResult', () => {
  it('should display the registered account', () => {
    const fixture = TestBed.createComponent(RegisterResult);
    fixture.componentRef.setInput('user', JOHN_DOE_REGISTERED);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent!;
    expect(text).toContain(`Bienvenue, ${JOHN_DOE_REGISTERED.firstName}`);
    expect(text).toContain(String(JOHN_DOE_REGISTERED.id));
    expect(text).toContain(JOHN_DOE_REGISTERED.email);
  });
});
