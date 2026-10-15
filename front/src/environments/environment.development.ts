import { Environment } from './environment.model';

// Development configuration (`ng serve`), swapped in through `fileReplacements` in angular.json.
export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  useMockApi: true,
  mockLatencyMs: 800,
};
