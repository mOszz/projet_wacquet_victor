import { TestBed } from '@angular/core/testing';
import { Pollution } from '../../models/pollution.model';
import { PollutionForm } from './pollution-form';

const VALID_VALUE = {
  titre: 'Bidons abandonnés',
  type: 'Chimique' as const,
  description: 'Une dizaine de bidons près du canal.',
  dateObservation: '2024-05-12',
  lieu: 'Lille',
  latitude: 50.6292,
  longitude: 3.0573,
  photoUrl: '',
};

describe('PollutionForm', () => {
  function create() {
    const fixture = TestBed.createComponent(PollutionForm);
    fixture.detectChanges();
    return fixture;
  }

  it('should be invalid when empty', () => {
    expect(create().componentInstance.form.invalid).toBe(true);
  });

  it('should be valid with all required fields', () => {
    const { form } = create().componentInstance;
    form.setValue(VALID_VALUE);
    expect(form.valid).toBe(true);
  });

  it('should reject out-of-range coordinates', () => {
    const { form } = create().componentInstance;
    form.setValue({ ...VALID_VALUE, latitude: 91, longitude: -181 });
    expect(form.controls.latitude.hasError('max')).toBe(true);
    expect(form.controls.longitude.hasError('min')).toBe(true);
  });

  it('should reject impossible and future dates', () => {
    const { form } = create().componentInstance;
    form.controls.dateObservation.setValue('2023-02-31');
    expect(form.controls.dateObservation.hasError('invalidDate')).toBe(true);
    form.controls.dateObservation.setValue('2999-01-01');
    expect(form.controls.dateObservation.hasError('futureDate')).toBe(true);
  });

  it('should reject an invalid photo URL but accept an empty one', () => {
    const { form } = create().componentInstance;
    form.controls.photoUrl.setValue('pas une url');
    expect(form.controls.photoUrl.hasError('invalidUrl')).toBe(true);
    form.controls.photoUrl.setValue('');
    expect(form.controls.photoUrl.valid).toBe(true);
  });

  it('should not emit and should show errors when submitted invalid', () => {
    const fixture = create();
    let emitted = false;
    fixture.componentInstance.declared.subscribe(() => (emitted = true));
    const el = fixture.nativeElement as HTMLElement;
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(emitted).toBe(false);
    expect(el.querySelectorAll('.error').length).toBeGreaterThan(0);
  });

  it('should emit the declaration when submitted valid', () => {
    const fixture = create();
    let emitted: Pollution | undefined;
    fixture.componentInstance.declared.subscribe((p) => (emitted = p));
    fixture.componentInstance.form.setValue({ ...VALID_VALUE, titre: '  Bidons  ' });
    (fixture.nativeElement as HTMLElement)
      .querySelector('form')!
      .dispatchEvent(new Event('submit'));
    expect(emitted).toEqual({ ...VALID_VALUE, titre: 'Bidons', photoUrl: undefined });
  });
});
