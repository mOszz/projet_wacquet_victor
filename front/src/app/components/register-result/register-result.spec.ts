import { TestBed } from '@angular/core/testing';
import { RegisterResult } from './register-result';

describe('RegisterResult', () => {
  it('should display the registered account', () => {
    const fixture = TestBed.createComponent(RegisterResult);
    fixture.componentRef.setInput('user', {
      id: 42,
      login: 'victor',
      lastName: 'Wacquet',
      firstName: 'Victor',
      email: 'victor@example.com',
      createdAt: '2026-10-15T10:00:00.000Z',
    });
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent!;
    expect(text).toContain('Bienvenue, Victor');
    expect(text).toContain('42');
    expect(text).toContain('victor@example.com');
  });
});
