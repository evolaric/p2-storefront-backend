import Client from '../../database';
import supertest from 'supertest';
import app from '../../server';
import { User } from '../../models/users';

const request = supertest(app);

describe('User Enpoint Testing', (): void => {
  let token: string;

  beforeAll(async () => {
    const user: User = {
      user_name: 'AuthorityFigure',
      first_name: 'Jean',
      last_name: 'Fossburrey',
      password: 'passwordAlpha'
    };

    try {
      await request
        .post('/users')
        .send(user)
        .then((res) => {
          token = res.text;
        });
      console.log(token);
    } catch (err) {
      throw new Error();
    }
  });

  afterAll(async (): Promise<void> => {
    const conn = await Client.connect();
    const sql = 'TRUNCATE users RESTART IDENTITY CASCADE';
    await conn.query(sql);
    conn.release();
  });

  it('POST request to /users with proper data should create a new user and return a token', async (): Promise<void> => {
    const user: User = {
      user_name: 'TestUser',
      first_name: 'Generic',
      last_name: 'Name',
      password: 'passwordBeta'
    };
    try {
      await request
        .post('/users')
        .send(user)
        .then((res) => {
          expect(res.text).toBeDefined();
          expect(res.statusCode).toEqual(201);
        });
    } catch (err) {
      console.log(err);
      throw new Error();
    }
  });

  it('POST request to /users with improper data should', async (): Promise<void> => {
    const brokenRequest = async (): Promise<void> => {
      try {
        await request
          .post('/users')
          .send({
            user_name: 'TestUser',
            password: 'passwordBeta'
          })
          .then((res) => {
            expect(res.statusCode).toEqual(500);
          });
      } catch (err) {
        console.log(err);
        throw new Error();
      }
    };
    await expectAsync(brokenRequest()).toBeRejectedWith(
      new Error(`Could not find a status for order# 2133. Error: TypeError: Cannot read property 'status' of undefined`)
    );
  });
});
