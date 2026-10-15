// TEST DATA ONLY — fictitious values shared by the unit tests (*.spec.ts).
// Never imported by the application code.
import { RegisteredUser, SignUpRequest, User } from '../models/user.model';

/** What John Doe types in the sign-up form. */
export const JOHN_DOE_FORM: User = {
  login: 'john.doe',
  password: 'Password123',
  passwordConfirmation: 'Password123',
  lastName: 'Doe',
  firstName: 'John',
  email: 'john.doe@example.com',
};

/** Payload sent to the API for John Doe (no password confirmation). */
export const JOHN_DOE_REQUEST: SignUpRequest = {
  login: JOHN_DOE_FORM.login,
  password: JOHN_DOE_FORM.password,
  lastName: JOHN_DOE_FORM.lastName,
  firstName: JOHN_DOE_FORM.firstName,
  email: JOHN_DOE_FORM.email,
};

/** Account returned by the API once John Doe is registered (fixed date for stable tests). */
export const JOHN_DOE_REGISTERED: RegisteredUser = {
  id: 2,
  login: JOHN_DOE_FORM.login,
  lastName: JOHN_DOE_FORM.lastName,
  firstName: JOHN_DOE_FORM.firstName,
  email: JOHN_DOE_FORM.email,
  createdAt: '2026-01-15T10:00:00.000Z',
};
