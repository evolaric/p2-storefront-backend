import Client from '../database';

export type Product = {
  id?: number | string;
  product_name: string;
  price: number | string;
  info?: string | null;
  category?: number;
};

class ProductsModelError extends Error {
  constructor(message: string, stack?: string) {
    super();
    Error.captureStackTrace(this, ProductsModelError);
    this.name = this.constructor.name;
    this.message = message || 'Something went wrong in the products model.';
    this.stack = stack || undefined;
  }
}

export class ProductsStore {
  //index
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new ProductsModelError(err.message, err.stack);
    }
  }
  //show

  async show(id: number): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new ProductsModelError(err.message, err.stack);
    }
  }
  //create

  async create(p: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = 'INSERT INTO products (product_name, price, info, category) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await conn.query(sql, [p.product_name, p.price, p.info || null, p.category || null]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new ProductsModelError(err.message, err.stack);
    }
  }
}
