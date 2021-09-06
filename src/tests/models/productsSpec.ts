import Client from '../../database';
import { ProductsStore } from '../../models/products';
import path from 'path';
import fs from 'fs';

const seedfile = path.join(__dirname + '../../sql-product-seed.sql');
const seed = fs.readFileSync(seedfile).toString();

const store = new ProductsStore();

describe('Products Model Testing', (): void => {
  beforeAll(async (): Promise<void> => {
    try {
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
  describe('Check if methods are defined', (): void => {
    it('should have an index method', (): void => {
      expect(store.index).toBeDefined;
    });

    it('should have a show method', (): void => {
      expect(store.show).toBeDefined;
    });

    it('should have a create method', (): void => {
      expect(store.create).toBeDefined;
    });
  });

  describe('Products methods', (): void => {
    it('index method should return a list of Products', async (): Promise<void> => {
      const result = await store.index();
      expect(result.length).toEqual(21);
    });

    it('show method should return a Product by id', async (): Promise<void> => {
      const result = await store.show(1);
      expect(result).toEqual({
        id: 1,
        product_name: 'Item 1',
        price: '28.99',
        info: 'Some descriptive text',
        category: 1
      });
    });

    it('should return a new Product object upon insertion of a new record', async (): Promise<void> => {
      const newProduct = {
        product_name: 'Item 22',
        price: 428.99,
        info: 'Some descriptive text',
        category: 3
      };
      const result = await store.create(newProduct);
      expect(result).toEqual({
        id: 22,
        product_name: 'Item 22',
        price: '428.99',
        info: 'Some descriptive text',
        category: 3
      });
    });
  });
});
