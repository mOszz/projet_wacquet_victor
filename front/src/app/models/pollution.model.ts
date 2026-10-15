export const POLLUTION_TYPES = [
  'Plastique',
  'Chimique',
  'Dépôt sauvage',
  'Eau',
  'Air',
  'Autre',
] as const;

export type PollutionType = (typeof POLLUTION_TYPES)[number];

/**
 * Déclaration de pollution telle qu'elle sera échangée avec le backend.
 * `id` sera attribué par le serveur lors de l'enregistrement.
 */
export interface Pollution {
  id?: number;
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
