import express, { Request, Response } from 'express';
import users_index from './handlers/users';
//import products_index from './handlers/products';
//import orders_index from './handlers/orders';

const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_req: Request, res: Response): void => {
  res.send(`<h2>Api is up and running on port: ${port}</h2>`);
});

users_index(app);
//products_index(app);
//orders_index(app);

app.listen(port, (): void => {
  console.log(`App listening on port ${port}`);
});

export default app;
