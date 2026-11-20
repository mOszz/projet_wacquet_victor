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
  /** Danger index (0 or more), displayed as a level by PollutionLevelPipe. */
  indiceDangerosite: number;
  /** URL of the photo stored by the API (read-only), or null when there is none. */
  photoUrl: string | null;
}

/** Fields entered in the form: the id and the photo URL are set by the API. */
export type PollutionInput = Omit<Pollution, 'id' | 'photoUrl'>;

/** What the form submits: the fields, plus the photo changes. */
export interface PollutionFormValue {
  pollution: PollutionInput;
  /** New image to store, or null to keep the current one. */
  photo: File | null;
  /** True to delete the current photo (ignored when a new one is sent). */
  removePhoto: boolean;
}

/** Same rules as the API (api/src/middlewares/upload.middleware.ts). */
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
