import { Client } from '../../../src/models/client';
import { createMockedRepository } from '../../test-utils/mockedRepo';
import { Contract } from '../../../src/models/contract';
import { ContractsService } from '../../../src/services/contracts';

describe('contracts service - unit', () => {
  let service: ContractsService;
  const repoMock = createMockedRepository<Contract>();

  const realClient: Client = {
    id: 1,
    address: 'street 1',
    email: 'email 1',
    name: 'name 1',
    creationDate: new Date(),
    contracts: [],
    comment: 'some comment 1',
  };

  const realContracts: Contract[] = [
    {
      id: 1,
      client: realClient,
      conclusionDate: new Date(),
      name: 'name of contract',
      scanPath: 'path to contract scan',
      requests: [],
      tasks: [],
      creationDate: new Date(),
      comment: 'some comment 1',
    },
  ];

  beforeEach(() => {
    repoMock.reset();
    service = new ContractsService(repoMock.repository);
  });

  it('get all', async () => {
    repoMock.mocks.find.mockReturnValue(realContracts);

    const entities = await service.getAll();
    expect(repoMock.mocks.find.mock.calls.length).toBe(1);
    expect(entities).toStrictEqual(realContracts);
  });

  it('get by id', async () => {
    repoMock.mocks.find.mockReturnValue(realContracts[0]);

    const entity = await service.getByClientId(4353);
    expect(repoMock.mocks.find.mock.calls.length).toBe(1);
    expect(repoMock.mocks.find.mock.calls[0][0]).toStrictEqual({
      where: {
        client: {
          id: 4353,
        } as Client,
      },
    });
    expect(entity).toStrictEqual(realContracts[0]);
  });

  it('insert', async () => {
    repoMock.mocks.insert.mockResolvedValue({
      identifiers: [
        {
          id: 43,
        },
      ],
    });
    const entityId = await service.insert(realContracts[0]);
    expect(repoMock.mocks.insert.mock.calls.length).toBe(1);
    expect(repoMock.mocks.insert.mock.calls[0][0]).toStrictEqual(realContracts[0]);
    expect(entityId).toBe(43);
  });
});
