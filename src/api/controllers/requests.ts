import { Controller, Route, Get, Post, Body, Response, Tags, Security, Request, Patch } from 'tsoa';
import Container from 'typedi';
import { IError } from '../../core/types';
import { Errors } from '../../utils/errors';
import { CodeError } from '../../utils/error-with-code';
import { BusinessRequest } from '../../models/request';
import { BusinessRequestsService } from '../../services/requests';
import { Request as ExpressRequest} from 'express';
import { User } from '../../models/user';

interface IRequestCreateBody {
  /**
   * @isInt userId must be an integer
   */
  userId: number;
  /**
   * @isInt contractId must be an integer
   */
  contractId: number;
  message: string;
}

interface ISetHandledBody {
  /**
   * @isInt requestId must be an integer
   */
  requestId: number;
  email: string;
  answer: string;
}


@Tags('BusinessRequests')
@Security('JWT')
@Route('/business-requests')
export class BusinessRequestsController extends Controller {
  private service: BusinessRequestsService;

  constructor() {
    super();
    this.service = Container.get(BusinessRequestsService);
  }

  @Get('/pending-count')
  public async getPendingCount(@Request() req: ExpressRequest): Promise<number> {
    return this.service.getPendingCountForUser((req.user as User).id);
  }


  @Get()
  public async getAll(@Request() req: ExpressRequest): Promise<BusinessRequest[]> {
    return this.service.getForUser((req.user as User).id);
  }

  @Response<number>('201', 'Обращение успешно обработано')
  @Response<IError>('500', 'Ошибка обработки обращения')
  @Patch()
  public async setHandled(@Body() requestBody: ISetHandledBody): Promise<void | IError> {
    // TODO
  }

  @Response<number>('201', 'Обращение успешно добавлено')
  @Response<IError>('406', 'Ошибка добавление нового обращения в базу')
  @Post()
  public async insert(@Body() requestBody: IRequestCreateBody): Promise<number | IError> {
    try {
      this.setStatus(201);
      return await this.service.insert({
        contract: {
          id: requestBody.contractId,
        },
        user: {
          id: requestBody.userId,
        },
        isHandled: false,
        message: requestBody.message,
      });
    } catch (err) {
      this.setStatus(406);
      throw new CodeError(Errors.INSERT_ENTITY_ERROR,
          406,
          err.message);
    }
  }
}
