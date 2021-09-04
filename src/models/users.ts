import Client from '../database';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

export type User = {
  id?: number;
  user_name: string;
  first_name: string;
  last_name: string;
  admin?: boolean;
  password: string;
};

export type Token = {
  id: number;
  user_name: string;
  first_name?: string;
  last_name?: string;
  admin?: boolean;
  iat: number;
  exp: number;
};

export type UserQuery = {
  id?: number | undefined;
  user_name?: string | undefined;
};

export type LoginDetails = {
  user_name: string;
  password: string;
};

export type LookupArrayId = [string, number];

export type LookupArrayUserName = [string, string];

class UserModelError extends Error {
  constructor(message: string, stack: string) {
    super();
    Error.captureStackTrace(this, UserModelError);
    this.name = this.constructor.name;
    this.message = message || 'Something went wrong in the user model.';
    this.stack = stack;
  }
}

export class UserStore {
  #pepper = process.env.BCRYPT_PASSWORD;

  #saltRounds: number = parseInt(process.env.SALT_ROUNDS as string);

  #iat: number = new Date().getTime();
  #exp: number = new Date().getTime() + 2592000000;

  async authenticate(l: LoginDetails): Promise<Token | null | Error> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE user_name=($1)';
      const result = await conn.query(sql, [l.user_name]);
      conn.release();

      if (!result.rows.length) {
        return null;
      }

      const user = result.rows[0];

      if (user.admin) {
        if (bcrypt.compareSync(l.password + this.#pepper + l.user_name, user.password_digest)) {
          const adminToken: Token = {
            id: user.id,
            user_name: user.user_name,
            first_name: user.first_name,
            last_name: user.last_name,
            admin: user.admin,
            iat: this.#iat,
            exp: this.#exp
          };
          return adminToken;
        } else {
          return null;
        }
      } else if (bcrypt.compareSync(l.password + this.#pepper + l.user_name, user.password_digest)) {
        const userToken: Token = {
          id: user.id,
          user_name: user.user_name,
          first_name: user.first_name,
          last_name: user.last_name,
          iat: this.#iat,
          exp: this.#exp
        };
        return userToken;
      } else {
        return null;
      }
    } catch (err) {
      throw new UserModelError(err.message, err.stack);
    }
  }

  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new UserModelError(err.message, err.stack);
    }
  }

  async create(u: User): Promise<Token> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (user_name, first_name, last_name, password_digest) VALUES ($1, $2, $3, $4) RETURNING *';

      const hash = bcrypt.hashSync(u.password + this.#pepper + u.user_name, this.#saltRounds);
      const result = await conn.query(sql, [u.user_name, u.first_name, u.last_name, hash]);
      conn.release();
      const token: Token = {
        id: result.rows[0].id,
        user_name: result.rows[0].user_name,
        first_name: result.rows[0].first_name,
        last_name: result.rows[0].last_name,
        iat: this.#iat,
        exp: this.#exp
      };
      return token;
    } catch (err) {
      throw new UserModelError(err.message, err.stack);
    }
  }

  async show(u: UserQuery): Promise<User> {
    try {
      async function checkBy(u: UserQuery): Promise<LookupArrayId | LookupArrayUserName> {
        if (u.id !== undefined) {
          const sql: LookupArrayId = ['SELECT * FROM users WHERE id=($1)', u.id];
          return sql;
        } else if (u.user_name !== undefined) {
          const sql: LookupArrayUserName = ['SELECT * FROM users WHERE user_name=($1)', u.user_name];
          return sql;
        } else
          throw new Error(
            'You must provide a valid user Id (number) or valid user_name (string) to retrieve a user record'
          );
      }
      const conn = await Client.connect();
      const sql = await checkBy(u);
      const result = await conn.query(sql[0], [sql[1]]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new UserModelError(err.message, err.stack);
    }
  }
}
