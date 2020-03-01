import { Controller, Route, Get, Query, Tags, Body, Security, Response, Post } from 'tsoa';
import { Task } from '../../models/task';
import Container from 'typedi';
import { TasksService } from '../../services/tasks';
import { IError } from '../../core/types';
import { Errors } from '../../utils/errors';
import { CodeError } from '../../utils/error-with-code';

interface ITaskCreateRequestBody {
  /**
   * @isInt contractId Contract id must be an integer
   */
  contractId: number;
  name: string;
  description: string;
  doneTo: Date;
}

@Tags('Tasks')
// @Security('JWT')
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
  @Get()
  public async getAll(@Query('contractId') contractId?: number): Promise<Task[]> {
    return contractId ?
      this.service.getByContractId(contractId) :
      this.service.getAll();
  }

  @Response<number>('201', 'Задача успешно добавлен')
  @Response<IError>('406', 'Ошибка добавление новой задачи в базу')
  @Post()
  public async insert(
    @Body() requestBody: ITaskCreateRequestBody,
  ): Promise<number | IError> {
    try {
      this.setStatus(201);
      return this.service.insert({
        contract: {
          id: requestBody.contractId,
        },
        name: requestBody.name,
        description: requestBody.description,
        doneTo: requestBody.doneTo,
      });
    } catch (err) {
      this.setStatus(406);
      throw new CodeError(Errors.INSERT_ENTITY_ERROR,
          406,
          err.message);
    }
  }
}
