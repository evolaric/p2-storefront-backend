import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

async function verifyjwt(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.headers.authorization) {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string, (err, decoded) => {
        if (err) throw new Error();
        return decoded;
      });
      // attach token details to res.locals
      res.locals.user = decoded;
    } else {
      // the header does not exist
      // in a real world setting, I would imagine this would redirect to a sign up screen
      res.status(401).send('Authorization Failed: No authorization token found');
    }
    next();
  } catch (err) {
    // in a real world setting, I imagine this would redirect to a login screen
    res.status(401).send('Authorization Failed: JWT could not be verified.  Reauthentication required.');
  }
}

export default verifyjwt;
