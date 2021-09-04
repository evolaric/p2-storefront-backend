import express, { Request, Response, NextFunction } from 'express';
import { UserStore } from '../models/users';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const store = new UserStore();

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  try {
    const authenticate = await store.authenticate(req.body);
    if (authenticate) {
      const secret = process.env.TOKEN_SECRET;
      const token = jwt.sign(authenticate, secret as string);
      return res.status(200).json(token);
    } else {
      next(res.status(401).json({ message: 'LOGIN FAILED' }));
    }
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newUser = await store.create(req.body);
    const secret = process.env.TOKEN_SECRET;
    const token = jwt.sign(newUser, secret as string);
    res.send(token);
  } catch (err) {
    next(err);
  }
};

const users_index = (app: express.Application): void => {
  app.post('/users/login', authenticate);
  app.post('/users', create);
};

export default users_index;
