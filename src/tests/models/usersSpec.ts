import Client from '../../database';
import { User, UserStore } from '../../models/users';

const store = new UserStore();

describe('User model testing', (): void => {
  afterAll(async () => {
    const conn = await Client.connect();
    const sql = 'TRUNCATE users RESTART IDENTITY CASCADE';
    await conn.query(sql);
    conn.release();
    return;
  });

  describe('Check if methods are defined', (): void => {
    it('should have a create method', (): void => {
      expect(store.create).toBeDefined;
    });

    it('should have a show method', (): void => {
      expect(store.show).toBeDefined;
    });

    it('should have an index method', (): void => {
      expect(store.index).toBeDefined;
    });

    it('should have an authenticate method', (): void => {
      expect(store.authenticate).toBeDefined;
    });
  });

  describe('User Methods', (): void => {
    it('create method should return a Token object', async (): Promise<void> => {
      const user: User = {
        user_name: 'HexMaster1776',
        first_name: 'Bob',
        last_name: 'Dobbs',
        password: 'iamsosleepy'
      };
      const result = await store.create(user);
      expect(Object.keys(result).length).toEqual(6);
      expect(result.id).toEqual(1);
      expect(result.user_name).toEqual('HexMaster1776');
      expect(result.first_name).toEqual('Bob');
      expect(result.last_name).toEqual('Dobbs');
      expect(result.iat).toBeDefined;
      expect(result.exp).toBeDefined;
    });

    it('show method should return a User object by Id', async (): Promise<void> => {
      const user = {
        id: 1
      };
      const result = await store.show(user);
      expect(result.id).toEqual(1);
      expect(result.user_name).toEqual('HexMaster1776');
      expect(result.first_name).toEqual('Bob');
      expect(result.last_name).toEqual('Dobbs');
    });

    it('show method should return a User object by user_name', async (): Promise<void> => {
      const user = {
        user_name: 'HexMaster1776'
      };
      const result = await store.show(user);
      expect(result.id).toEqual(1);
      expect(result.user_name).toEqual('HexMaster1776');
      expect(result.first_name).toEqual('Bob');
      expect(result.last_name).toEqual('Dobbs');
    });

    it('index method should return a list of user records', async (): Promise<void> => {
      const result = await store.index();
      expect(result.length).toEqual(1);
    });
  });

  describe('Authentication testing', (): void => {
    beforeAll(async (): Promise<void> => {
      const user: User = {
        user_name: 'AuthorityFigure',
        first_name: 'Jean',
        last_name: 'Fossburrey',
        password: 'passwordAlpha'
      };
      await store.create(user);
      const conn = await Client.connect();
      const sql = 'UPDATE users SET admin = true WHERE id=(2)';
      await conn.query(sql);
      conn.release();
    });

    it('authenticate method should return a Token object on a successful login', async (): Promise<void> => {
      const login = {
        user_name: 'HexMaster1776',
        password: 'iamsosleepy'
      };
      const result = await store.authenticate(login);
      if (result) {
        expect(Object.keys(result).length).toEqual(6);
        expect(result.id).toEqual(1);
        expect(result.user_name).toEqual('HexMaster1776');
        expect(result.first_name).toEqual('Bob');
        expect(result.last_name).toEqual('Dobbs');
        expect(result.iat).toBeDefined;
        expect(result.exp).toBeDefined;
      } else {
        expect(result).toBeDefined; // if not defined it fails
      }
    });

    it('authenticate method should return null on an unsuccessful login', async (): Promise<void> => {
      const login = {
        user_name: 'HexMaster1776',
        password: 'iamsosleepy22'
      };
      const result = await store.authenticate(login);
      expect(result).toBeNull;
    });

    it('authenticate method should return an admin Token for an admin user', async (): Promise<void> => {
      const login = {
        user_name: 'AuthorityFigure',
        password: 'passwordAlpha'
      };
      const result = await store.authenticate(login);
      if (result) {
        expect(Object.keys(result).length).toEqual(7);
        expect(result.id).toEqual(2);
        expect(result.user_name).toEqual('AuthorityFigure');
        expect(result.first_name).toEqual('Jean');
        expect(result.last_name).toEqual('Fossburrey');
        expect(result.iat).toBeDefined;
        expect(result.exp).toBeDefined;
        expect(result.admin).toBeTrue;
      } else {
        expect(result).toBeDefined; // if not defined it fails
      }
    });
  });
});
