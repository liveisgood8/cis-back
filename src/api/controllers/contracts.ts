import { Controller, Route, Get, Query, Post, Body, Response, Tags, Security } from 'tsoa';
import * as HttpStatus from 'http-status-codes';
import { Contract } from '../../models/contract';
import Container from 'typedi';
import { ContractsService } from '../../services/contracts';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IError } from '../../core/types';
import { Errors } from '../../utils/errors';
import { CodeError } from '../../utils/error-with-code';

interface IContractCreateRequestBody {
  /**
   * @isInt clientId must be an integer
   */
  clientId: number;
  name: string;
  conclusionDate: Date;
  comment?: string;
}

@Tags('Contracts')
// @Security('JWT')
@Route('/contracts')
export class ContractsController extends Controller {
  private service: ContractsService;

  constructor() {
    super();
    this.service = Container.get(ContractsService);
  }

  /**
   * @isInt clientId Client id must be an integer
   */
  @Get()
  public async getByClientIdOrAll(@Query('clientId') clientId?: number): Promise<Contract[]> {
    return clientId ?
      this.service.getByClientId(clientId) :
      this.service.getAll();
  }

  @Response<number>('201', 'Клиент успешно добавлен')
  @Response<IError>('406', 'Ошибка добавление нового договора в базу')
  @Post()
  public async insertContract(@Body() requestBody: IContractCreateRequestBody): Promise<number | IError> {
    try {
      this.setStatus(201);
      return await this.service.insert({
        name: requestBody.name,
        conclusionDate: requestBody.conclusionDate,
        comment: requestBody.comment,
        scanPath: 'TODO', // TODO
        client: {
          id: requestBody.clientId,
        },
      });
    } catch (err) {
      this.setStatus(406);
      throw new CodeError(Errors.INSERT_ENTITY_ERROR,
          406,
          err.message);
    }
  }
}
