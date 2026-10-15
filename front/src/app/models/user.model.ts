/** Values bound to the sign-up form (template-driven). */
export interface User {
  login: string;
  password: string;
  passwordConfirmation: string;
  lastName: string;
  firstName: string;
  email: string;
}

/** Payload sent to `POST /users`: the confirmation field never leaves the client. */
export type SignUpRequest = Omit<User, 'passwordConfirmation'>;

/** User returned by the API once created: no password, plus server-generated fields. */
export interface RegisteredUser {
  id: number;
  login: string;
  lastName: string;
  firstName: string;
  email: string;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
}

/** Error body returned by the API on 4xx responses. */
export interface ApiErrorBody {
  message: string;
  field?: keyof SignUpRequest;
}

export function createEmptyUser(): User {
  return {
    login: '',
    password: '',
    passwordConfirmation: '',
    lastName: '',
    firstName: '',
    email: '',
  };
}
