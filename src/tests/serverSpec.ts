import Client from '../../src/database';
import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('Test basic app', (): void => {
  it('should be listening', async (): Promise<void> => {
    try {
      await request.get('/').expect(200);
    } catch (err) {
      throw new Error(err);
    }
  });

  it('should have a working Database client', async () => {
    expect(Client).toBeDefined;
  });
});
