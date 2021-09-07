import Client from '../../database';
import supertest from 'supertest';
import app from '../../server';
import { User } from '../../models/users';
import path from 'path';
import fs from 'fs';

const seedfile = path.join(__dirname + '../../sql-orders-seed.sql');
const seed = fs.readFileSync(seedfile).toString();
const request = supertest(app);

describe('Orders endpoint testing', (): void => {
  let token: string;

  beforeAll(async (): Promise<void> => {
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
      const conn = await Client.connect();
      await conn.query(seed);
      conn.release();
    } catch (err) {
      throw new Error(err);
    }
  });

  afterAll(async (): Promise<void> => {
    try {
      const conn = await Client.connect();
      const sql = 'TRUNCATE users, products, order_details, orders, categories RESTART IDENTITY CASCADE';
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(err);
    }
  });

  it("GET request to /orders should return token holder's current order", async (): Promise<void> => {
    try {
      await request
        .get('/orders')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: 5,
            user_id: 1,
            details: [
              { id: 9, order_id: 5, product_id: 9, quantity: 6 },
              { id: 10, order_id: 5, product_id: 10, quantity: 6 }
            ],
            status: false,
            created_at: 1111115,
            closed_at: null
          });
        });
    } catch (err) {
      throw new Error(err);
    }
  });

  it('GET request to /orders without a token should return 401', async (): Promise<void> => {
    try {
      await request.get('/orders').expect(401);
    } catch (err) {
      throw new Error(err);
    }
  });

  it("PUT request to /orders should modify token holder's current order", async (): Promise<void> => {
    try {
      const modifiedOrder = {
        id: 5,
        status: true
      };
      await request
        .put('/orders')
        .set('Authorization', 'Bearer ' + token)
        .send(modifiedOrder)
        .expect(200)
        .then((res) => {
          expect(res.body.status).toEqual(true);
        });
    } catch (err) {
      throw new Error(err);
    }
  });

  it('PUT request to /orders without token should return 401', async (): Promise<void> => {
    try {
      const modifiedOrder = {
        id: 5,
        status: true
      };
      await request.put('/orders').send(modifiedOrder).expect(401);
    } catch (err) {
      throw new Error(err);
    }
  });
});
