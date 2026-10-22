// Development configuration (`ng serve`), swapped in by `fileReplacements` in angular.json.
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  // No backend yet: requests are answered by the mock API (see mocks/).
  useMockApi: true,
};
