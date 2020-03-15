import { Controller, Route, Security, Get, Request, Tags } from 'tsoa';
import { Permissions } from '../../models/permissions';
import { IError } from '../../core/types';
import { PermissionsService } from '../../services/permissions';
import Container from 'typedi';
import { Errors } from '../../utils/errors';
import { User } from '../../models/user';

@Tags('Permissions')
@Route('/permissions')
@Security('JWT')
export class PermissionsController extends Controller {
  private service: PermissionsService;
  constructor() {
    super();
    this.service = Container.get(PermissionsService);
  }

  @Get()
  public async getAll(
    @Request() req: Express.Request,
  ): Promise<Permissions[] | IError> {
    try {
      return await this.service.getAll((req.user as User).id);
    } catch (err) {
      return {
        code: Errors.SERVICE_ERROR,
        message: err.message,
      };
    }
  }
}
