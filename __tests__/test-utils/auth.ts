import { sign } from 'jsonwebtoken';
import config from '../../src/config';
import { User } from '../../src/models/user';
import Container from 'typedi';
import { AuthService } from '../../src/services/auth';
import { UserPermissions, Permissions } from '../../src/models/permissions';
import { PermissionsService } from '../../src/services/permissions';

export function getTestToken(): string {
  const jwtPayload = {
    user: {
      id: 1,
      login: 'l',
      password: 'p',
      imageUrl: 'i',
    } as User,
  };
  const accessToken = sign(jwtPayload, config.jwt.access.secretKey, {
    audience: config.jwt.audience,
    expiresIn: config.jwt.access.duration,
  });
  return accessToken.toString();
}

export async function addTestSuperUser(): Promise<void> {
  const service = Container.get(AuthService);
  await service.register({
    login: 'l',
    password: 'p',
    imageUrl: 'i',
    name: 'n',
    surname: 'sn',
  });

  const permService = Container.get(PermissionsService);
  await permService.setPermission(1, Permissions.REGISTER_REQUEST);
  await permService.setPermission(1, Permissions.ADD_CLIENTS);
  await permService.setPermission(1, Permissions.ADD_CONTRACTS);
  await permService.setPermission(1, Permissions.ADD_TASKS);
}