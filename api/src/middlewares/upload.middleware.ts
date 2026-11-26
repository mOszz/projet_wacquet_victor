import multer from 'multer';
import { HttpError } from '../errors/http-error';

export const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Reads the optional `photo` file of a multipart/form-data request into memory
 * (`req.file.buffer`), to be stored in the database. JSON requests pass through untouched.
 */
export const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PHOTO_SIZE, files: 1 },
  fileFilter: (_req, file, accept) => {
    if (PHOTO_TYPES.includes(file.mimetype)) {
      accept(null, true);
    } else {
      accept(new HttpError(400, 'Format de photo non supporté (JPEG, PNG, WebP ou GIF).'));
    }
  },
}).single('photo');
