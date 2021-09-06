import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

async function verifyjwt(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.headers.authorization) {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.split(' ')[1];
      jwt.verify(token, process.env.TOKEN_SECRET as string, (err, decoded) => {
        if (err) throw new Error();
        res.locals.user = decoded;
      });
    } else {
      throw new Error();
    }
    next();
  } catch (err) {
    res.status(401).send('Authorization Failed: JWT could not be verified.  Reauthentication required.');
  }
}

export default verifyjwt;
