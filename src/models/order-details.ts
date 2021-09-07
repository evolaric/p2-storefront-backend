import Client from '../database';

export type Detail = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export type Details = Detail[];

class OrderDetailsModelError extends Error {
  constructor(message: string, stack?: string) {
    super();
    Error.captureStackTrace(this, OrderDetailsModelError);
    this.name = this.constructor.name;
    this.message = message || 'Something went wrong in the order details model.';
    this.stack = stack || undefined;
  }
}

export class OrderDetailsStore {
  // get existing details
  async get(id: number): Promise<Details> {
    // get details
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM order_details WHERE order_id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new OrderDetailsModelError(err.message, err.stack || null);
    }
  }

  // insert details
  async insert(d: Details): Promise<Details> {
    const orderNumber: number = d[0].order_id;
    const sql = 'INSERT INTO order_details(order_id, product_id, quantity) VALUES($1,$2,$3)';
    const conn = await Client.connect();
    // Delete the existing details, if they exist...
    await this.delete(orderNumber);
    //...and then insert the new details
    try {
      // Oh, sweet for..await loop!  Where have you been all my life?
      for await (const row of d) {
        await conn.query(sql, [orderNumber, row.product_id, row.quantity]);
      }
      conn.release();
      const inserted = await this.get(orderNumber);
      return inserted;
    } catch (err) {
      throw new OrderDetailsModelError(err.message, err.stack || null);
    }
  }

  // delete details
  async delete(id: number): Promise<Details> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM order_details WHERE order_id=($1) RETURNING *';
      const deleted = await conn.query(sql, [id]);
      conn.release();
      // returns a list of the deleted items
      return deleted.rows;
    } catch (err) {
      throw new OrderDetailsModelError(err.message, err.stack || null);
    }
  }
}
