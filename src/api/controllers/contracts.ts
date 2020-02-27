import { Controller, Route, Get } from 'tsoa';
import { Contract } from '../../models/contract';
import Container from 'typedi';
import { ContractsService } from '../../services/contracts';

@Route('/contracts')
export class ContractsController extends Controller {
  private service: ContractsService;

  constructor() {
    super();
    this.service = Container.get(ContractsService);
  }

  @Get('/all')
  public async getAll(): Promise<Contract[]> {
    return this.service.getAll();
  }

  /**
   * @isInt id Id of client must be an integer
   */
  @Get('/byClientId/{id}')
  public async getByClientId(id: number): Promise<Contract[]> {
    return this.service.getByClientId(id);
  }
}