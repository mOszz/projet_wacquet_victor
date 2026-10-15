import { Environment } from './environment.model';

// Production configuration.
// No backend is deployed yet, so the mock API stays enabled for now.
export const environment: Environment = {
  production: true,
  apiUrl: '/api',
  useMockApi: true,
  mockLatencyMs: 400,
};
