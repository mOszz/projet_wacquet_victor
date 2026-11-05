import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const HTTP_URL = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

/** Refuse une chaîne composée uniquement d'espaces (Validators.required l'accepte). */
export const notBlank: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return typeof value === 'string' && value.length > 0 && value.trim().length === 0
    ? { blank: true }
    : null;
};

/** Exige un nombre fini (rejette NaN, Infinity et les chaînes). */
export const finiteNumber: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (value === null || value === '') {
    return null;
  }
  return typeof value === 'number' && Number.isFinite(value) ? null : { notANumber: true };
};

/** Exige une date ISO `YYYY-MM-DD` existante (pas de 31 février) et non future. */
export const validObservationDate: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;
  if (!value) {
    return null;
  }

  const match = ISO_DATE.exec(value);
  if (!match) {
    return { invalidDate: true };
  }

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return { invalidDate: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today ? { futureDate: true } : null;
};

/** Champ optionnel : si renseigné, doit être une URL http(s). */
export const optionalHttpUrl: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = typeof control.value === 'string' ? control.value.trim() : '';
  return value === '' || HTTP_URL.test(value) ? null : { invalidUrl: true };
};
