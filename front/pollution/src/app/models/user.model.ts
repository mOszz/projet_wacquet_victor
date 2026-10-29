export interface User {
  login: string;
  password: string;
  passwordConfirmation: string;
  lastName: string;
  firstName: string;
  email: string;
}

/** User returned by the API once created (no password). */
export interface RegisteredUser {
  id: number;
  login: string;
  lastName: string;
  firstName: string;
  email: string;
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
