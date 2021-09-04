import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST_DEV,
  POSTGRES_DB_DEV,
  POSTGRES_USER_DEV,
  POSTGRES_PASSWORD_DEV,
  POSTGRES_HOST_TEST,
  POSTGRES_DB_TEST,
  POSTGRES_USER_TEST,
  POSTGRES_PASSWORD_TEST,
  ENV
} = process.env;

const SetClient = (ENV: string): Pool => {
  if (ENV === 'dev') {
    const client = new Pool({
      host: POSTGRES_HOST_DEV,
      database: POSTGRES_DB_DEV,
      user: POSTGRES_USER_DEV,
      password: POSTGRES_PASSWORD_DEV
    });
    console.log(ENV);
    return client;
  } else {
    const client = new Pool({
      host: POSTGRES_HOST_TEST,
      database: POSTGRES_DB_TEST,
      user: POSTGRES_USER_TEST,
      password: POSTGRES_PASSWORD_TEST
    });
    console.log(ENV);
    return client;
  }
};

const Client = SetClient(ENV as string);

export default Client;
