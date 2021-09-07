import Client from '../../database';
import { OrdersStore } from '../../models/orders';
import path from 'path';
import fs from 'fs';

const seedfile = path.join(__dirname + '../../sql-orders-seed.sql');
const seed = fs.readFileSync(seedfile).toString();

const store = new OrdersStore();

describe('Orders model testing', (): void => {
  beforeAll(async (): Promise<void> => {
    try {
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
      const sql = 'TRUNCATE users, products, categories, orders, order_details RESTART IDENTITY CASCADE';
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(err);
    }
  });

  describe('Check if methods are defined', (): void => {
    it('should have a create method', (): void => {
      expect(store.createOrder).toBeDefined;
    });

    it('should have a closeOrder method', (): void => {
      expect(store.closeOrder).toBeDefined;
    });

    it('should have a getOpenOrder method', (): void => {
      expect(store.getOpenOrder).toBeDefined;
    });

    it('should have a checkOrderStatus method', (): void => {
      expect(store.checkOrderStatus).toBeDefined;
    });

    it('should have a modifyOrder method', (): void => {
      expect(store.checkOrderStatus).toBeDefined;
    });

    it('should have a composeOrder method', (): void => {
      expect(store.composeOrder).toBeDefined;
    });
  });

  describe('Orders methods', (): void => {
    it('createOrder method should open an order for the provided user id', async (): Promise<void> => {
      try {
        const result = await store.createOrder(4);
        expect(result.id).toEqual(11);
        expect(result.user_id).toEqual(4);
        expect(result.status).toEqual(false);
        expect(result.created_at).toBeDefined;
        expect(result.closed_at).toBeNull;
      } catch (err) {
        throw new Error(err);
      }
    });

    it('closeOrder method should close the order for the provided order id', async (): Promise<void> => {
      try {
        const result = await store.closeOrder(11);
        expect(result.id).toEqual(11);
        expect(result.user_id).toEqual(4);
        expect(result.status).toEqual(true);
        expect(result.created_at).toBeDefined;
        expect(result.closed_at).toBeDefined;
      } catch (err) {
        throw new Error(err);
      }
    });

    it('composeOrder method should return a complete Order object', async (): Promise<void> => {
      try {
        const result = await store.composeOrder(3);
        expect(result).toEqual({
          id: 3,
          user_id: 1,
          details: [
            { id: 5, order_id: 3, product_id: 5, quantity: 6 },
            { id: 6, order_id: 3, product_id: 6, quantity: 6 }
          ],
          status: true,
          created_at: 1111113,
          closed_at: null
        });
      } catch (err) {
        throw new Error(err);
      }
    });

    it('checkOrderStatus method should return a false boolean for an open order', async (): Promise<void> => {
      try {
        const result = await store.checkOrderStatus(6);
        expect(result).toBeFalse;
      } catch (err) {
        throw new Error(err);
      }
    });

    it('checkOrderStatus method should return a true boolean for an closed order', async (): Promise<void> => {
      try {
        const result = await store.checkOrderStatus(1);
        expect(result).toBeTrue;
      } catch (err) {
        throw new Error(err);
      }
    });

    it('getOpenOrder method should return current order for the provided user id', async (): Promise<void> => {
      try {
        const result = await store.getOpenOrder(1);
        expect(result).toEqual({
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
      } catch (err) {
        throw new Error(err);
      }
    });

    it('modifyOrderStatus method should return a modified order if details are changed', async (): Promise<void> => {
      try {
        const modifiedOrder = {
          id: 5,
          details: [
            { order_id: 5, product_id: 5, quantity: 11 },
            { order_id: 5, product_id: 6, quantity: 16 },
            { order_id: 5, product_id: 7, quantity: 22 },
            { order_id: 5, product_id: 8, quantity: 78 },
            { order_id: 5, product_id: 10, quantity: 1 }
          ]
        };
        const result = await store.modifyOrder(modifiedOrder);
        expect(result.id).toEqual(5);
        expect(result.user_id).toEqual(1);
        expect(result.details).toEqual([
          { id: 21, order_id: 5, product_id: 5, quantity: 11 },
          { id: 22, order_id: 5, product_id: 6, quantity: 16 },
          { id: 23, order_id: 5, product_id: 7, quantity: 22 },
          { id: 24, order_id: 5, product_id: 8, quantity: 78 },
          { id: 25, order_id: 5, product_id: 10, quantity: 1 }
        ]);
        expect(result.status).toEqual(false);
        expect(result.created_at).toBeDefined;
        expect(result.closed_at).toBeNull;
      } catch (err) {
        throw new Error(err);
      }
    });

    it('modifyOrderStatus method should return a closed order if true status is sent', async (): Promise<void> => {
      try {
        const modifiedOrder = {
          id: 5,
          status: true
        };
        const result = await store.modifyOrder(modifiedOrder);
        expect(result.id).toEqual(5);
        expect(result.user_id).toEqual(1);
        expect(result.details).toEqual([
          { id: 21, order_id: 5, product_id: 5, quantity: 11 },
          { id: 22, order_id: 5, product_id: 6, quantity: 16 },
          { id: 23, order_id: 5, product_id: 7, quantity: 22 },
          { id: 24, order_id: 5, product_id: 8, quantity: 78 },
          { id: 25, order_id: 5, product_id: 10, quantity: 1 }
        ]);
        expect(result.status).toEqual(true);
        expect(result.created_at).toBeDefined;
        expect(result.closed_at).toBeDefined;
      } catch (err) {
        throw new Error(err);
      }
    });

    it('getOpenOrder method should create and return a new order is all user orders are closed ', async (): Promise<void> => {
      try {
        const result = await store.getOpenOrder(1);
        expect(result.id).toEqual(12);
        expect(result.details).toBeUndefined;
        expect(result.status).toBeFalse;
        expect(result.closed_at).toBeUndefined;
      } catch (err) {
        throw new Error(err);
      }
    });
  });
});
