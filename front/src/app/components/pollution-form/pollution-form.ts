import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { POLLUTION_TYPES, PollutionInput, PollutionType } from '../../models/pollution.model';
import {
  finiteNumber,
  notBlank,
  optionalHttpUrl,
  validObservationDate,
} from '../../validators/pollution.validators';

type FieldName = keyof PollutionForm['form']['controls'];

const ERROR_MESSAGES: Record<string, string> = {
  required: 'Ce champ est obligatoire.',
  blank: 'Ce champ ne peut pas être vide.',
  maxlength: 'Ce texte est trop long.',
  notANumber: 'Veuillez saisir un nombre valide.',
  invalidDate: 'Cette date est invalide.',
  futureDate: "La date d'observation ne peut pas être dans le futur.",
  invalidUrl: 'Veuillez saisir une URL commençant par http:// ou https://.',
};

@Component({
  selector: 'app-pollution-form',
  imports: [ReactiveFormsModule],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.css',
})
export class PollutionForm {
  @Input() heading = 'Nouvelle déclaration';
  @Input() submitLabel = 'Déclarer';

  /** Pre-fills the form, e.g. to edit an existing pollution. */
  @Input() set pollution(value: PollutionInput | null) {
    if (value) {
      this.form.patchValue({ ...value, photoUrl: value.photoUrl ?? '' });
    }
  }

  @Output() readonly declared = new EventEmitter<PollutionInput>();

  private readonly fb = inject(FormBuilder);

  protected readonly types = POLLUTION_TYPES;
  protected readonly today = toIsoDate(new Date());
  protected submitted = false;

  readonly form = this.fb.group({
    titre: this.fb.nonNullable.control('', [
      Validators.required,
      notBlank,
      Validators.maxLength(120),
    ]),
    type: this.fb.control<PollutionType | null>(null, Validators.required),
    description: this.fb.nonNullable.control('', [
      Validators.required,
      notBlank,
      Validators.maxLength(2000),
    ]),
    dateObservation: this.fb.nonNullable.control('', [Validators.required, validObservationDate]),
    lieu: this.fb.nonNullable.control('', [
      Validators.required,
      notBlank,
      Validators.maxLength(200),
    ]),
    latitude: this.fb.control<number | null>(null, [
      Validators.required,
      finiteNumber,
      Validators.min(-90),
      Validators.max(90),
    ]),
    longitude: this.fb.control<number | null>(null, [
      Validators.required,
      finiteNumber,
      Validators.min(-180),
      Validators.max(180),
    ]),
    photoUrl: this.fb.nonNullable.control('', optionalHttpUrl),
  });

  protected showError(field: FieldName): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted);
  }

  protected errorMessage(field: FieldName): string {
    const errors = this.form.controls[field].errors;
    if (!errors) {
      return '';
    }
    if (errors['min'] || errors['max']) {
      const { min, max } = field === 'latitude' ? { min: -90, max: 90 } : { min: -180, max: 180 };
      return `La valeur doit être comprise entre ${min} et ${max}.`;
    }
    const key = Object.keys(errors)[0];
    return ERROR_MESSAGES[key] ?? 'Valeur invalide.';
  }

  protected onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const photoUrl = value.photoUrl.trim();
    this.declared.emit({
      titre: value.titre.trim(),
      type: value.type!,
      description: value.description.trim(),
      dateObservation: value.dateObservation,
      lieu: value.lieu.trim(),
      latitude: value.latitude!,
      longitude: value.longitude!,
      ...(photoUrl && { photoUrl }),
    });
  }
}

function toIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
