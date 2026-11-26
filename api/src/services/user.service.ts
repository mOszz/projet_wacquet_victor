import db from '../models';
import { UserAttributes, UserCreationAttributes } from '../models/users.model';

/** User as exposed by the API: never with its password. */
export type PublicUser = Omit<UserAttributes, 'password'>;

/** Business logic of the users. */
class UserService {
  /** Every user (the password is excluded by the model's default scope). */
  findAll(): Promise<PublicUser[]> {
    return db.users.findAll({ order: [['id', 'ASC']] });
  }

  /** Creates a user (password hashed by the model). Duplicate login/e-mail -> 409. */
  async create(data: UserCreationAttributes): Promise<PublicUser> {
    const { login, password, lastName, firstName, email } = data;
    const user = await db.users.create({ login, password, lastName, firstName, email });
    return toPublicUser(user.get());
  }
}

export function toPublicUser({ password: _password, ...user }: UserAttributes): PublicUser {
  return user;
}

export const userService = new UserService();
