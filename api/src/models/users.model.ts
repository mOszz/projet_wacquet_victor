import { randomBytes, scryptSync } from 'node:crypto';
import { DataTypes, Model, ModelStatic, Optional, Sequelize } from 'sequelize';

// Same fields as the Angular `User` model, without the password confirmation.
export interface UserAttributes {
  id: number;
  login: string;
  password: string;
  lastName: string;
  firstName: string;
  email: string;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

export type UserModel = ModelStatic<UserInstance>;

/** Stores "salt:hash" so the plain password never reaches the database. */
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

/** Defines the `users` table. Login and e-mail are unique (409 when already used). */
export default function defineUsers(sequelize: Sequelize): UserModel {
  return sequelize.define<UserInstance>(
    'user',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      login: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { len: [3, 255] } },
      password: { type: DataTypes.STRING, allowNull: false, validate: { len: [8, 255] } },
      lastName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
      firstName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    },
    {
      tableName: 'users',
      timestamps: false,
      underscored: true,
      // The password is never read back by queries...
      defaultScope: { attributes: { exclude: ['password'] } },
      hooks: {
        // ...and is hashed once validated (validation checks the plain password length).
        beforeCreate: (user) => {
          user.password = hashPassword(user.password);
        },
      },
    },
  );
}
