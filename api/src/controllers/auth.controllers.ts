import { Request, Response } from 'express';
import db from '../models';
import { verifyPassword } from '../models/users.model';

/**
 * POST /api/login: fictitious authentication (no token).
 * Checks login + password and returns the user without its password, or 401.
 */
export async function login(req: Request, res: Response): Promise<void> {
  const { login, password } = req.body ?? {};
  if (typeof login !== 'string' || typeof password !== 'string') {
    res.status(400).json({ message: 'Identifiant et mot de passe requis.' });
    return;
  }

  // `unscoped()` because the default scope hides the password, needed here for the check.
  const user = await db.users.unscoped().findOne({ where: { login } });
  if (!user || !verifyPassword(password, user.password)) {
    // Same message in both cases: do not reveal which logins exist.
    res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' });
    return;
  }

  const { password: _hash, ...publicUser } = user.get();
  res.json(publicUser);
}
