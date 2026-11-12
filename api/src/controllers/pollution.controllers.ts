import { Request, Response } from 'express';
import db from '../models';
import { PollutionCreationAttributes } from '../models/pollutions.model';

// Errors thrown here (invalid data, database down...) are sent by the error handler in index.ts.

type IdParams = { id: string };

/** Keeps only the editable fields: the id comes from the URL or the database, never from the body. */
function toPollutionData(body: Partial<PollutionCreationAttributes> = {}): PollutionCreationAttributes {
  const {
    titre,
    type,
    description,
    dateObservation,
    lieu,
    latitude,
    longitude,
    indiceDangerosite,
    photoUrl,
  } = body;
  // Missing required fields are left undefined and rejected by the model validation (400).
  return {
    titre,
    type,
    description,
    dateObservation,
    lieu,
    latitude,
    longitude,
    indiceDangerosite,
    photoUrl: photoUrl || null,
  } as PollutionCreationAttributes;
}

/** Loads the pollution of `:id`, or answers 404 and returns null. */
async function findPollution(req: Request<IdParams>, res: Response) {
  const id = Number(req.params.id);
  const pollution = Number.isInteger(id) ? await db.pollutions.findByPk(id) : null;
  if (!pollution) {
    res.status(404).json({ message: `Aucune pollution avec l'id ${req.params.id}.` });
  }
  return pollution;
}

/** GET /api/pollutions: every pollution, most recent observation first. */
export async function getAll(_req: Request, res: Response): Promise<void> {
  res.json(await db.pollutions.findAll({ order: [['dateObservation', 'DESC']] }));
}

/** GET /api/pollutions/:id */
export async function getById(req: Request<IdParams>, res: Response): Promise<void> {
  const pollution = await findPollution(req, res);
  if (pollution) {
    res.json(pollution);
  }
}

/** POST /api/pollutions */
export async function create(req: Request, res: Response): Promise<void> {
  const pollution = await db.pollutions.create(toPollutionData(req.body));
  res.status(201).json(pollution);
}

/** PUT /api/pollutions/:id: replaces every editable field. */
export async function update(req: Request<IdParams>, res: Response): Promise<void> {
  const pollution = await findPollution(req, res);
  if (pollution) {
    res.json(await pollution.update(toPollutionData(req.body)));
  }
}

/** DELETE /api/pollutions/:id */
export async function remove(req: Request<IdParams>, res: Response): Promise<void> {
  const pollution = await findPollution(req, res);
  if (pollution) {
    await pollution.destroy();
    res.status(204).end();
  }
}
