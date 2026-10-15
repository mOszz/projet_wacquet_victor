import { TestBed } from '@angular/core/testing';
import { Pollution } from '../../models/pollution.model';
import { PollutionRecap } from './pollution-recap';

const POLLUTION: Pollution = {
  id: 1,
  titre: 'Sacs plastiques',
  type: 'Plastique',
  description: 'Sacs sur la plage.',
  dateObservation: '2024-05-12',
  lieu: 'Dunkerque',
  latitude: 51.03,
  longitude: 2.37,
};

describe('PollutionRecap', () => {
  function render(pollution: Pollution) {
    const fixture = TestBed.createComponent(PollutionRecap);
    fixture.componentRef.setInput('pollution', pollution);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('should display the submitted data', () => {
    const text = render(POLLUTION).textContent!;
    expect(text).toContain('Sacs plastiques');
    expect(text).toContain('Plastique');
    expect(text).toContain('Dunkerque');
    expect(text).toContain('Sacs sur la plage.');
  });

  it('should not render an image without photo URL', () => {
    expect(render(POLLUTION).querySelector('img')).toBeNull();
  });

  it('should render the image when a photo URL is provided', () => {
    const img = render({ ...POLLUTION, photoUrl: 'https://example.com/a.jpg' }).querySelector(
      'img',
    );
    expect(img?.getAttribute('src')).toBe('https://example.com/a.jpg');
  });
});
