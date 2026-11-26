import { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import { HttpError } from '../errors/http-error';

/** Unknown routes answer JSON, like the rest of the API. */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ message: 'Route inconnue.' });
}

/**
 * Single place where errors become HTTP responses (like a Spring @ControllerAdvice).
 * Express 5 forwards the errors thrown by async controllers here.
 * Express recognises an error handler by its 4 parameters, so `_next` must stay.
 */
export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message });
  } else if (error instanceof UniqueConstraintError) {
    res.status(409).json({ message: 'Cet identifiant ou cet e-mail est déjà utilisé.' });
  } else if (error instanceof ValidationError) {
    res.status(400).json({ message: error.errors.map((e) => e.message).join(' ') });
  } else if (error instanceof MulterError) {
    const tooLarge = error.code === 'LIMIT_FILE_SIZE';
    res.status(tooLarge ? 413 : 400).json({
      message: tooLarge
        ? 'La photo dépasse la taille maximale (5 Mo).'
        : 'Envoi de fichier invalide.',
    });
  } else if (error instanceof SyntaxError) {
    res.status(400).json({ message: 'Corps de requête JSON invalide.' });
  } else {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
}
