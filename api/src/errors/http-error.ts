/**
 * Error carrying an HTTP status, thrown by the services (like Spring's ResponseStatusException).
 * The error middleware turns it into `{ message }` with that status.
 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
