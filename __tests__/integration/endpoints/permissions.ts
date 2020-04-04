import supertest from 'supertest';
import { testLoader } from '../../test-utils/loaders';
import { closeConnection } from '../../test-utils/database';
import { api } from '../../test-utils/api-path-generator';
import { User } from '../../../src/models/user';
import { AuthService } from '../../../src/services/auth';
import Container from 'typedi';
import { PermissionsService } from '../../../src/services/permissions';
import { Permissions } from '../../../src/models/permissions';
import { getTestToken } from '../../test-utils/auth';

describe('permissions endpoint test', () => {
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

  const user: Pick<User, 'login' | 'password' | 'name' | 'surname' | 'imageUrl'> = {
    login: 'testLogin',
    password: 'testPassword',
    imageUrl: 'http://test.com/image.png',
    name: 'testName',
    surname: 'testSurname',
  };


  it('get all without auth', (done) => {
    request.get(api('/permissions'))
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('getAll', async () => {
    await Container.get(AuthService).register(user);
    await Container.get(PermissionsService)
      .setPermission(1, Permissions.ADD_TASKS);
    await Container.get(PermissionsService)
      .setPermission(1, Permissions.ADD_CLIENTS);

    const res = await request.get(api('/permissions'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const permissions: Permissions[] = res.body;
    expect(Array.isArray(permissions)).toBeTruthy();
    expect(permissions.length).toBe(2);
    expect(permissions).toEqual([
      Permissions.ADD_CLIENTS,
      Permissions.ADD_TASKS,
    ]);
  });
});
