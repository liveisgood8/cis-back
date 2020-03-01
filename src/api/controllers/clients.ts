import { Controller, Route, Get, Tags, Query, Body, Post, Response, Security } from 'tsoa';
import Container from 'typedi';
import { Client } from '../../models/client';
import { ClientsService } from '../../services/clients';
import { IError } from '../../core/types';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Errors } from '../../utils/errors';
import { CodeError } from '../../utils/error-with-code';

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
// @Security('JWT')
@Route('/clients')
export class ClientsController extends Controller {
  private service: ClientsService;

  constructor() {
    super();
    this.service = Container.get(ClientsService);
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
  @Response<IError>('406', 'Ошибка добавление нового клиента в базу')
  @Post()
  public async insert(
    @Body() requestBody: IClientCreateRequestBody,
  ): Promise<number | IError> {
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
