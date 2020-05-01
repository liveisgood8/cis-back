import supertest from 'supertest';
import { testLoader } from '../../test-utils/loaders';
import { api } from '../../test-utils/api-path-generator';
import { reloadDatabase, closeConnection } from '../../test-utils/database';
import { Contract } from '../../../src/models/contract';
import Container from 'typedi';
import { ContractsService } from '../../../src/services/contracts';
import { getTestToken, addTestSuperUser } from '../../test-utils/auth';
import { DeepPartial, getRepository } from 'typeorm';
import { Client } from '../../../src/models/client';
import { ClientsService } from '../../../src/services/clients';
import { join } from 'path';
import { connectionName } from '../../../src/loaders/typeorm-loader';

describe('contracts endpoint test', () => {
  const realContracts: DeepPartial<Contract>[] = [
    {
      id: 1,
      name: 'test name 1',
      scanPath: 'http://path_scan',
      comment: 'test comment',
      conclusionDate: new Date(),
      creationDate: new Date(),
    },
    {
      id: 2,
      name: 'test name 2',
      scanPath: 'http://path_scan_2',
      comment: 'test comment 2',
      conclusionDate: new Date(),
      creationDate: new Date(),
    },
  ];

  const realClients: Partial<Client>[] = [
    {
      id: 40,
      address: 'street 1',
      email: 'email 1',
      name: 'name 1',
      comment: 'some comment 1',
      creationDate: new Date(),
    },
    {
      id: 45,
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
  }, 20000);

  afterAll(async (done) => {
    await closeConnection();
    done();
  });

  beforeEach(async (done) => {
    await reloadDatabase();
    done();
  });

  it('get all without auth', (done) => {
    request.get(api('/contracts'))
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('get all', async () => {
    realContracts.forEach(async (e) => {
      await Container.get(ContractsService).insert(e);
    });

    const res = await request.get(api('/contracts'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const contracts: Contract[] = res.body;
    expect(Array.isArray(contracts)).toBeTruthy();
    expect(contracts.length).toBe(2);
    expect(contracts).toEqual(realContracts.map((e) => ({
      ...e,
      conclusionDate: (e.conclusionDate as Date).toJSON(),
      creationDate: (e.creationDate as Date).toJSON(),
    })));
  });

  it('get all by client id', async () => {
    realClients.forEach(async (e) => {
      await Container.get(ClientsService).insert(e);
    });
    await Container.get(ContractsService).insert({
      ...realContracts[0],
      client: {
        id: 40,
      },
    });
    await Container.get(ContractsService).insert({
      ...realContracts[1],
      client: {
        id: 45,
      },
    });

    const res = await request.get(api('/contracts'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .query({
        clientId: 40,
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const contracts: Contract[] = res.body;
    expect(Array.isArray(contracts)).toBeTruthy();
    expect(contracts.length).toBe(1);
    expect(contracts).toEqual([{
      ...realContracts[0],
      conclusionDate: (realContracts[0].conclusionDate as Date).toJSON(),
      creationDate: (realContracts[0].creationDate as Date).toJSON(),
    }]);
  });

  it('upload copy file', async () => {
    const res = await request.post(api('/contracts/uploadCopyFile'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .attach('contractCopyFile', join(__dirname, 'contract_test_file.txt'))
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('contentPath');
    expect(typeof res.body.contentPath).toBe('string');
    expect(res.body.contentPath).toContain('uploads');
    expect(res.body.contentPath).toContain('contractCopyFile');
    expect(res.body.contentPath).toContain('contract_test_file');
    expect(res.body.contentPath).toContain('.txt');
  });

  it('insert', async () => {
    await addTestSuperUser();
    await Container.get(ClientsService).insert(realClients[0]);

    const res = await request.post(api('/contracts'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .send({
        clientId: 40,
        name: realContracts[0].name,
        conclusionDate: realContracts[0].conclusionDate,
        copyPath: realContracts[0].scanPath,
        comment: realContracts[0].comment,
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const contractId: number = res.body;
    expect(contractId).toBe(realContracts[0].id);

    const contract = await getRepository(Contract, connectionName).findOne({
      where: {
        id: 1,
      },
    });
    contract.creationDate = undefined;
    expect(contract).toEqual({
      ...realContracts[0],
      creationDate: undefined,
    });
  });
});
