export interface Environment {
  production: boolean;
  /** Base URL of the REST API (a trailing slash is tolerated). */
  apiUrl: string;
  /** When true, calls to `apiUrl` are answered by the in-memory mock API instead of a real server. */
  useMockApi: boolean;
  /** Simulated network latency of the mock API, in milliseconds. */
  mockLatencyMs: number;
}
