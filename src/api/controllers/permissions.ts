import { Controller, Route, Security, Get, Request, Tags, Response } from 'tsoa';
import { Permissions } from '../../models/permissions';
import { IError } from '../../core/types';
import { PermissionsService } from '../../services/permissions';
import Container from 'typedi';
import { Errors } from '../../utils/errors';
import { User } from '../../models/user';
import { CodeError } from '../../utils/error-with-code';

@Tags('Permissions')
@Route('/permissions')
@Security('JWT')
export class PermissionsController extends Controller {
  private service: PermissionsService;
  constructor() {
    super();
    this.service = Container.get(PermissionsService);
  }

  @Response<IError>('500', 'Ошибка получения прав из базы')
  @Get()
  public async getAll(
    @Request() req: Express.Request,
  ): Promise<Permissions[]> {
    try {
      return await this.service.getAll((req.user as User).id);
    } catch (err) {
      throw new CodeError(Errors.SERVICE_ERROR,
        500,
        err.message);
    }
  }
}
