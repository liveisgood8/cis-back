import { Client } from '../../../src/models/client';
import { createMockedRepository } from '../../test-utils/mockedRepo';
import { Contract } from '../../../src/models/contract';
import { Task } from '../../../src/models/task';
import { TasksService } from '../../../src/services/tasks';

describe('tasks service - unit', () => {
  let service: TasksService;
  const repoMock = createMockedRepository<Task>();

  const realClient: Client = {
    id: 1,
    address: 'street 1',
    email: 'email 1',
    name: 'name 1',
    creationDate: new Date(),
    contracts: [],
    comment: 'some comment 1',
  };

  const realContract: Contract = {
    id: 1,
    client: realClient,
    conclusionDate: new Date(),
    name: 'name of contract',
    scanPath: 'path to contract scan',
    requests: [],
    tasks: [],
    creationDate: new Date(),
    comment: 'some comment 1',
  };

  const realTasks: Task[] = [
    {
      id: 1,
      contract: realContract,
      description: 'some description',
      doneTo: new Date(),
      name: 'some name',
      creationDate: new Date(),
    },
  ];

  beforeEach(() => {
    repoMock.reset();
    service = new TasksService(repoMock.repository);
  });

  it('get all', async () => {
    repoMock.mocks.find.mockReturnValue(realTasks);

    const entities = await service.getAll();
    expect(repoMock.mocks.find.mock.calls.length).toBe(1);
    expect(entities).toStrictEqual(realTasks);
  });

  it('get by id', async () => {
    repoMock.mocks.findOne.mockReturnValue(realTasks[0]);

    const entity = await service.getById(4353);
    expect(repoMock.mocks.findOne.mock.calls.length).toBe(1);
    expect(repoMock.mocks.findOne.mock.calls[0][0]).toBe(4353);
    expect(entity).toStrictEqual(realTasks[0]);
  });

  it('get by contract id', async () => {
    repoMock.mocks.find.mockReturnValue(realTasks[0]);

    const entity = await service.getByContractId(4353);
    expect(repoMock.mocks.find.mock.calls.length).toBe(1);
    expect(repoMock.mocks.find.mock.calls[0][0]).toStrictEqual({
      where: {
        contract: {
          id: 4353,
        },
      },
    });
    expect(entity).toStrictEqual(realTasks[0]);
  });

  it('insert', async () => {
    repoMock.mocks.insert.mockResolvedValue({
      identifiers: [
        {
          id: 43,
        },
      ],
    });
    const entityId = await service.insert(realTasks[0]);
    expect(repoMock.mocks.insert.mock.calls.length).toBe(1);
    expect(repoMock.mocks.insert.mock.calls[0][0]).toStrictEqual(realTasks[0]);
    expect(entityId).toBe(43);
  });
});
