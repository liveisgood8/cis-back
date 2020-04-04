import supertest from 'supertest';
import { testLoader } from '../../test-utils/loaders';
import { api } from '../../test-utils/api-path-generator';
import { reloadDatabase, closeConnection } from '../../test-utils/database';
import { Contract } from '../../../src/models/contract';
import Container from 'typedi';
import { ContractsService } from '../../../src/services/contracts';
import { getTestToken, addTestSuperUser } from '../../test-utils/auth';
import { DeepPartial, getRepository, getConnection } from 'typeorm';
import { Client } from '../../../src/models/client';
import { ClientsService } from '../../../src/services/clients';
import { join } from 'path';
import { Task } from '../../../src/models/task';
import { TasksService } from '../../../src/services/tasks';

describe('tasks endpoint test', () => {
  const realClient: Partial<Client> = {
    id: 45,
    address: 'street 2',
    email: 'email 2',
    name: 'name 2',
    comment: 'some comment 2',
  };

  const realContract: DeepPartial<Contract> = {
    id: 2,
    name: 'test name 2',
    scanPath: 'http://path_scan_2',
    comment: 'test comment 2',
    conclusionDate: new Date(),
    client: {
      id: realClient.id,
    },
  };

  const realTasks: DeepPartial<Task>[] = [
    {
      id: 1,
      contract: {
        id: realContract.id,
      },
      name: 'task name 1',
      doneTo: new Date(),
      description: 'some description 1',
    },
    {
      id: 43,
      contract: {
        id: realContract.id,
      },
      name: 'task name 2',
      doneTo: new Date(),
      description: 'some description 4353',
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

  const initTasks = async (): Promise<void> => {
    await Container.get(ClientsService).insert(realClient);
    await Container.get(ContractsService).insert(realContract);
    for (let i = 0; i < realTasks.length; i++) {
      await Container.get(TasksService).insert(realTasks[i]);
    }
  };

  it('get all without auth', (done) => {
    request.get(api('/contracts'))
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('get all', async () => {
    await initTasks();

    const res = await request.get(api('/tasks'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const tasks: Task[] = res.body;
    expect(Array.isArray(tasks)).toBeTruthy();
    expect(tasks.length).toBe(2);
    expect(tasks.map((e) => ({
      ...e,
      contract: undefined,
      creationDate: undefined,
    }))).toEqual(realTasks.map((e) => ({
      ...e,
      contract: undefined,
      creationDate: undefined,
      doneTo: (e.doneTo as Date).toJSON(),
    })));
  });

  it('get all by contract id', async () => {
    await initTasks();

    const res = await request.get(api('/tasks'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .query({
        contractId: realContract.id,
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const tasks: Task[] = res.body;
    expect(Array.isArray(tasks)).toBeTruthy();
    expect(tasks.length).toBe(2);
    expect(tasks.map((e) => ({
      ...e,
      creationDate: undefined,
    }))).toEqual(realTasks.map((e) => ({
      ...e,
      doneTo: (e.doneTo as Date).toJSON(),
      contract: undefined,
      creationDate: undefined,
    })));
  });

  it('get by id', async () => {
    await initTasks();

    const res = await request.get(api(`/tasks/${realTasks[0].id}`))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const task: Task = res.body;
    expect(task).toHaveProperty('contract');

    task.contract = undefined; /** do not check it */
    task.creationDate = undefined;

    expect(task).toEqual({
      ...realTasks[0],
      doneTo: (realTasks[0].doneTo as Date).toJSON(),
      contract: undefined,
      creationDate: undefined,
    });
  });

  it('insert', async () => {
    await addTestSuperUser();
    await Container.get(ClientsService).insert(realClient);
    await Container.get(ContractsService).insert(realContract);

    const res = await request.post(api('/tasks'))
      .auth(getTestToken(), {
        type: 'bearer',
      })
      .send({
        contractId: realTasks[0].contract.id,
        name: realTasks[0].name,
        description: realTasks[0].description,
        doneTo: realTasks[0].doneTo,
      })
      .expect(200)
      .expect('Content-Type', /json/);

    const taskId: number = res.body;
    expect(taskId).toBeGreaterThan(0);

    const task = await Container.get(TasksService).getById(taskId);
    task.creationDate = undefined;
    task.contract = undefined;

    expect(task).toEqual({
      ...realTasks[0],
      contract: undefined,
      creationDate: undefined,
    });
  });
});
