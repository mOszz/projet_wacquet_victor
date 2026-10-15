import { Component, inject, signal } from '@angular/core';
import { PollutionForm } from './components/pollution-form/pollution-form';
import { PollutionRecap } from './components/pollution-recap/pollution-recap';
import { RegisterForm } from './components/register-form/register-form';
import { Pollution } from './models/pollution.model';
import { PollutionService } from './services/pollution.service';

type View = 'pollution' | 'register';

const VIEW_HEADINGS: Record<View, { title: string; lead: string }> = {
  pollution: {
    title: 'Déclarer une pollution',
    lead: 'Vous avez repéré une pollution ? Renseignez le formulaire ci-dessous pour la signaler.',
  },
  register: {
    title: 'Créer un compte',
    lead: 'Inscrivez-vous pour suivre vos déclarations et participer à la communauté.',
  },
};

@Component({
  imports: [PollutionForm, PollutionRecap, RegisterForm],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly pollutionService = inject(PollutionService);

  protected readonly headings = VIEW_HEADINGS;
  protected readonly view = signal<View>('pollution');
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
