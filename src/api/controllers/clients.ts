import { Controller, Route, Get, Tags, Query, Body, Post, Response, Security, Request } from 'tsoa';
import Container from 'typedi';
import { Client } from '../../models/client';
import { ClientsService } from '../../services/clients';
import { IError } from '../../core/types';
import { Errors } from '../../utils/errors';
import { CodeError } from '../../utils/error-with-code';
import { PermissionsService } from '../../services/permissions';
import { Permissions } from '../../models/permissions';
import { User } from '../../models/user';

interface IClientCreateRequestBody {
  name: string;
  /**
   * @maxLength 128
   */
  email: string;
  address: string;
  comment?: string;
}

@Tags('Clients')
@Security('JWT')
@Route('/clients')
export class ClientsController extends Controller {
  private service: ClientsService;
  private permissionService: PermissionsService;

  constructor() {
    super();
    this.service = Container.get(ClientsService);
    this.permissionService = Container.get(PermissionsService);
  }

  /**
   * @isInt id Id must be an integer
   */
  @Get()
  public async getByIdOrAll(@Query('id') id?: number): Promise<Client[] | Client | IError> {
    return id ?
      this.service.getById(id) :
      this.service.getAll();
  }

  @Response<number>('201', 'Клиент успешно добавлен')
  @Response<IError>('403', 'Нет прав для добавление нового клиента')
  @Response<IError>('500', 'Ошибка добавление нового клиента в базу')
  @Post()
  public async insert(
    @Body() requestBody: IClientCreateRequestBody,
    @Request() req: Express.Request,
  ): Promise<number | IError> {
    await this.permissionService.mustHavePermission((req.user as User).id, Permissions.ADD_CLIENTS);
    try {
      this.setStatus(201);
      return await this.service.insert({
        name: requestBody.name,
        email: requestBody.email,
        address: requestBody.address,
        comment: requestBody.comment,
      });
    } catch (err) {
      this.setStatus(406);
      throw new CodeError(Errors.INSERT_ENTITY_ERROR,
        406,
        err.message);
    }
  }
}
