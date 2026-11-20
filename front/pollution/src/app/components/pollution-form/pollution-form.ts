import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAX_PHOTO_SIZE,
  PHOTO_TYPES,
  POLLUTION_TYPES,
  Pollution,
  PollutionFormValue,
  PollutionType,
} from '../../models/pollution.model';
import {
  finiteNumber,
  notBlank,
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
};

@Component({
  selector: 'app-pollution-form',
  imports: [ReactiveFormsModule],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollutionForm {
  @Input() heading = 'Nouvelle déclaration';
  @Input() submitLabel = 'Déclarer';

  /** Pre-fills the form, e.g. to edit an existing pollution. */
  @Input() set pollution(value: Pollution | null) {
    if (value) {
      this.form.patchValue(value);
      this.currentPhotoUrl.set(value.photoUrl);
    }
  }

  @Output() readonly declared = new EventEmitter<PollutionFormValue>();

  private readonly fb = inject(FormBuilder);

  protected readonly types = POLLUTION_TYPES;
  protected readonly today = toIsoDate(new Date());
  protected submitted = false;

  // The photo is a file, kept outside the reactive form (which only handles text values).
  protected readonly photoTypes = PHOTO_TYPES.join(',');
  protected readonly photo = signal<File | null>(null);
  protected readonly photoError = signal<string | null>(null);
  /** Photo already stored (edit mode), and whether the user asked to delete it. */
  protected readonly currentPhotoUrl = signal<string | null>(null);
  protected readonly removePhoto = signal(false);

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
    indiceDangerosite: this.fb.control<number | null>(null, [
      Validators.required,
      finiteNumber,
      Validators.min(0),
    ]),
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
    if (field === 'indiceDangerosite' && errors['min']) {
      return "L'indice ne peut pas être négatif.";
    }
    if (errors['min'] || errors['max']) {
      const { min, max } = field === 'latitude' ? { min: -90, max: 90 } : { min: -180, max: 180 };
      return `La valeur doit être comprise entre ${min} et ${max}.`;
    }
    const key = Object.keys(errors)[0];
    return ERROR_MESSAGES[key] ?? 'Valeur invalide.';
  }

  /** Checks the chosen file with the same rules as the API, before any upload. */
  protected onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.photoError.set(null);

    if (file && !PHOTO_TYPES.includes(file.type)) {
      this.photoError.set('Format non supporté : JPEG, PNG, WebP ou GIF.');
    } else if (file && file.size > MAX_PHOTO_SIZE) {
      this.photoError.set('La photo dépasse 5 Mo.');
    }

    if (this.photoError()) {
      input.value = ''; // so the same file can be picked again after the error
      this.photo.set(null);
    } else {
      this.photo.set(file);
    }
  }

  protected onRemovePhotoChange(event: Event): void {
    this.removePhoto.set((event.target as HTMLInputElement).checked);
  }

  protected onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.declared.emit({
      pollution: {
        titre: value.titre.trim(),
        type: value.type!,
        description: value.description.trim(),
        dateObservation: value.dateObservation,
        lieu: value.lieu.trim(),
        latitude: value.latitude!,
        longitude: value.longitude!,
        indiceDangerosite: value.indiceDangerosite!,
      },
      photo: this.photo(),
      removePhoto: this.removePhoto(),
    });
  }
}

function toIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
