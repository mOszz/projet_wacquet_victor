import { HttpError } from '../errors/http-error';
import db from '../models';
import { verifyPassword } from '../models/users.model';
import { PublicUser, toPublicUser } from './user.service';

/** Fictitious authentication: checks the credentials, no token is issued. */
class AuthService {
  /** The user matching login + password, or a 401 error. */
  async login(login: string, password: string): Promise<PublicUser> {
    // `unscoped()` because the default scope hides the password, needed here for the check.
    const user = await db.users.unscoped().findOne({ where: { login } });
    if (!user || !verifyPassword(password, user.password)) {
      // Same message in both cases: do not reveal which logins exist.
      throw new HttpError(401, 'Identifiant ou mot de passe incorrect.');
    }
    return toPublicUser(user.get());
  }
}

export const authService = new AuthService();
