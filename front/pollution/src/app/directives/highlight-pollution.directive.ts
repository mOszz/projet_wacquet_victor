import { Directive, computed, input } from '@angular/core';
import { PollutionLevel, getPollutionLevel } from '../pipes/pollution-level.pipe';

/** Background colour of each pollution level. */
const LEVEL_COLORS: Record<PollutionLevel, string> = {
  Faible: '#c8e6c9', // light green
  Modérée: '#fff59d', // yellow
  Élevée: '#ffcc80', // orange
  Dangereuse: '#ef9a9a', // red
};

/** Usage: `<span [appHighlightPollution]="pollution.indiceDangerosite">…</span>`. */
@Directive({
  selector: '[appHighlightPollution]',
  host: { '[style.background-color]': 'color()' },
})
export class HighlightPollutionDirective {
  /** Numeric danger index of the pollution. */
  readonly appHighlightPollution = input.required<number>();

  // Recomputed (and the background updated) whenever the index changes.
  protected readonly color = computed(
    () => LEVEL_COLORS[getPollutionLevel(this.appHighlightPollution())],
  );
}
