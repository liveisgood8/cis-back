import { createMockedRepository } from '../../test-utils/mockedRepo';
import { UserPermissions, Permissions } from '../../../src/models/permissions';
import { PermissionsService } from '../../../src/services/permissions';
import { User } from '../../../src/models/user';
import { CodeError } from '../../../src/utils/error-with-code';
import { Errors } from '../../../src/utils/errors';

describe('permissions service - unit', () => {
  let service: PermissionsService;
  const repoMock = createMockedRepository<UserPermissions>();

  const realPermissions: UserPermissions[] = [
    {
      id: 1,
      permissionId: Permissions.ADD_CLIENTS,
      user: {
        id: 1,
      } as User,
    },
    {
      id: 2,
      permissionId: Permissions.ADD_TASKS,
      user: {
        id: 1,
      } as User,
    },
  ];

  beforeEach(() => {
    repoMock.reset();
    service = new PermissionsService(repoMock.repository);
  });

  it('get all', async () => {
    repoMock.mocks.find.mockReturnValue(realPermissions);
    const permissions = await service.getAll(1);
    expect(repoMock.mocks.find.mock.calls.length).toBe(1);
    expect(repoMock.mocks.find.mock.calls[0][0]).toStrictEqual({
      where: {
        user: {
          id: 1,
        },
      },
    });
    expect(permissions).toStrictEqual(
      realPermissions.map((e) => e.permissionId));
  });

  it('is has permission (true)', async () => {
    repoMock.mocks.findOne.mockReturnValue(realPermissions[0]);
    const isHas = await service.isHasPermission(1, Permissions.ADD_CLIENTS);
    expect(repoMock.mocks.findOne.mock.calls.length).toBe(1);
    expect(repoMock.mocks.findOne.mock.calls[0][0]).toStrictEqual({
      where: {
        user: {
          id: 1,
        },
        permissionId: Permissions.ADD_CLIENTS,
      },
    });
    expect(isHas).toBe(true);
  });

  it('is has permission (false)', async () => {
    repoMock.mocks.findOne.mockReturnValue(undefined);
    const isHas = await service.isHasPermission(1, Permissions.ADD_CLIENTS);
    expect(isHas).toBe(false);
  });

  it('set permission', async () => {
    await service.setPermission(6, Permissions.REGISTER_REQUEST);
    expect(repoMock.mocks.save.mock.calls.length).toBe(1);
    expect(repoMock.mocks.save.mock.calls[0][0]).toStrictEqual({
      user: {
        id: 6,
      },
      permissionId: Permissions.REGISTER_REQUEST,
    });
  });

  it('must have permission (true)', async () => {
    repoMock.mocks.findOne.mockReturnValue(realPermissions[0]);
    try {
      await service.mustHavePermission(3, Permissions.ADD_CLIENTS);
    } catch (err) {
      fail('it should not be reached');
    }
    expect(repoMock.mocks.findOne.mock.calls.length).toBe(1);
    expect(repoMock.mocks.findOne.mock.calls[0][0]).toStrictEqual({
      where: {
        user: {
          id: 3,
        },
        permissionId: Permissions.ADD_CLIENTS,
      },
    });
  });

  it('must have permission (false)', async () => {
    repoMock.mocks.findOne.mockReturnValue(undefined);
    try {
      await service.mustHavePermission(3, Permissions.ADD_CLIENTS);
      fail('it should not be reached');
    } catch (err) {
      expect(err).toStrictEqual(
          new CodeError(Errors.NO_PERMISSION_FOR_RESOURCE, 403));
    }
  });
});
