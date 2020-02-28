import { Controller, Route, Get, Query, Put, Post, Body } from 'tsoa';
import { Contract, IContractCreateRequestBody } from '../../models/contract';
import Container from 'typedi';
import { ContractsService } from '../../services/contracts';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IError } from '../../core/types';
import { QueryFailedError } from 'typeorm';

@Route('/contracts')
export class ContractsController extends Controller {
  private service: ContractsService;

  constructor() {
    super();
    this.service = Container.get(ContractsService);
  }

  /**
   * @isInt clientId Contract id must be an integer
   */
  @Get('/all')
  public async getByClientId(@Query('clientId') clientId?: number): Promise<Contract[]> {
    if (!clientId) {
      return this.service.getAll();
    } else {
      return this.service.getByClientId(clientId);
    }
  }

  @Post('/insert')
  public async insertContract(@Body() requestBody: IContractCreateRequestBody): Promise<void | IError> {
    const contract: QueryDeepPartialEntity<Contract> = {
      name: requestBody.name,
      client: {
        id: requestBody.clientId,
      },
    };

    return this.service.insert(contract);
  }
}
