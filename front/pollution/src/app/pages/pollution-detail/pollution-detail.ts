import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { PollutionRecap } from '../../components/pollution-recap/pollution-recap';
import { Pollution } from '../../models/pollution.model';
import { PollutionService } from '../../services/pollution.service';

@Component({
  selector: 'app-pollution-detail',
  imports: [PollutionRecap, RouterLink],
  templateUrl: './pollution-detail.html',
})
export class PollutionDetail {
  private readonly pollutionService = inject(PollutionService);
  private readonly router = inject(Router);

  /** `:id` route parameter (bound by withComponentInputBinding). */
  readonly id = input.required<string>();

  // Reloads automatically when the id changes (e.g. navigating between details).
  protected readonly pollution = rxResource({
    params: () => Number(this.id()),
    stream: ({ params: id }) => this.pollutionService.getById(id),
  });

  protected readonly deleting = signal(false);
  protected readonly deleteError = signal<string | null>(null);

  protected remove(pollution: Pollution): void {
    if (this.deleting() || !confirm(`Supprimer « ${pollution.titre} » ?`)) {
      return;
    }
    this.deleting.set(true);
    this.deleteError.set(null);

    this.pollutionService.delete(pollution.id).subscribe({
      next: () => this.router.navigate(['/pollutions']),
      error: () => {
        this.deleteError.set('La suppression a échoué, réessayez.');
        this.deleting.set(false);
      },
    });
  }
}
