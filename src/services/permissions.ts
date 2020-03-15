import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { UserPermissions, Permissions } from '../models/permissions';
import { CodeError } from '../utils/error-with-code';
import { Errors } from '../utils/errors';

@Service()
export class PermissionsService {
  constructor(
    private permissionsRepository: Repository<UserPermissions>,
  ) {}

  public async getAll(userId: number): Promise<Permissions[]> {
    const permissions = await this.permissionsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
    return permissions.map((e) => e.permissionId);
  }

  public async isHasPermission(userId: number, permissionId: Permissions): Promise<boolean> {
    const permission = await this.permissionsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        permissionId: permissionId,
      },
    });
    return permission !== undefined;
  }

  public async setPermission(userId: number, permissionId: Permissions): Promise<void> {
    await this.permissionsRepository.save({
      user: {
        id: userId,
      },
      permissionId: permissionId,
    });
  }

  public async mustHavePermission(userId: number, permissionId: Permissions): Promise<void> {
    const isHasPerm = await this.isHasPermission(userId, permissionId);
    if (!isHasPerm) {
      throw new CodeError(Errors.NO_PERMISSION_FOR_RESOURCE, 403);
    }
  }
}
