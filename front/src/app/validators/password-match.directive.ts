import { Directive, effect, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

/**
 * Validateur pour formulaire template-driven : vérifie que la valeur du champ
 * correspond à celle passée à [appPasswordMatch].
 */
@Directive({
  selector: '[appPasswordMatch]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatch, multi: true }],
})
export class PasswordMatch implements Validator {
  readonly appPasswordMatch = input<string>('');

  private onValidatorChange?: () => void;

  constructor() {
    // Relance la validation quand le mot de passe de référence change.
    effect(() => {
      this.appPasswordMatch();
      this.onValidatorChange?.();
    });
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string | null;
    if (!value) {
      return null; // le cas vide est géré par "required"
    }
    return value === this.appPasswordMatch() ? null : { passwordMismatch: true };
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}
