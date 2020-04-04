import supertest from 'supertest';
import { testLoader } from '../../test-utils/loaders';
import { api } from '../../test-utils/api-path-generator';
import { reloadDatabase, closeConnection } from '../../test-utils/database';
import { User } from '../../../src/models/user';
import Container from 'typedi';
import { AuthService } from '../../../src/services/auth';
import { getTestToken } from '../../test-utils/auth';
import { getRepository } from 'typeorm';

describe('business requests endpoint test', () => {
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

  beforeEach(async (done) => {
    await reloadDatabase();
    done();
  });

  const user: Pick<User, 'login' | 'password' | 'name' | 'surname' | 'imageUrl'> = {
    login: 'testLogin',
    password: 'testPassword',
    imageUrl: 'http://test.com/image.png',
    name: 'testName',
    surname: 'testSurname',
  };

  it('get all', async () => {
    await Container.get(AuthService).register(user);

    const res = await request.get(api('/users'))
      .expect(200)
      .expect('Content-Type', /json/);

    const userClone: Partial<User> = { ...user };
    delete userClone.login;
    delete userClone.password;

    const users: User[] = res.body;
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBe(1);
    expect(users).toEqual([{
      ...userClone,
      id: 1,
    }]);
  });

  it('update', async () => {
    await Container.get(AuthService).register(user);

    await request.patch(api('/users'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .send({
        id: 1,
        name: 'test123',
        surname: 'newSurname3453',
        imageUrl: 'http://new_image_url.com',
      })
      .expect(204);

    const updatedUser = await getRepository(User).findOne({
      select: ['name', 'surname', 'imageUrl'],
      where: {
        id: 1,
      },
    });

    expect(updatedUser.name).toBe('test123');
    expect(updatedUser.surname).toBe('newSurname3453');
    expect(updatedUser.imageUrl).toBe('http://new_image_url.com');
  });

  it('get profile images', async () => {
    // TODO
  });
});
