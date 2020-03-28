import { ClientsService } from '../../../src/services/clients';
import { Client } from '../../../src/models/client';
import { createMockedRepository } from '../../test-utils/mockedRepo';

describe('clients service - unit', () => {
  let service: ClientsService;
  const repoMock = createMockedRepository<Client>();

  const realClients: Client[] = [
    {
      id: 1,
      address: 'street 1',
      email: 'email 1',
      name: 'name 1',
      creationDate: new Date(),
      contracts: [],
      comment: 'some comment 1',
    },
  ];

  beforeEach(() => {
    repoMock.reset();
    service = new ClientsService(repoMock.repository);
  });

  it('get all', async () => {
    repoMock.mocks.find.mockReturnValue(realClients);

    const entities = await service.getAll();
    expect(repoMock.mocks.find.mock.calls.length).toBe(1);
    expect(entities).toStrictEqual(realClients);
  });

  it('get by id', async () => {
    repoMock.mocks.findOne.mockReturnValue(realClients[0]);

    const entity = await service.getById(4353);
    expect(repoMock.mocks.findOne.mock.calls.length).toBe(1);
    expect(repoMock.mocks.findOne.mock.calls[0][0]).toStrictEqual({
      where: {
        id: 4353,
      },
    });
    expect(entity).toStrictEqual(realClients[0]);
  });

  it('insert', async () => {
    repoMock.mocks.insert.mockResolvedValue({
      identifiers: [
        {
          id: 43,
        },
      ],
    });
    const entityId = await service.insert(realClients[0]);
    expect(repoMock.mocks.insert.mock.calls.length).toBe(1);
    expect(repoMock.mocks.insert.mock.calls[0][0]).toStrictEqual(realClients[0]);
    expect(entityId).toBe(43);
  });
});
