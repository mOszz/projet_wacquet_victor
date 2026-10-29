import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { PollutionForm } from '../../components/pollution-form/pollution-form';
import { PollutionInput } from '../../models/pollution.model';
import { PollutionService } from '../../services/pollution.service';

@Component({
  selector: 'app-pollution-edit',
  imports: [PollutionForm, RouterLink],
  templateUrl: './pollution-edit.html',
})
export class PollutionEdit {
  private readonly pollutionService = inject(PollutionService);
  private readonly router = inject(Router);

  /** `:id` route parameter (bound by withComponentInputBinding). */
  readonly id = input.required<string>();

  protected readonly pollution = rxResource({
    params: () => Number(this.id()),
    stream: ({ params: id }) => this.pollutionService.getById(id),
  });

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected onSubmit(changes: PollutionInput): void {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    this.error.set(null);

    this.pollutionService.update(Number(this.id()), changes).subscribe({
      next: (updated) => this.router.navigate(['/pollutions', updated.id]),
      error: () => {
        this.error.set('La modification a échoué, réessayez.');
        this.saving.set(false);
      },
    });
  }
}
