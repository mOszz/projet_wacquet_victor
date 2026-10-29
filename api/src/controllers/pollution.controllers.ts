import { Request, Response } from 'express';
import db from '../models';

/** GET /api/pollutions: every pollution, most recent observation first. */
export async function getAll(_req: Request, res: Response): Promise<void> {
  try {
    const pollutions = await db.pollutions.findAll({ order: [['dateObservation', 'DESC']] });
    res.json(pollutions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des pollutions.' });
  }
}

/** GET /api/pollutions/:id: one pollution, 404 if it does not exist. */
export async function getById(req: Request<{ id: string }>, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: 'Identifiant invalide.' });
    return;
  }

  try {
    const pollution = await db.pollutions.findByPk(id);
    if (pollution) {
      res.json(pollution);
    } else {
      res.status(404).json({ message: `Aucune pollution avec l'id ${id}.` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la pollution.' });
  }
}
