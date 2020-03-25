import { UsersService } from '../../src/services/users';
import { Repository } from 'typeorm';
import { User } from '../../src/models/user';
import mock from 'mock-fs';
import { resolve } from 'path';
import { DirectoryItems } from 'mock-fs/lib/filesystem';

describe('user service testing', () => {
  afterEach(mock.restore);

  const testUsers: User[] = [
    {
      id: 1,
      login: 'user1',
      creationDate: new Date(),
      name: 'alex',
      surname: 'barkov',
      password: 'erbgefR#Btv2cf43',
      imageUrl: 'image_url1',
      permissions: [],
      requests: [],
    },
    {
      id: 3,
      login: 'user4741',
      creationDate: new Date(),
      name: 'kostya',
      surname: 'mesoi',
      password: 'r3v45gb54#Btv2cf43',
      imageUrl: 'image_url2',
      permissions: [],
      requests: [],
    },
  ];


  it('get all', async () => {
    const findMock = jest.fn().mockReturnValue(testUsers); 
    const mockedRepo: Partial<Repository<User>> = {
      find: findMock,
    };
    const service = new UsersService(mockedRepo as Repository<User>);

    const users = await service.getAll();
    expect(users).toEqual(testUsers);
    expect(findMock.mock.calls.length).toBe(1);
  });

  it('get by id', async () => {
    const findOneMock = jest.fn().mockReturnValue(testUsers[1]);
    const mockedRepo: Partial<Repository<User>> = {
      findOne: findOneMock,
    };
    const service = new UsersService(mockedRepo as Repository<User>);
    const user = await service.getById(3);
    expect(findOneMock.mock.calls[0][0]).toStrictEqual({
      where: {
        id: 3,
      },
    });
    expect(user).toEqual(testUsers[1]);

    findOneMock.mockReturnValue(undefined);
    expect(findOneMock.mock.calls.length).toBe(1);
    expect(await service.getById(3)).toBe(undefined);
  });

  it('update', async () => {
    const saveMock = jest.fn();
    const mockedRepo: Partial<Repository<User>> = {
      save: saveMock,
    };

    const service = new UsersService(mockedRepo as Repository<User>);

    saveMock.mockReturnValue(testUsers[0]);
    const user = await service.update(testUsers[0]);

    expect(user).toStrictEqual(testUsers[0]);
    expect(saveMock.mock.calls.length).toBe(1);
  });

  it('get profile images', async () => {
    const imagesPath = resolve(__dirname, '../../../public/profile-images/');

    const images = {
      'image1.png': 'content',
      'image2.png': 'content',
      'image4.png': 'content',
      'image5.png': 'content',
    };
    const fsMockObject: DirectoryItems = {};
    fsMockObject[imagesPath] = images;

    mock(fsMockObject);
    const service = new UsersService(undefined as Repository<User>);
    const serviceImages = await service.getProfileImages();
    expect(serviceImages).toStrictEqual(Object.keys(images).map((e) => '/profile-images/' + e));
  });
});
