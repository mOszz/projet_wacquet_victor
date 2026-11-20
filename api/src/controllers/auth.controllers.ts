import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

/** POST /api/login: fictitious authentication, returns the user (without password) or 401. */
export async function login(req: Request, res: Response): Promise<void> {
  const { login, password } = req.body ?? {};
  if (typeof login !== 'string' || typeof password !== 'string') {
    res.status(400).json({ message: 'Identifiant et mot de passe requis.' });
    return;
  }
  res.json(await authService.login(login, password));
}
