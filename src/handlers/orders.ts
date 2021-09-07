import express, { Request, Response, NextFunction } from 'express';
import { OrdersStore } from '../models/orders';
import verifyjwt from '../utils/verifyjwt';

const store = new OrdersStore();

const currentOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentOrder = await store.getOpenOrder(res.locals.user.id);
    res.locals.currentOrderId = currentOrder.id;
    res.status(200).json(currentOrder);
  } catch (err) {
    next(err);
  }
};

const modifyOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const modifiedOrder = await store.modifyOrder(req.body);
    res.status(200).json(modifiedOrder);
  } catch (err) {
    next(err);
  }
};

const orders_index = (app: express.Application): void => {
  app.get('/orders', verifyjwt, currentOrder);
  app.put('/orders', verifyjwt, modifyOrder);
};

export default orders_index;
