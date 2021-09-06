import Client from '../../database';
import supertest from 'supertest';
import app from '../../server';
import { User } from '../../models/users';
import { Product } from '../../models/products';
import path from 'path';
import fs from 'fs';

const seedfile = path.join(__dirname + '../../sql-product-seed.sql');
const seed = fs.readFileSync(seedfile).toString();
const request = supertest(app);

describe('Products Endpoint Testing', (): void => {
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
    } catch (err) {
      throw new Error(err);
    }
  });

  afterAll(async (): Promise<void> => {
    try {
      const conn = await Client.connect();
      const sql = 'TRUNCATE users, products, categories RESTART IDENTITY CASCADE';
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(err);
    }
  });

  it('GET request to /products should return a list of Products', async (): Promise<void> => {
    try {
      await request
        .get('/products')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toEqual(21);
        });
    } catch (err) {
      throw new Error(err);
    }
  });

  it('GET request to /products/:id should return a Product', async (): Promise<void> => {
    try {
      await request
        .get('/products/2')
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: 2,
            product_name: 'Item 2',
            price: '38.99',
            info: 'Some descriptive text',
            category: 1
          });
        });
    } catch (err) {
      throw new Error(err);
    }
  });

  it('POST request by authorized User to /products/:id should return a Product', async (): Promise<void> => {
    try {
      const newProduct: Product = {
        product_name: 'Item 22',
        price: 65.99,
        info: 'Some descriptive text',
        category: 4
      };
      await request
        .post('/products')
        .set('Authorization', 'Bearer ' + token)
        .send(newProduct)
        .expect(201)
        .then((res) => {
          expect(res.body).toEqual({
            id: 22,
            product_name: 'Item 22',
            price: '65.99',
            info: 'Some descriptive text',
            category: 4
          });
        });
    } catch (err) {
      throw new Error(err);
    }
  });

  it('POST request without token to /products/:id should return 401', async (): Promise<void> => {
    try {
      const newProduct: Product = {
        product_name: 'Item 22',
        price: 65.99,
        info: 'Some descriptive text',
        category: 4
      };
      await request.post('/products').send(newProduct).expect(401);
    } catch (err) {
      throw new Error(err);
    }
  });
});
