import { Request, Response } from 'express';
import db from '../models';
import { UserCreationAttributes } from '../models/users.model';

// Errors thrown here (invalid data, login already used...) are sent by the error handler in index.ts.

/** GET /api/users: every user, without passwords (excluded by the model's default scope). */
export async function getAll(_req: Request, res: Response): Promise<void> {
  res.json(await db.users.findAll({ order: [['id', 'ASC']] }));
}

/** POST /api/users: creates a user and returns it without its password. */
export async function create(req: Request, res: Response): Promise<void> {
  const { login, password, lastName, firstName, email } = req.body ?? {};
  const user = await db.users.create({
    login,
    password,
    lastName,
    firstName,
    email,
  } as UserCreationAttributes);

  const { password: _hash, ...publicUser } = user.get();
  res.status(201).json(publicUser);
}
