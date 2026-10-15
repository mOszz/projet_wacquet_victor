import { environment } from '../../environments/environment';

/**
 * Builds an absolute API URL from a resource path, e.g. `buildApiUrl('users')`.
 * Slashes are normalised so `apiUrl` may or may not end with one.
 */
export function buildApiUrl(path: string): string {
  const base = environment.apiUrl.replace(/\/+$/, '');
  const resource = path.replace(/^\/+/, '');
  return `${base}/${resource}`;
}
