import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { mockApiInterceptor } from './mocks/mock-api.interceptor';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // The mock is plugged in at the HTTP layer: services keep using HttpClient
    // and will hit the real API as soon as `useMockApi` is set to false.
    provideHttpClient(
      withFetch(),
      withInterceptors(environment.useMockApi ? [mockApiInterceptor] : []),
    ),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
};
