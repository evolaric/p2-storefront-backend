import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const verifyjwt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.headers.authorization) {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
      console.log(decoded);
      next();
    }
  } catch (error) {
    res.status(401);
  }
};

export default verifyjwt;
