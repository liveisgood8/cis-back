import supertest from 'supertest';
import { testLoader } from '../../test-utils/loaders';
import { api } from '../../test-utils/api-path-generator';
import { reloadDatabase, closeConnection } from '../../test-utils/database';
import { User } from '../../../src/models/user';
import Container from 'typedi';
import { AuthService } from '../../../src/services/auth';
import { BusinessRequestsService } from '../../../src/services/requests';
import { BusinessRequest } from '../../../src/models/request';
import { DeepPartial, getRepository } from 'typeorm';
import { getTestToken, addTestSuperUser } from '../../test-utils/auth';
import { ContractsService } from '../../../src/services/contracts';

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

  const realRequests: DeepPartial<BusinessRequest>[] = [
    {
      id: 1,
      isHandled: false,
      message: 'some message 1',
      title: 'some title 1',
      user: {
        id: 1,
      },
    },
    {
      id: 2,
      isHandled: true, /** should not return by GET /business-requests */
      message: 'some message 2',
      title: 'some title 2',
      user: {
        id: 1,
      },
    },
    {
      id: 3,
      isHandled: false, /** should not return by GET /business-requests */
      message: 'some message 3',
      title: 'some title 3',
      user: {
        id: 2,
      },
    },
  ];

  const initRequests = async (): Promise<void> => {
    await Container.get(AuthService).register(user);
    await Container.get(AuthService).register({
      ...user,
      login: 'new login',
    });
    for (let i = 0; i < realRequests.length; i++) {
      await Container.get(BusinessRequestsService).save(realRequests[i]);
    }
  };

  it('get all without auth', (done) => {
    request.get(api('/business-requests'))
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('get all', async () => {
    await initRequests();

    const res = await request.get(api('/business-requests'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const requests: BusinessRequest[] = res.body;
    expect(Array.isArray(requests)).toBeTruthy();
    expect(requests.length).toBe(1);
    expect(requests).toEqual([{
      ...realRequests[0],
      user: undefined,
      creationDate: (realRequests[0].creationDate as Date).toJSON(),
    }]);
  });

  it('get by id', async () => {
    await initRequests();

    const firstRes = await request.get(api('/business-requests/1'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const body: BusinessRequest = firstRes.body;
    expect(body).toEqual({
      ...realRequests[0],
      contract: null,
      user: undefined,
      creationDate: (realRequests[0].creationDate as Date).toJSON(),
    });
  });

  it('get by id (another user request)', async () => {
    await initRequests();

    return request.get(api('/business-requests/3'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .expect(204); /** no content */
  });

  it('get pending number', async () => {
    await initRequests();

    const res = await request.get(api('/business-requests/pending-number'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('pendingNumber');
    expect(res.body.pendingNumber).toBe(1);
  });

  it('set handled', async () => {
    await initRequests();

    await request.patch(api('/business-requests'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .send({
        requestId: 1,
        email: 'donotsend@test.com',
        answer: {
          subject: 'test subject',
          body: 'test body',
        },
      })
      .expect(204);

    const modifiedRequest = await getRepository(BusinessRequest)
      .findOne({
        where: {
          id: 1,
        },
      });

    expect(modifiedRequest.isHandled).toBeTruthy();
  }, 20000);

  it('insert', async () => {
    await addTestSuperUser();
    await Container.get(ContractsService).insert({
      id: 1,
      name: 'test name 1',
      scanPath: 'http://path_scan',
      comment: 'test comment',
      conclusionDate: new Date(),
      creationDate: new Date(),
    });

    const res = await request.post(api('/business-requests'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .send({
        userId: 1,
        contractId: 1,
        title: 'test title 123',
        message: 'test message 123',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('id');
    expect(typeof res.body.id).toBe('number');

    const requestId = res.body.id;

    const insertedRequest = await Container.get(BusinessRequestsService)
      .getByIdForUser(requestId, 1);

    expect(insertedRequest.message).toBe('test message 123');
    expect(insertedRequest.title).toBe('test title 123');
  });
});
