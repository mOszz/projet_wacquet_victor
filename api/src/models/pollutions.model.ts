import { DataTypes, Model, ModelStatic, Optional, Sequelize } from 'sequelize';

// Same fields as the Angular `Pollution` model (front/pollution/src/app/models).
export interface PollutionAttributes {
  id: number;
  titre: string;
  type: string;
  description: string;
  dateObservation: string;
  lieu: string;
  latitude: number;
  longitude: number;
  photoUrl: string | null;
}

type PollutionCreationAttributes = Optional<PollutionAttributes, 'id' | 'photoUrl'>;

export interface PollutionInstance
  extends Model<PollutionAttributes, PollutionCreationAttributes>,
    PollutionAttributes {}

export type PollutionModel = ModelStatic<PollutionInstance>;

/** Defines the `pollution` table. */
export default function definePollutions(sequelize: Sequelize): PollutionModel {
  return sequelize.define<PollutionInstance>(
    'pollution',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      titre: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      // DATEONLY is returned as "YYYY-MM-DD", the format expected by the front.
      dateObservation: { type: DataTypes.DATEONLY, allowNull: false },
      lieu: { type: DataTypes.STRING, allowNull: false },
      latitude: { type: DataTypes.DOUBLE, allowNull: false },
      longitude: { type: DataTypes.DOUBLE, allowNull: false },
      photoUrl: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: 'pollution',
      timestamps: false,
      // camelCase in the code, snake_case columns in PostgreSQL (date_observation, photo_url).
      underscored: true,
    },
  );
}
