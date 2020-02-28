import { Controller, Route, Get, Query } from 'tsoa';
import { Task } from '../../models/task';
import Container from 'typedi';
import { TasksService } from '../../services/tasks';

@Route('/tasks')
export class TasksController extends Controller {
  private service: TasksService;

  constructor() {
    super();
    this.service = Container.get(TasksService);
  }

  /**
   * @isInt contractId Contract id must be an integer
   */
  @Get('/all')
  public async getAll(@Query('contractId') contractId?: number): Promise<Task[]> {
    return contractId ?
      this.service.getByContractId(contractId) :
      this.service.getAll();
  }
}
