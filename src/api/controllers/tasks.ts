import { Controller, Route, Get } from 'tsoa';
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

  @Get('/all')
  public async getAll(): Promise<Task[]> {
    return this.service.getAll();
  }

  /**
   * @isInt id Contract id must be an integer
   */
  @Get('/byContractId/{id}')
  public async getByContractId(id: number): Promise<Task[]> {
    return this.service.getByContractId(id);
  }
}
