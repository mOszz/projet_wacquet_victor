import { TestBed } from '@angular/core/testing';
import { Pollution } from '../../models/pollution.model';
import { SAMPLE_PHOTO_URL, SAMPLE_POLLUTION } from '../../testing/pollution.fixtures';
import { PollutionRecap } from './pollution-recap';

const POLLUTION: Pollution = { ...SAMPLE_POLLUTION, id: 1 };

describe('PollutionRecap', () => {
  function render(pollution: Pollution) {
    const fixture = TestBed.createComponent(PollutionRecap);
    fixture.componentRef.setInput('pollution', pollution);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should display the submitted data', () => {
    const text = render(POLLUTION).textContent!;
    expect(text).toContain(POLLUTION.titre);
    expect(text).toContain(POLLUTION.type);
    expect(text).toContain(POLLUTION.lieu);
    expect(text).toContain(POLLUTION.description);
  });

  it('should not render an image without photo URL', () => {
    expect(render(POLLUTION).querySelector('img')).toBeNull();
  });

  it('should render the image when a photo URL is provided', () => {
    const img = render({ ...POLLUTION, photoUrl: SAMPLE_PHOTO_URL }).querySelector('img');
    expect(img?.getAttribute('src')).toBe(SAMPLE_PHOTO_URL);
  });
});
