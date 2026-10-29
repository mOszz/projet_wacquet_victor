export const POLLUTION_TYPES = [
  'Plastique',
  'Chimique',
  'Dépôt sauvage',
  'Eau',
  'Air',
  'Autre',
] as const;

export type PollutionType = (typeof POLLUTION_TYPES)[number];

/** CSS class giving each type its colour (see `.tag-*` in styles.css). */
export const POLLUTION_TYPE_TAGS: Record<PollutionType, string> = {
  Plastique: 'tag-plastique',
  Chimique: 'tag-chimique',
  'Dépôt sauvage': 'tag-depot',
  Eau: 'tag-eau',
  Air: 'tag-air',
  Autre: 'tag-autre',
};

/** Pollution as stored and returned by the API. */
export interface Pollution {
  id: number;
  titre: string;
  type: PollutionType;
  description: string;
  /** Date d'observation au format ISO `YYYY-MM-DD`. */
  dateObservation: string;
  lieu: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
}

/** Data entered in the form: the id is assigned by the API on creation. */
export type PollutionInput = Omit<Pollution, 'id'>;
