import { HttpError } from '../errors/http-error';
import db from '../models';
import { PollutionCreationAttributes, PollutionInstance } from '../models/pollutions.model';

/** Fields a client may set: id and photo are never taken from the request body. */
export type PollutionData = Omit<PollutionCreationAttributes, 'id' | 'photo' | 'photoMimeType'>;

/** Uploaded image, as read by the upload middleware. */
export interface PhotoFile {
  buffer: Buffer;
  mimetype: string;
}

/** Business logic of the pollutions: the controller only deals with HTTP. */
class PollutionService {
  /** Every pollution, most recent observation first (without image bytes). */
  findAll(): Promise<PollutionInstance[]> {
    return db.pollutions.findAll({ order: [['dateObservation', 'DESC']] });
  }

  /** The pollution, or a 404 error. */
  async findById(id: number): Promise<PollutionInstance> {
    const pollution = Number.isInteger(id) ? await db.pollutions.findByPk(id) : null;
    if (!pollution) {
      throw new HttpError(404, `Aucune pollution avec l'id ${id}.`);
    }
    return pollution;
  }

  async create(data: PollutionData, photo?: PhotoFile): Promise<PollutionInstance> {
    const created = await db.pollutions.create({ ...pick(data), ...photoFields(photo) });
    // Reload through the default scope so the bytes are not sent back.
    return this.findById(created.id);
  }

  /**
   * Replaces every editable field. The photo is replaced if a new one is sent,
   * removed if `removePhoto` is true, and kept otherwise.
   */
  async update(
    id: number,
    data: PollutionData,
    photo?: PhotoFile,
    removePhoto = false,
  ): Promise<PollutionInstance> {
    const pollution = await this.findById(id);
    const photoChange = photo
      ? photoFields(photo)
      : removePhoto
        ? { photo: null, photoMimeType: null }
        : {};
    await pollution.update({ ...pick(data), ...photoChange });
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const pollution = await this.findById(id);
    await pollution.destroy();
  }

  /** Image bytes and type, or a 404 error when the pollution has no photo. */
  async findPhoto(id: number): Promise<PhotoFile> {
    const pollution = Number.isInteger(id)
      ? await db.pollutions.unscoped().findByPk(id, { attributes: ['photo', 'photoMimeType'] })
      : null;
    if (!pollution?.photo || !pollution.photoMimeType) {
      throw new HttpError(404, 'Aucune photo pour cette pollution.');
    }
    return { buffer: pollution.photo, mimetype: pollution.photoMimeType };
  }
}

/** Keeps only the editable fields (missing ones are rejected by the model validation: 400). */
function pick(data: Partial<PollutionData>): PollutionData {
  const {
    titre,
    type,
    description,
    dateObservation,
    lieu,
    latitude,
    longitude,
    indiceDangerosite,
  } = data;
  return {
    titre,
    type,
    description,
    dateObservation,
    lieu,
    latitude,
    longitude,
    indiceDangerosite,
  } as PollutionData;
}

function photoFields(photo?: PhotoFile) {
  return photo ? { photo: photo.buffer, photoMimeType: photo.mimetype } : {};
}

export const pollutionService = new PollutionService();
