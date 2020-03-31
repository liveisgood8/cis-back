import supertest from 'supertest';
import { testLoader } from '../../test-utils/loaders';
import { api } from '../../test-utils/api-path-generator';
import Container from 'typedi';
import { ClientsService } from '../../../src/services/clients';
import { reloadDatabase } from '../../test-utils/database';
import { Client } from '../../../src/models/client';
import { PermissionsService } from '../../../src/services/permissions';
import { addTestSuperUser, getTestToken } from '../../test-utils/auth';

describe('clients endpoint test', () => {
  const realClients: Partial<Client>[] = [
    {
      id: 1,
      address: 'street 1',
      email: 'email 1',
      name: 'name 1',
      comment: 'some comment 1',
      creationDate: new Date(),
    },
    {
      id: 2,
      address: 'street 2',
      email: 'email 2',
      name: 'name 2',
      comment: 'some comment 2',
      creationDate: new Date(),
    },
  ];

  let request: supertest.SuperTest<supertest.Test>;
  beforeAll(async (done) => {
    const app = await testLoader();
    request = supertest(app);
    done();
  }, 10000);

  beforeEach(async (done) => {
    await reloadDatabase();
    done();
  });

  it('get all without auth', async () => {
    request.get(api('/clients'))
      .expect(401)
      .expect('Content-Type', /json/);
  });

  it('get all', async () => {
    const service = Container.get(ClientsService);
    realClients.forEach((e) => {
      service.insert(e);
    });

    const res = await request.get(api('/clients'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const body: Client[] = res.body;

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
    expect(body).toStrictEqual(realClients.map((e) => ({
      ...e,
      creationDate: e.creationDate.toJSON(),
    })));
  });

  it('get by id', async () => {
    const service = Container.get(ClientsService);
    realClients.forEach((e) => {
      service.insert(e);
    });

    const res = await request.get(api('/clients'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .query({
        id: 2,
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const body: Client = res.body;
    expect(body).toStrictEqual({
      ...realClients[1],
      creationDate: realClients[1].creationDate.toJSON(),
    });
  });

  it('insert', async () => {
    await addTestSuperUser();

    const res = await request.post(api('/clients'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .send(realClients[0])
      .expect(201)
      .expect('Content-Type', /json/);

    const clientId: number = res.body;
    expect(clientId).toBe(realClients[0].id);

    const client = await Container.get(ClientsService).getById(1);
    client.creationDate = undefined;
    expect(client).toEqual({
      ...realClients[0],
      creationDate: undefined,
    });
  });
});
