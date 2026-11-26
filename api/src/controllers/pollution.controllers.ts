import { Request, Response } from 'express';
import { PollutionInstance } from '../models/pollutions.model';
import { PollutionData, pollutionService } from '../services/pollution.service';

// Controllers only translate HTTP <-> service calls; the logic lives in pollution.service.ts.
// Errors (404, invalid data...) are thrown by the service and sent by error.middleware.ts.

type IdParams = { id: string };

/** GET /api/pollutions */
export async function getAll(req: Request, res: Response): Promise<void> {
  const pollutions = await pollutionService.findAll();
  res.json(pollutions.map((p) => toResponse(p, req)));
}

/** GET /api/pollutions/:id */
export async function getById(req: Request<IdParams>, res: Response): Promise<void> {
  res.json(toResponse(await pollutionService.findById(Number(req.params.id)), req));
}

/** POST /api/pollutions: JSON, or multipart/form-data with `data` (JSON) and an optional `photo`. */
export async function create(req: Request, res: Response): Promise<void> {
  const created = await pollutionService.create(readData(req), req.file);
  res.status(201).json(toResponse(created, req));
}

/** PUT /api/pollutions/:id: same body as POST, plus `removePhoto: true` to delete the photo. */
export async function update(req: Request<IdParams>, res: Response): Promise<void> {
  const data = readData(req);
  const updated = await pollutionService.update(
    Number(req.params.id),
    data,
    req.file,
    data.removePhoto === true,
  );
  res.json(toResponse(updated, req));
}

/** DELETE /api/pollutions/:id */
export async function remove(req: Request<IdParams>, res: Response): Promise<void> {
  await pollutionService.remove(Number(req.params.id));
  res.status(204).end();
}

/** GET /api/pollutions/:id/photo: the image itself, used as `<img src>` by the front. */
export async function getPhoto(req: Request<IdParams>, res: Response): Promise<void> {
  const photo = await pollutionService.findPhoto(Number(req.params.id));
  // The browser revalidates (ETag) instead of showing an old photo after a replacement.
  res.set('Cache-Control', 'no-cache').type(photo.mimetype).send(photo.buffer);
}

/** Pollution fields: the `data` part of a multipart request, or the JSON body. */
function readData(req: Request): PollutionData & { removePhoto?: boolean } {
  // An invalid `data` JSON throws a SyntaxError, answered with a 400.
  return typeof req.body?.data === 'string' ? JSON.parse(req.body.data) : (req.body ?? {});
}

/** JSON sent to the front: no image bytes, but the URL where the photo can be loaded. */
function toResponse(pollution: PollutionInstance, req: Request) {
  const { photo: _photo, photoMimeType, ...fields } = pollution.get();
  const photoUrl = photoMimeType
    ? `${req.protocol}://${req.get('host')}/api/pollutions/${pollution.id}/photo`
    : null;
  return { ...fields, photoUrl };
}
