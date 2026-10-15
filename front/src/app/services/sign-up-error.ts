export type SignUpFailureReason =
  'conflict' | 'invalid' | 'network' | 'timeout' | 'server' | 'unexpected';

/**
 * Error emitted by AuthService.signUp(). Components only deal with this type:
 * the HTTP details are translated into a reason and a user-facing message.
 */
export class SignUpError extends Error {
  constructor(
    readonly reason: SignUpFailureReason,
    message: string,
  ) {
    super(message);
    this.name = 'SignUpError';
  }
}
