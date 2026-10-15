import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RegisteredUser, createEmptyUser, User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { SignUpError } from '../../services/sign-up-error';
import { PasswordMatch } from '../../validators/password-match.directive';
import { RegisterResult } from '../register-result/register-result';

type SubmitStatus = 'idle' | 'pending' | 'success' | 'error';

@Component({
  selector: 'app-register-form',
  imports: [FormsModule, PasswordMatch, RegisterResult],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private pendingRequest?: Subscription;

  protected readonly loginMinLength = 3;
  protected readonly passwordMinLength = 8;

  protected user: User = createEmptyUser();
  protected readonly status = signal<SubmitStatus>('idle');
  protected readonly registeredUser = signal<RegisteredUser | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly pending = computed(() => this.status() === 'pending');

  protected onSubmit(form: NgForm): void {
    // Ignore re-submissions (e.g. pressing Enter again) while a request is in flight.
    if (this.pending()) {
      return;
    }
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.status.set('pending');
    this.errorMessage.set(null);
    this.registeredUser.set(null);

    this.pendingRequest = this.authService
      .signUp(this.user)
      // Drops the request if the component is destroyed (e.g. tab switch) before the response.
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (registered) => {
          this.registeredUser.set(registered);
          this.status.set('success');
          // Clear the form so the same account cannot be submitted twice by mistake.
          this.clearForm(form);
        },
        error: (error: unknown) => {
          this.errorMessage.set(
            error instanceof SignUpError ? error.message : 'Une erreur inattendue est survenue.',
          );
          this.status.set('error');
        },
      });
  }

  protected onReset(form: NgForm): void {
    // Cancel any in-flight request so its response cannot overwrite the reset state.
    this.pendingRequest?.unsubscribe();
    this.clearForm(form);
    this.registeredUser.set(null);
    this.errorMessage.set(null);
    this.status.set('idle');
  }

  private clearForm(form: NgForm): void {
    form.resetForm();
    this.user = createEmptyUser();
  }
}
