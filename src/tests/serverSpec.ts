import Client from '../../src/database';
import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('Test basic app', (): void => {
  it('should be listening', async (): Promise<void> => {
    await request.get('/').expect(200);
  });

  it('should have a working Database client', async () => {
    expect(Client).toBeDefined;
  });
});
