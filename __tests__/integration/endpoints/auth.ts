import supertest from 'supertest';
import { api } from '../../test-utils/api-path-generator';
import { Errors } from '../../../src/utils/errors';
import { User } from '../../../src/models/user';
import { testLoader } from '../../test-utils/loaders';
import { reloadDatabase, closeConnection } from '../../test-utils/database';
import Container from 'typedi';
import { AuthService } from '../../../src/services/auth';

describe('auth endpoint test', () => {
  const testUser: User = {
    id: 1,
    login: 'testLogin',
    password: 'testPassword',
    imageUrl: 'http://test.com/image.png',
    name: 'testName',
    surname: 'testSurname',
    permissions: [],
    requests: [],
  };

  let request: supertest.SuperTest<supertest.Test>;
  beforeAll(async (done) => {
    const app = await testLoader();
    request = supertest(app);
    done();
  }, 20000);

  afterAll(async (done) => {
    await closeConnection();
    done();
  });

  describe('login', () => {
    it('without any params', async () => {
      const res = await request.post(api('/auth/login'))
        .expect(400)
        .expect('Content-Type', /json/);
      expect(res.body.code).toBe(Errors.REQUEST_VALIDATE_ERROR);
      expect(res.body.message).toContain(`'login' is required`);
      expect(res.body.message).toContain(`'password' is required`);
    });

    it('with not existing login', async () => {
      const res = await request.post(api('/auth/login'))
        .send({
          login: 'invalid',
          password: '123',
        })
        .expect(406)
        .expect('Content-Type', /json/);
      expect(res.body.code).toBe(Errors.AUTH_USER_NOT_FOUND);
    });

    it('with existing login, but wrong password', async () => {
      await reloadDatabase();

      // Create user
      const service = Container.get(AuthService);
      await service.register(testUser);

      const res = await request.post(api('/auth/login'))
        .send({
          login: testUser.login,
          password: '123',
        })
        .expect(406)
        .expect('Content-Type', /json/);
      expect(res.body.code).toBe(Errors.AUTH_WRONG_PASSWORD);
    });

    it('with correct login and password', async () => {
      await reloadDatabase();

      // Create user
      const service = Container.get(AuthService);
      await service.register(testUser);

      const res = await request.post(api('/auth/login'))
        .send({
          login: testUser.login,
          password: testUser.password,
        })
        .expect(200)
        .expect('Content-Type', /json/);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');

      expect(res.body.user).toStrictEqual({
        id: testUser.id,
        login: testUser.login,
        name: testUser.name,
        surname: testUser.surname,
        imageUrl: testUser.imageUrl,
      } as Partial<User>);
    });
  });

  describe('register', () => {
    it('without any params', async () => {
      const res = await request.post(api('/auth/register'))
        .expect(400)
        .expect('Content-Type', /json/);

      expect(res.body.code).toBe(Errors.REQUEST_VALIDATE_ERROR);
      expect(res.body.message).toContain(`'login' is required`);
      expect(res.body.message).toContain(`'password' is required`);
      expect(res.body.message).toContain(`'name' is required`);
      expect(res.body.message).toContain(`'surname' is required`);
      expect(res.body.message).toContain(`'imageUrl' is required`);
    });

    it('duplicate user', async () => {
      await reloadDatabase();

      // Create user
      const service = Container.get(AuthService);
      await service.register(testUser);

      const res = await request.post(api('/auth/register'))
        .send(testUser)
        .expect(406)
        .expect('Content-Type', /json/);

      expect(res.body.code).toBe(Errors.REGISTER_USER_IS_EXIST);
    });

    it('with unique login and correct data', async () => {
      await reloadDatabase();
      request.post(api('/auth/register'))
        .send(testUser)
        .expect(200);
    });
  });
});
