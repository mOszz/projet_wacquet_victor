import { Application } from 'express';
import pollutionRoutes from './pollution.routes';

/** Mounts every resource under /api. */
export default function initRoutes(app: Application): void {
  app.use('/api/pollutions', pollutionRoutes);
}
