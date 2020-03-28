import { AuthService, getPasswordHashWithSalt } from '../../../src/services/auth';
import { Repository } from 'typeorm';
import { User } from '../../../src/models/user';
import { CodeError } from '../../../src/utils/error-with-code';
import { Errors } from '../../../src/utils/errors';

describe('auth service - unit', () => {
  describe('login', () => {
    it('when user not founded', async () => {
      const queryBuilderMock = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(undefined),
      }));
      const mockedRepo: Partial<Repository<User>> = {
        createQueryBuilder: queryBuilderMock as any,
      };
      const service = new AuthService(mockedRepo as Repository<User>);
      try {
        await service.login('l', 'p');
        fail('it should not be reached');
      } catch (err) {
        expect(err).toStrictEqual(new CodeError(Errors.AUTH_USER_NOT_FOUND, 406));
      }
    });

    it('when wrong password', async () => {
      const user: User = {
        id: 1,
        login: 'user1',
        creationDate: new Date(),
        name: 'alex',
        surname: 'barkov',
        password: 'real_password',
        imageUrl: 'image_url1',
        permissions: [],
        requests: [],
      };
      const queryBuilderMock = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(user),
      }));
      const mockedRepo: Partial<Repository<User>> = {
        createQueryBuilder: queryBuilderMock as any,
      };
      const service = new AuthService(mockedRepo as Repository<User>);
      try {
        await service.login('l', 'wrong_pass');
        fail('it should not be reached');
      } catch (err) {
        expect(err).toStrictEqual(new CodeError(Errors.AUTH_WRONG_PASSWORD, 406));
      }
    });

    it('correct', async () => {
      const user: Partial<User> = {
        id: 1,
        login: 'user1',
        name: 'alex',
        surname: 'barkov',
        password: getPasswordHashWithSalt('real_password'),
        imageUrl: 'image_url1',
      };
      const queryBuilderMock = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(user),
      }));
      const mockedRepo: Partial<Repository<User>> = {
        createQueryBuilder: queryBuilderMock as any,
      };
      const service = new AuthService(mockedRepo as Repository<User>);
      const loginResult = await service.login('l', 'real_password');
      expect(queryBuilderMock.call.length).toBe(1);
      expect(loginResult.user).toStrictEqual({
        id: 1,
        login: 'user1', // TODO May be remove login from user on login
        name: 'alex',
        surname: 'barkov',
        imageUrl: 'image_url1',
      });
      expect(typeof loginResult.accessToken).toBe('string');
      expect(typeof loginResult.refreshToken).toBe('string');
    });
  });

  describe('register', () => {
    const findOne = jest.fn();
    const insert = jest.fn();
    const mockedRepo: Partial<Repository<User>> = {
      findOne,
      insert,
    };

    beforeEach(() => {
      findOne.mockClear();
      insert.mockClear();
    });

    it('when user already exist', async () => {
      findOne.mockReturnValueOnce({
        id: 1,
      });
      const service = new AuthService(mockedRepo as Repository<User>);
      try {
        await service.register('l', 'p', 'n', 'sn', 'img');
        fail('it should not be reached');
      } catch (err) {
        expect(findOne.mock.calls.length).toBe(1);
        expect(err).toStrictEqual(new CodeError(Errors.REGISTER_USER_IS_EXIST, 406));
      }
    });

    it('correct - user not exist', async () => {
      findOne.mockReturnValueOnce(undefined);
      const service = new AuthService(mockedRepo as Repository<User>);
      await service.register('l', 'p', 'n', 'sn', 'img');
      expect(findOne.mock.calls.length).toBe(1);
      expect(insert.mock.calls.length).toBe(1);
      expect(insert.mock.calls[0][0]).toStrictEqual({
        login: 'l',
        password: getPasswordHashWithSalt('p'),
        name: 'n',
        surname: 'sn',
        imageUrl: 'img',
      });
    });
  });
});
