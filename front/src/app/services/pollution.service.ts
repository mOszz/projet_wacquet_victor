import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pollution } from '../models/pollution.model';

/**
 * Point d'accès unique aux déclarations de pollution.
 * Pour l'instant les données restent en mémoire ; l'API Observable permettra
 * de brancher HttpClient (ex. `this.http.post<Pollution>('/api/pollutions', p)`)
 * sans modifier les composants.
 */
@Injectable({ providedIn: 'root' })
export class PollutionService {
  private readonly pollutions: Pollution[] = [];
  private nextId = 1;

  declarer(pollution: Pollution): Observable<Pollution> {
    const saved: Pollution = { ...pollution, id: this.nextId++ };
    this.pollutions.push(saved);
    return of(saved);
  }
}
