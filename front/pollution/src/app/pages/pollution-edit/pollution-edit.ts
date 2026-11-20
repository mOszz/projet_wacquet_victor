import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { PollutionForm } from '../../components/pollution-form/pollution-form';
import { PollutionFormValue } from '../../models/pollution.model';
import { PollutionService } from '../../services/pollution.service';

@Component({
  selector: 'app-pollution-edit',
  imports: [PollutionForm, RouterLink],
  templateUrl: './pollution-edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  protected onSubmit(value: PollutionFormValue): void {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    this.error.set(null);

    this.pollutionService.update(Number(this.id()), value).subscribe({
      next: (updated) => this.router.navigate(['/pollutions', updated.id]),
      error: (error: HttpErrorResponse) => {
        // The API explains rejected data (e.g. photo too large); otherwise a generic message.
        this.error.set(error.error?.message ?? 'La modification a échoué, réessayez.');
        this.saving.set(false);
      },
    });
  }
}
