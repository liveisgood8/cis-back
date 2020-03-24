import { Controller, Route, Get, Post, Body, Response, Tags, Security, Request, Patch, Query } from 'tsoa';
import Container, { Inject } from 'typedi';
import { IError } from '../../core/types';
import { Errors } from '../../utils/errors';
import { CodeError } from '../../utils/error-with-code';
import { BusinessRequest } from '../../models/request';
import { BusinessRequestsService } from '../../services/requests';
import { Request as ExpressRequest} from 'express';
import { User } from '../../models/user';
import { MailService } from '../../services/mail';

interface IRequestCreateBody {
  /**
   * @isInt userId must be an integer
   */
  userId: number;
  /**
   * @isInt contractId must be an integer
   */
  contractId: number;
  title: string;
  message: string;
}

interface ISetHandledBody {
  /**
   * @isInt requestId must be an integer
   */
  requestId: number;
  email: string;
  answer: {
    subject: string;
    body: string;
  };
}

interface IGetPendingNumberResponse {
  pendingNumber: number;
}

@Tags('BusinessRequests')
@Security('JWT')
@Route('/business-requests')
export class BusinessRequestsController extends Controller {
  private service: BusinessRequestsService;
  private mailService: MailService;

  constructor() {
    super();
    this.service = Container.get(BusinessRequestsService);
    this.mailService = Container.get(MailService);
  }

  @Get('/pending-number')
  public async getPendingCount(@Request() req: ExpressRequest): Promise<IGetPendingNumberResponse> {
    const pendingNumber = await this.service.getPendingCountForUser((req.user as User).id);
    return {
      pendingNumber: pendingNumber,
    };
  }


  /** @isInt id Request id must be a number */
  @Get()
  public async getByIdOrAll(
    @Request() req: ExpressRequest,
    @Query('id') id?: number,
  ): Promise<BusinessRequest[] | BusinessRequest> {
    if (id) {
      return this.service.getByIdForUser(id, (req.user as User).id);
    } else {
      return this.service.getForUser((req.user as User).id);
    }
  }

  @Response<number>('201', 'Обращение успешно обработано')
  @Response<IError>('500', 'Ошибка обработки обращения')
  @Patch()
  public async setHandled(@Body() requestBody: ISetHandledBody): Promise<void | IError> {
    try {
      this.setStatus(201);
      await this.service.handle(requestBody.requestId, {
        email: requestBody.email,
        message: {
          subject: requestBody.answer.subject,
          body: requestBody.answer.body,
        },
      });
    } catch (err) {
      this.setStatus(500);
      throw new CodeError(Errors.UPDATE_ENTITY_ERROR,
          406,
          err.message);
    }
  }

  @Response<number>('201', 'Обращение успешно добавлено')
  @Response<IError>('406', 'Ошибка добавление нового обращения в базу')
  @Post()
  public async insert(@Body() requestBody: IRequestCreateBody): Promise<BusinessRequest | IError> {
    try {
      this.setStatus(201);
      return await this.service.save({
        contract: {
          id: requestBody.contractId,
        },
        user: {
          id: requestBody.userId,
        },
        isHandled: false,
        title: requestBody.title,
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
