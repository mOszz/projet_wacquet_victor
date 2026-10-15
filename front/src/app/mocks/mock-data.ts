// MOCK DATA — fictitious accounts known by the fake backend (mock API).
// Used only while `environment.useMockApi` is true; delete with the mocks/
// folder once the real API is available.
import { RegisteredUser } from '../models/user.model';

/** Accounts that "already exist" when the app starts: lets you try the "already used" error. */
export const MOCK_EXISTING_USERS: readonly RegisteredUser[] = [
  {
    id: 1,
    login: 'jane.doe',
    lastName: 'Doe',
    firstName: 'Jane',
    email: 'jane.doe@example.com',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];
