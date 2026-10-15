// TEST DATA ONLY — fictitious values shared by the unit tests (*.spec.ts).
// Never imported by the application code.
import { Pollution } from '../models/pollution.model';

/** A complete, valid declaration (without photo). */
export const SAMPLE_POLLUTION: Pollution = {
  titre: 'Titre de test',
  type: 'Plastique',
  description: 'Description de test.',
  dateObservation: '2026-01-15',
  lieu: 'Lieu de test',
  latitude: 48.8566,
  longitude: 2.3522,
};

export const SAMPLE_PHOTO_URL = 'https://example.com/photo.jpg';
