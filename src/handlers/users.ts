import express, { Request, Response, NextFunction } from 'express';
import { UserStore } from '../models/users';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import verifyjwt from '../utils/verifyjwt';

dotenv.config();

const store = new UserStore();

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authenticate = await store.authenticate(req.body);
    if (authenticate) {
      const secret = process.env.TOKEN_SECRET;
      const token = jwt.sign(authenticate, secret as string);
      res.status(200).send(token);
    } else {
      res.status(403).send('Authentication Failed: Invalid user_name or password');
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
    res.status(201).send(token);
  } catch (err) {
    next(err);
  }
};

const show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const nub = res.locals.user;
    const user = await store.show({ id: nub.id });
    if (!user) {
      throw new Error(
        'You must provide a valid user Id (number) or valid user_name (string) to retrieve a user record'
      );
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
};

const index = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userIndex = await store.index();
    res.json(userIndex);
  } catch (err) {
    next(err);
  }
};

const users_index = (app: express.Application): void => {
  app.post('/users/login', authenticate);
  app.post('/users', create);
  app.get('/users/show', verifyjwt, show);
  app.get('/users/index', verifyjwt, index);
};

export default users_index;
