import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { handlePollutions } from './pollutions.mock';
import { handleUsers } from './users.mock';

/**
 * Fake backend used while there is no API: answers the requests sent to
 * `environment.apiUrl` and lets every other request through.
 * Enabled in app.config.ts when `environment.useMockApi` is true.
 * To mock a new resource, add a handler file and a `case` below.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(`${environment.apiUrl}/`)) {
    return next(req);
  }

  // "{apiUrl}/pollutions/3" -> resource "pollutions", id 3
  const [resource, rawId] = req.url.slice(environment.apiUrl.length + 1).split('/');
  const id = rawId === undefined ? null : Number(rawId);

  let response = null;
  switch (resource) {
    case 'users':
      response = handleUsers(req);
      break;
    case 'pollutions':
      // A non-numeric id ("/pollutions/abc") becomes NaN, which matches nothing (-> 404).
      response = handlePollutions(req, id);
      break;
  }

  // Routes the mock does not know go to the network unchanged.
  return response ?? next(req);
};
