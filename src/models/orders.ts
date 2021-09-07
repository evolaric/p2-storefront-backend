import Client from '../database';
import { Details, OrderDetailsStore } from './order-details';

export type Order = {
  id: number;
  user_id?: number;
  details?: Details;
  status?: boolean;
  created_at?: number | null;
  closed_at?: number | null;
};

class OrdersModelError extends Error {
  constructor(message: string, stack?: string) {
    super();
    Error.captureStackTrace(this, OrdersModelError);
    this.name = this.constructor.name;
    this.message = message || 'Something went wrong in the orders model.';
    this.stack = stack || undefined;
  }
}

export class OrdersStore {
  detailsStore = new OrderDetailsStore();
  async createOrder(user_id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'INSERT INTO orders (user_id, created_at) VALUES($1, $2) RETURNING *';
      const timestamp = new Date().getTime();
      const result = await conn.query(sql, [user_id, timestamp]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new OrdersModelError(err.message, err.stack || null);
    }
  }

  async closeOrder(order_id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE orders SET status = true, closed_at = ($2) WHERE id=($1) RETURNING *';
      const timestamp = new Date().getTime();
      const result = await conn.query(sql, [order_id, timestamp]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new OrdersModelError(err.message, err.stack || null);
    }
  }

  async getOpenOrder(user_id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE status = false AND user_id=($1)';
      const result = await conn.query(sql, [user_id]);
      conn.release();
      if (result.rows.length < 1) {
        //if no open order exists, creates a new one and returns the Order object
        const createNewOrder = await this.createOrder(user_id);
        const composeNewOrder = await this.composeOrder(createNewOrder.id);
        return composeNewOrder;
      } else {
        //if an open order exists, send the existing Order object
        const composeExistingOrder = await this.composeOrder(result.rows[0].id);
        return composeExistingOrder;
      }
    } catch (err) {
      throw new OrdersModelError(err.message, err.stack) || null;
    }
  }

  async checkOrderStatus(order_id: number): Promise<boolean> {
    //check to see if an order is open or close
    //closed = true, open = false
    try {
      const conn = await Client.connect();
      const sql = 'SELECT status FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [order_id]);
      conn.release();
      return result.rows[0].status;
    } catch (err) {
      throw new OrdersModelError(err.message, err.stack || null);
    }
  }

  async modifyOrder(o: Order): Promise<Order> {
    // There are only two areas of an order that can be modified: status and details,
    try {
      // first, check to see if this order is closed in the database
      if (await this.checkOrderStatus(o.id)) {
        //if closed, sends the complete closed Order back unchanged
        const closedOrder = await this.composeOrder(o.id);
        return closedOrder;
      }
      // if a details array was included in the request, rewrites the details in the order
      if (o.details !== undefined) {
        await this.detailsStore.insert(o.id, o.details);
      }
      // if the request is set to true, closes the order and sends closed Order object
      if (o.status === true) {
        await this.closeOrder(o.id);
      }
    } catch (err) {
      throw new OrdersModelError(err.message, err.stack);
    } finally {
      //compose the modified order and send it back to the front-end
      const modifiedOrder = this.composeOrder(o.id);
      return modifiedOrder;
    }
  }

  async composeOrder(order_id: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const stubSql = 'SELECT * FROM orders WHERE id=($1)';
      // get the order stub
      const stub = await conn.query(stubSql, [order_id]);
      // get the order details
      const details = await this.detailsStore.get(order_id);
      // construct an Order object
      const composedOrder: Order = {
        id: stub.rows[0].id,
        user_id: stub.rows[0].user_id,
        details: [...details],
        status: stub.rows[0].status,
        created_at: parseInt(stub.rows[0].created_at) || null,
        closed_at: parseInt(stub.rows[0].closed_at) || null
      };
      conn.release();
      return composedOrder;
    } catch (err) {
      throw new OrdersModelError(err.message, err.stack || null);
    }
  }
}
