import { Sequelize } from 'sequelize';
import { config } from '../config';
import definePollutions from './pollutions.model';

// Render's external database URLs require SSL; local and internal ones do not.
const useSsl = config.databaseUrl.includes('.render.com');

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  dialectOptions: useSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  logging: false,
});

const db = {
  sequelize,
  pollutions: definePollutions(sequelize),
};

/** Creates the tables if they do not exist, and fills `pollution` when it is empty. */
export async function initDatabase(): Promise<void> {
  await sequelize.sync();

  if ((await db.pollutions.count()) === 0) {
    // Sample data (fictitious), so the API returns something right after deployment.
    await db.pollutions.bulkCreate([
      {
        titre: 'Sacs plastiques sur la plage',
        type: 'Plastique',
        description: 'Une vingtaine de sacs plastiques laissés près du poste de secours.',
        dateObservation: '2026-09-12',
        lieu: 'Plage de test, Zone A',
        latitude: 43.2965,
        longitude: 5.3698,
      },
      {
        titre: 'Fûts abandonnés en bord de rivière',
        type: 'Chimique',
        description: 'Trois fûts rouillés, odeur de solvant.',
        dateObservation: '2026-10-03',
        lieu: 'Berges de test, Zone B',
        latitude: 45.764,
        longitude: 4.8357,
      },
      {
        titre: 'Gravats dans un chemin forestier',
        type: 'Dépôt sauvage',
        description: 'Gravats et plaques de plâtre déposés sur environ 10 m².',
        dateObservation: '2026-10-18',
        lieu: 'Forêt de test, Zone C',
        latitude: 48.8566,
        longitude: 2.3522,
      },
    ]);
  }
}

export default db;
