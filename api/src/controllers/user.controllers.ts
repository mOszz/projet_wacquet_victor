import { Request, Response } from 'express';
import { userService } from '../services/user.service';

// Controllers only translate HTTP <-> service calls; the logic lives in user.service.ts.

/** GET /api/users */
export async function getAll(_req: Request, res: Response): Promise<void> {
  res.json(await userService.findAll());
}

/** POST /api/users */
export async function create(req: Request, res: Response): Promise<void> {
  res.status(201).json(await userService.create(req.body ?? {}));
}
