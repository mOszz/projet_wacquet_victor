// Development configuration (`ng serve`), swapped in by `fileReplacements` in angular.json.
export const environment = {
  production: false,
  // Local API: `cd api && npm run dev`.
  apiUrl: 'http://localhost:3000/api',
  // true: requests are answered by the mock API (see mocks/); false: the local API is called.
  useMockApi: true,
};
