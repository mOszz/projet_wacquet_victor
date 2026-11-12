import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import { config } from './config';
import { initDatabase } from './models';
import initRoutes from './routes';

const app = express();

// The Angular front is served from another domain: allow cross-origin calls.
app.use(cors());
app.use(express.json());

// Used by Render to check that the service is up (healthCheckPath in render.yaml).
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

initRoutes(app);

// Unknown routes answer JSON, like the rest of the API.
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route inconnue.' });
});

// Errors thrown by the controllers end up here (Express 5 forwards rejected promises).
// Express recognises an error handler by its 4 parameters, so `_next` must stay.
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof UniqueConstraintError) {
    res.status(409).json({ message: 'Cet identifiant ou cet e-mail est déjà utilisé.' });
  } else if (error instanceof ValidationError) {
    res.status(400).json({ message: error.errors.map((e) => e.message).join(' ') });
  } else if (error instanceof SyntaxError) {
    res.status(400).json({ message: 'Corps de requête JSON invalide.' });
  } else {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

// Start listening only once the database is ready.
initDatabase()
  .then(() => {
    // 0.0.0.0 so the server is reachable from outside the container (Render).
    app.listen(config.port, '0.0.0.0', () => {
      console.log(`API listening on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Database initialisation failed:', error);
    process.exit(1);
  });
