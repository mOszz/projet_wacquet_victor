import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of, switchMap, throwError, timer } from 'rxjs';

/** Simulated network delay, so loading states are visible. */
const LATENCY_MS = 400;

/** Successful response of the fake backend, delivered after the simulated delay. */
export function mockResponse<T>(body: T, status = 200): Observable<HttpEvent<T>> {
  return timer(LATENCY_MS).pipe(switchMap(() => of(new HttpResponse({ status, body }))));
}

/** Error response of the fake backend, delivered after the simulated delay. */
export function mockError(status: number, message: string): Observable<never> {
  return timer(LATENCY_MS).pipe(
    switchMap(() => throwError(() => new HttpErrorResponse({ status, error: { message } }))),
  );
}
