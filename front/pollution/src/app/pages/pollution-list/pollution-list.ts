import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  POLLUTION_TYPE_TAGS,
  POLLUTION_TYPES,
  Pollution,
  PollutionType,
} from '../../models/pollution.model';
import { PollutionService } from '../../services/pollution.service';

@Component({
  selector: 'app-pollution-list',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.css',
})
export class PollutionList {
  private readonly pollutionService = inject(PollutionService);

  protected readonly types = POLLUTION_TYPES;
  protected readonly typeTags = POLLUTION_TYPE_TAGS;
  protected readonly pollutions = rxResource({
    stream: () => this.pollutionService.getAll(),
    defaultValue: [],
  });

  // Filter criteria, bound to the filter bar.
  protected readonly search = signal('');
  protected readonly type = signal<PollutionType | ''>('');
  protected readonly from = signal('');
  protected readonly to = signal('');

  protected readonly hasFilters = computed(
    () => !!(this.search() || this.type() || this.from() || this.to()),
  );

  /** Pollutions matching every filled criterion, most recent observation first. */
  protected readonly filtered = computed(() => {
    // value() throws while the resource is in error: fall back to an empty list.
    const all = this.pollutions.hasValue() ? this.pollutions.value() : [];
    const search = normalize(this.search());
    const type = this.type();
    const from = this.from();
    const to = this.to();

    return all
      .filter(
        (p) =>
          (!search || normalize(`${p.titre} ${p.lieu} ${p.description}`).includes(search)) &&
          (!type || p.type === type) &&
          // ISO dates (YYYY-MM-DD) compare correctly as strings.
          (!from || p.dateObservation >= from) &&
          (!to || p.dateObservation <= to),
      )
      .sort((a, b) => b.dateObservation.localeCompare(a.dateObservation));
  });

  protected readonly deletingId = signal<number | null>(null);
  protected readonly deleteError = signal<string | null>(null);

  protected resetFilters(): void {
    this.search.set('');
    this.type.set('');
    this.from.set('');
    this.to.set('');
  }

  protected remove(pollution: Pollution): void {
    if (this.deletingId() !== null || !confirm(`Supprimer « ${pollution.titre} » ?`)) {
      return;
    }
    this.deletingId.set(pollution.id);
    this.deleteError.set(null);

    this.pollutionService.delete(pollution.id).subscribe({
      next: () => {
        // Update the list locally instead of reloading everything from the API.
        this.pollutions.update((list) => list.filter((p) => p.id !== pollution.id));
        this.deletingId.set(null);
      },
      error: () => {
        this.deleteError.set(`La suppression de « ${pollution.titre} » a échoué.`);
        this.deletingId.set(null);
      },
    });
  }
}

/** Lower-cases and strips accents, so "depot" matches "Dépôt". */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}
