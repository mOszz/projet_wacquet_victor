import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PollutionForm } from '../../components/pollution-form/pollution-form';
import { PollutionRecap } from '../../components/pollution-recap/pollution-recap';
import { Pollution, PollutionInput } from '../../models/pollution.model';
import { PollutionService } from '../../services/pollution.service';

/** Declaration page: form, then recap of the created pollution on the same page (TP02). */
@Component({
  selector: 'app-pollution-create',
  imports: [PollutionForm, PollutionRecap, RouterLink],
  templateUrl: './pollution-create.html',
})
export class PollutionCreate {
  private readonly pollutionService = inject(PollutionService);

  protected readonly created = signal<Pollution | null>(null);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected onDeclared(pollution: PollutionInput): void {
    // Avoid creating the same pollution twice while waiting for the answer.
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    this.error.set(null);

    this.pollutionService.create(pollution).subscribe({
      next: (created) => {
        this.created.set(created);
        this.saving.set(false);
        window.scrollTo({ top: 0 });
      },
      error: () => {
        this.error.set("L'enregistrement a échoué, réessayez.");
        this.saving.set(false);
      },
    });
  }
}
