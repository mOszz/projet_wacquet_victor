import { Application } from 'express';
import authRoutes from './auth.routes';
import pollutionRoutes from './pollution.routes';
import userRoutes from './user.routes';

/** Mounts every resource under /api. */
export default function initRoutes(app: Application): void {
  app.use('/api/login', authRoutes);
  app.use('/api/pollutions', pollutionRoutes);
  app.use('/api/users', userRoutes);
}
