import express, { Request, Response, NextFunction } from 'express';
import { ProductsStore } from '../models/products';
import verifyjwt from '../utils/verifyjwt';

const store = new ProductsStore();

const index = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const index = await store.index();
    res.status(200).json(index);
  } catch (err) {
    next(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const show = await store.show(+req.params.id);
    res.status(200).json(show);
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const created = await store.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

const products_index = (app: express.Application): void => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyjwt, create);
};

export default products_index;
