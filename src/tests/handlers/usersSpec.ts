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
    } catch (err) {
      throw new Error(err);
    }
  });

  afterAll(async (): Promise<void> => {
    try {
      const conn = await Client.connect();
      const sql = 'TRUNCATE users RESTART IDENTITY CASCADE';
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(err);
    }
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
      throw new Error(err);
    }
  });

  it('GET request to /user/show route should return 403 when attempting to access without a token', async (): Promise<void> => {
    try {
      await request.get('/users/show').send({ id: 1 }).expect(403);
    } catch (err) {
      throw new Error(err);
    }
  });

  it('GET request to /user/show route should return a user by Id when provided with a token', async (): Promise<void> => {
    try {
      await request
        .get('/users/show')
        .set('Authorization', 'Bearer ' + token)
        .send({ id: 1 })
        .expect(200);
    } catch (err) {
      throw new Error(err);
    }
  });

  it('GET request to /user/index route should return 403 when attempting to access without a token', async (): Promise<void> => {
    try {
      await request.get('/users/show').send({ id: 1 }).expect(403);
    } catch (err) {
      throw new Error(err);
    }
  });

  it('GET request to /user/index route should return a list of users if provided with a token', async (): Promise<void> => {
    try {
      await request
        .get('/users/index')
        .set('Authorization', 'Bearer ' + token)
        .expect(200);
    } catch (err) {
      throw new Error(err);
    }
  });

  it('POST request to /user/login route should return as token when provided valid user_name and password', async (): Promise<void> => {
    const user = {
      user_name: 'TestUser',
      password: 'passwordBeta'
    };
    try {
      await request
        .post('/users/login')
        .send(user)
        .expect(200)
        .then((res) => {
          expect(res.text).toBeDefined;
        });
    } catch (err) {
      throw new Error(err);
    }
  });

  it('POST request to /user/login route should return 401 when provided with invalid user_name or password', async (): Promise<void> => {
    const user = {
      user_name: 'TestUser',
      password: 'passwordBeta22'
    };
    try {
      await request.post('/users/login').send(user).expect(401);
    } catch (err) {
      throw new Error(err);
    }
  });
});
