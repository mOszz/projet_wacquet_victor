import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PasswordMatch } from './password-match';
import { createEmptyUser, User } from './user';

@Component({
  selector: 'app-register-form',
  imports: [FormsModule, PasswordMatch],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  protected readonly loginMinLength = 3;
  protected readonly passwordMinLength = 8;

  protected user: User = createEmptyUser();
  protected readonly registeredUser = signal<User | null>(null);

  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.registeredUser.set(null);
      return;
    }
    this.registeredUser.set({ ...this.user });
  }

  protected onReset(form: NgForm): void {
    form.resetForm();
    this.user = createEmptyUser();
    this.registeredUser.set(null);
  }
}
