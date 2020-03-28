import { Repository } from 'typeorm';

interface IMocks {
  find: jest.Mock;
  findOne: jest.Mock;
  insert: jest.Mock;
  save: jest.Mock;
  count: jest.Mock;
}

interface IRepoMock<T> {
  repository: Repository<T>;
  mocks: IMocks;
  reset: () => void;
}

export function createMockedRepository<T>(): IRepoMock<T> {
  const mocks: IMocks = {
    find: jest.fn(),
    findOne: jest.fn(),
    insert: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
  };
  const resetFunction = (): void => {
    mocks.find.mockReset();
    mocks.findOne.mockReset();
    mocks.insert.mockReset();
    mocks.save.mockReset();
    mocks.count.mockReset();
  };
  const repo: Partial<Repository<T>> = {
    find: mocks.find,
    findOne: mocks.findOne,
    insert: mocks.insert,
    save: mocks.save,
    count: mocks.count,
  };
  return {
    repository: repo as Repository<T>,
    mocks,
    reset: resetFunction,
  };
}
