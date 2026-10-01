import { Directive, effect, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

/**
 * Template-driven validator: checks that the host control value
 * matches the value passed to [appPasswordMatch].
 */
@Directive({
  selector: '[appPasswordMatch]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatch, multi: true }],
})
export class PasswordMatch implements Validator {
  readonly appPasswordMatch = input<string>('');

  private onValidatorChange?: () => void;

  constructor() {
    // Re-run validation when the reference password changes.
    effect(() => {
      this.appPasswordMatch();
      this.onValidatorChange?.();
    });
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string | null;
    if (!value) {
      return null; // "required" handles empty values
    }
    return value === this.appPasswordMatch() ? null : { passwordMismatch: true };
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
