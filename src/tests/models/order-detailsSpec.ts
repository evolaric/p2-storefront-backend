import Client from '../../database';
import { OrderDetailsStore } from '../../models/order-details';
import path from 'path';
import fs from 'fs';

const seedfile = path.join(__dirname + '../../sql-order-details-seed.sql');
const seed = fs.readFileSync(seedfile).toString();

const store = new OrderDetailsStore();

describe('OrderDetails model testing', (): void => {
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
      const sql = 'TRUNCATE users, products, categories, orders, order_details RESTART IDENTITY CASCADE';
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(err);
    }
  });

  describe('Check if methods are defined', (): void => {
    it('should have an index method', (): void => {
      expect(store.get).toBeDefined;
    });

    it('should have a show method', (): void => {
      expect(store.insert).toBeDefined;
    });

    it('should have a create method', (): void => {
      expect(store.delete).toBeDefined;
    });
  });

  describe('Order-Details methods', (): void => {
    it('insert method should return the inserted list of details as a Details array', async (): Promise<void> => {
      const details = [
        { product_id: 2, quantity: 116 },
        { product_id: 3, quantity: 2 },
        { product_id: 4, quantity: 2 },
        { product_id: 5, quantity: 2 }
      ];
      const result = await store.insert(1, details);
      expect(result).toEqual([
        { id: 1, order_id: 1, product_id: 2, quantity: 116 },
        { id: 2, order_id: 1, product_id: 3, quantity: 2 },
        { id: 3, order_id: 1, product_id: 4, quantity: 2 },
        { id: 4, order_id: 1, product_id: 5, quantity: 2 }
      ]);
    });

    it('get method should return a list of items in an order as a Details array', async (): Promise<void> => {
      const result = await store.get(1);
      expect(result).toEqual([
        { id: 1, order_id: 1, product_id: 2, quantity: 116 },
        { id: 2, order_id: 1, product_id: 3, quantity: 2 },
        { id: 3, order_id: 1, product_id: 4, quantity: 2 },
        { id: 4, order_id: 1, product_id: 5, quantity: 2 }
      ]);
    });

    it('insert method should delete existing details and replace them', async (): Promise<void> => {
      const details = [
        { product_id: 5, quantity: 116 },
        { product_id: 6, quantity: 2 },
        { product_id: 7, quantity: 2 },
        { product_id: 8, quantity: 2 }
      ];
      const result = await store.insert(1, details);
      expect(result).toEqual([
        { id: 5, order_id: 1, product_id: 5, quantity: 116 },
        { id: 6, order_id: 1, product_id: 6, quantity: 2 },
        { id: 7, order_id: 1, product_id: 7, quantity: 2 },
        { id: 8, order_id: 1, product_id: 8, quantity: 2 }
      ]);
    });

    it('delete method should return a list of deleted items', async (): Promise<void> => {
      const result = await store.delete(1);
      expect(result).toEqual([
        { id: 5, order_id: 1, product_id: 5, quantity: 116 },
        { id: 6, order_id: 1, product_id: 6, quantity: 2 },
        { id: 7, order_id: 1, product_id: 7, quantity: 2 },
        { id: 8, order_id: 1, product_id: 8, quantity: 2 }
      ]);
    });
  });

  //end of suite
});
