import { Pipe, PipeTransform } from '@angular/core';

export type PollutionLevel = 'Faible' | 'Modérée' | 'Élevée' | 'Dangereuse';

/**
 * Converts a numeric danger index into a level:
 * 0-20 Faible, 21-50 Modérée, 51-100 Élevée, 101+ Dangereuse.
 * Shared with HighlightPollutionDirective so the thresholds live in one place.
 */
export function getPollutionLevel(index: number): PollutionLevel {
  if (index <= 20) {
    return 'Faible';
  }
  if (index <= 50) {
    return 'Modérée';
  }
  if (index <= 100) {
    return 'Élevée';
  }
  return 'Dangereuse';
}

/** Usage: `{{ pollution.indiceDangerosite | pollutionLevel }}` → "Modérée". */
@Pipe({ name: 'pollutionLevel' })
export class PollutionLevelPipe implements PipeTransform {
  transform(index: number): PollutionLevel {
    return getPollutionLevel(index);
  }
}
