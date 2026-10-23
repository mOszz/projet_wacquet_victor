import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pollution, PollutionInput } from '../models/pollution.model';
import { mockError, mockResponse } from './mock-http';

// In-memory "pollutions" table of the fake backend (reset on page reload).
// MOCK DATA: fictitious declarations so the list is not empty at start-up.
const pollutions: Pollution[] = [
  {
    id: 1,
    titre: 'Sacs plastiques sur la plage',
    type: 'Plastique',
    description: 'Une vingtaine de sacs plastiques laissés près du poste de secours.',
    dateObservation: '2026-09-12',
    lieu: 'Plage de test, Zone A',
    latitude: 43.2965,
    longitude: 5.3698,
  },
  {
    id: 2,
    titre: 'Fûts abandonnés en bord de rivière',
    type: 'Chimique',
    description: 'Trois fûts rouillés, odeur de solvant.',
    dateObservation: '2026-10-03',
    lieu: 'Berges de test, Zone B',
    latitude: 45.764,
    longitude: 4.8357,
  },
  {
    id: 3,
    titre: 'Gravats dans un chemin forestier',
    type: 'Dépôt sauvage',
    description: 'Gravats et plaques de plâtre déposés sur environ 10 m².',
    dateObservation: '2026-10-18',
    lieu: 'Forêt de test, Zone C',
    latitude: 48.8566,
    longitude: 2.3522,
  },
];
let nextId = pollutions.length + 1;

/**
 * Fake `/pollutions` REST endpoint.
 * `id` is null for the collection (`/pollutions`), set for one item (`/pollutions/:id`).
 */
export function handlePollutions(
  req: HttpRequest<unknown>,
  id: number | null,
): Observable<HttpEvent<unknown>> | null {
  if (id === null) {
    switch (req.method) {
      case 'GET':
        return mockResponse(structuredClone(pollutions));
      case 'POST': {
        const created: Pollution = { ...(req.body as PollutionInput), id: nextId++ };
        pollutions.push(created);
        return mockResponse(structuredClone(created), 201);
      }
      default:
        return null;
    }
  }

  const index = pollutions.findIndex((p) => p.id === id);
  if (index === -1) {
    return mockError(404, 'Pollution introuvable.');
  }

  switch (req.method) {
    case 'GET':
      return mockResponse(structuredClone(pollutions[index]));
    case 'PUT':
      // The id comes from the URL, never from the body.
      pollutions[index] = { ...(req.body as PollutionInput), id };
      return mockResponse(structuredClone(pollutions[index]));
    case 'DELETE':
      pollutions.splice(index, 1);
      return mockResponse(null, 204);
    default:
      return null;
  }
}
