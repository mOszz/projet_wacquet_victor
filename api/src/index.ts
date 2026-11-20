import cors from 'cors';
import express from 'express';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { initDatabase } from './models';
import initRoutes from './routes';

const app = express();

// Render serves the API through a proxy: trust its X-Forwarded-* headers, so
// `req.protocol` is "https" in the photo URLs built by the controllers.
app.set('trust proxy', 1);

// The Angular front is served from another domain: allow cross-origin calls.
app.use(cors());
app.use(express.json());

// Used by Render to check that the service is up (healthCheckPath in render.yaml).
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

initRoutes(app);

app.use(notFoundHandler);
app.use(errorHandler);

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
