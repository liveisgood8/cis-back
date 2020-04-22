import { AuthService, getPasswordHashWithSalt } from '../../../src/services/auth';
import { Repository } from 'typeorm';
import { User } from '../../../src/models/user';
import { CodeError } from '../../../src/utils/error-with-code';
import { Errors } from '../../../src/utils/errors';

describe('auth service - unit', () => {
  const user: Partial<User> = {
    id: 1,
    login: 'user1',
    name: 'alex',
    surname: 'barkov',
    password: 'real_password',
    imageUrl: 'image_url1',
  };

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
      const correctUser: Partial<User> = {
        ...user,
        password: getPasswordHashWithSalt(user.password),
      };
      const queryBuilderMock = jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(correctUser),
      }));
      const mockedRepo: Partial<Repository<User>> = {
        createQueryBuilder: queryBuilderMock as any,
      };
      const service = new AuthService(mockedRepo as Repository<User>);
      const loginResult = await service.login('l', 'real_password');
      expect(queryBuilderMock).toHaveBeenCalledTimes(1);
      expect(loginResult.user).toStrictEqual({
        id: correctUser.id,
        login: correctUser.login,
        name: correctUser.name,
        surname: correctUser.surname,
        imageUrl: correctUser.imageUrl,
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
        await service.register(user as User);
        fail('it should not be reached');
      } catch (err) {
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(err).toStrictEqual(new CodeError(Errors.REGISTER_USER_IS_EXIST, 406));
      }
    });

    it('correct - user not exist', async () => {
      findOne.mockReturnValueOnce(undefined);
      const service = new AuthService(mockedRepo as Repository<User>);
      await service.register({
        ...user,
        id: undefined,
      } as User);
      expect(findOne).toHaveBeenCalledTimes(1);
      expect(insert).toHaveBeenCalledTimes(1);
      expect(insert).toHaveBeenCalledWith({
        login: user.login,
        password: getPasswordHashWithSalt(user.password),
        name: user.name,
        surname: user.surname,
        imageUrl: user.imageUrl,
      });
    });
  });
});
