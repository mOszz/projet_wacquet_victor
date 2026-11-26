import { DataTypes, Model, ModelStatic, Optional, Sequelize } from 'sequelize';

// Same values as POLLUTION_TYPES in the Angular app.
export const POLLUTION_TYPES = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];

// Same fields as the Angular `Pollution` model (front/pollution/src/app/models),
// except the photo: stored here as bytes, exposed to the front as a URL.
export interface PollutionAttributes {
  id: number;
  titre: string;
  type: string;
  description: string;
  dateObservation: string;
  lieu: string;
  latitude: number;
  longitude: number;
  indiceDangerosite: number;
  /** Image bytes (BYTEA). Excluded from queries by default: only the photo route reads it. */
  photo: Buffer | null;
  /** e.g. "image/png"; null when there is no photo. */
  photoMimeType: string | null;
}

export type PollutionCreationAttributes = Optional<
  PollutionAttributes,
  'id' | 'photo' | 'photoMimeType'
>;

export interface PollutionInstance
  extends Model<PollutionAttributes, PollutionCreationAttributes>, PollutionAttributes {}

export type PollutionModel = ModelStatic<PollutionInstance>;

/** Defines the `pollution` table. Validation rules reject invalid data with a 400. */
export default function definePollutions(sequelize: Sequelize): PollutionModel {
  return sequelize.define<PollutionInstance>(
    'pollution',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      titre: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
      type: { type: DataTypes.STRING, allowNull: false, validate: { isIn: [POLLUTION_TYPES] } },
      description: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
      // DATEONLY is returned as "YYYY-MM-DD", the format expected by the front.
      dateObservation: { type: DataTypes.DATEONLY, allowNull: false, validate: { isDate: true } },
      lieu: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
      latitude: { type: DataTypes.DOUBLE, allowNull: false, validate: { min: -90, max: 90 } },
      longitude: { type: DataTypes.DOUBLE, allowNull: false, validate: { min: -180, max: 180 } },
      // Danger index: 0-20 Faible, 21-50 Modérée, 51-100 Élevée, 101+ Dangereuse (computed by the front).
      indiceDangerosite: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      photo: { type: DataTypes.BLOB, allowNull: true },
      photoMimeType: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: 'pollution',
      timestamps: false,
      // camelCase in the code, snake_case columns in PostgreSQL (date_observation, photo_mime_type).
      underscored: true,
      // Lists and details never load the image bytes, which can weigh several MB.
      defaultScope: { attributes: { exclude: ['photo'] } },
    },
  );
}
