import { Component, inject, signal } from '@angular/core';
import { PollutionForm } from './components/pollution-form/pollution-form';
import { PollutionRecap } from './components/pollution-recap/pollution-recap';
import { Pollution } from './models/pollution.model';
import { PollutionService } from './services/pollution.service';

@Component({
  imports: [PollutionForm, PollutionRecap],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly pollutionService = inject(PollutionService);

  protected readonly declaration = signal<Pollution | null>(null);

  protected onDeclared(pollution: Pollution): void {
    this.pollutionService.declarer(pollution).subscribe((saved) => {
      this.declaration.set(saved);
      window.scrollTo({ top: 0 });
    });
  }

  protected onNewDeclaration(): void {
    this.declaration.set(null);
  }
}
