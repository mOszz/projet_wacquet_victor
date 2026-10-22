import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { createEmptyUser, RegisteredUser, User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { PasswordMatch } from '../../validators/password-match.directive';

@Component({
  selector: 'app-register-form',
  imports: [FormsModule, PasswordMatch],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loginMinLength = 3;
  protected readonly passwordMinLength = 8;

  protected user: User = createEmptyUser();
  protected readonly registeredUser = signal<RegisteredUser | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly pending = signal(false);

  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    // Avoid sending the same sign-up twice while waiting for the answer.
    if (this.pending()) {
      return;
    }

    this.pending.set(true);
    this.errorMessage.set(null);
    this.registeredUser.set(null);

    this.authService
      .signUp(this.user)
      // Stops listening if the component is destroyed (e.g. tab change) before the answer.
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (registered) => {
          this.pending.set(false);
          this.registeredUser.set(registered);
          form.resetForm();
          this.user = createEmptyUser();
        },
        error: (error: HttpErrorResponse) => {
          this.pending.set(false);
          // Show the API message when there is one, a generic one otherwise.
          const apiMessage = error.error?.message;
          this.errorMessage.set(
            typeof apiMessage === 'string' ? apiMessage : "L'inscription a échoué, réessayez.",
          );
        },
      });
  }

  protected onReset(form: NgForm): void {
    form.resetForm();
    this.user = createEmptyUser();
    this.registeredUser.set(null);
    this.errorMessage.set(null);
  }
}
