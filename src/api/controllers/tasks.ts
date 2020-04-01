import { Controller, Route, Get, Query, Tags, Body, Security, Response, Post, Request } from 'tsoa';
import { Task } from '../../models/task';
import Container from 'typedi';
import { TasksService } from '../../services/tasks';
import { IError } from '../../core/types';
import { Errors } from '../../utils/errors';
import { CodeError } from '../../utils/error-with-code';
import { PermissionsService } from '../../services/permissions';
import { User } from '../../models/user';
import { Permissions } from '../../models/permissions';

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
@Security('JWT')
@Route('/tasks')
export class TasksController extends Controller {
  private service: TasksService;
  private permissionService: PermissionsService;

  constructor() {
    super();
    this.service = Container.get(TasksService);
    this.permissionService = Container.get(PermissionsService);
  }

  /** @isInt contractId Contract id must be an integer */
  @Response<IError>('500', 'Ошибка получения задач из базы')
  @Get()
  public async getAll(
    @Query('contractId') contractId?: number,
  ): Promise<Task[]> {
    if (contractId) {
      return this.service.getByContractId(contractId);
    } else {
      return this.service.getAll();
    }
  }

  /** @isInt taskId Contract id must be an integer */
  @Response<IError>('500', 'Ошибка получения задачи из базы')
  @Get('{id}')
  public async getById(
    id: number,
  ): Promise<Task> {
    return this.service.getById(id);
  }

  @Response<IError>('403', 'Нет прав для добавление новой задачи')
  @Response<IError>('500', 'Ошибка добавление новой задачи в базу')
  @Post()
  public async insert(
    @Request() req: Express.Request,
    @Body() requestBody: ITaskCreateRequestBody,
  ): Promise<number> {
    await this.permissionService.mustHavePermission((req.user as User).id, Permissions.ADD_TASKS);
    try {
      return this.service.insert({
        contract: {
          id: requestBody.contractId,
        },
        name: requestBody.name,
        description: requestBody.description,
        doneTo: requestBody.doneTo,
      });
    } catch (err) {
      throw new CodeError(Errors.INSERT_ENTITY_ERROR,
        500,
        err.message);
    }
  }
}
