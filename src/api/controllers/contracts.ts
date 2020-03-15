import { Controller, Route, Get, Query, Post, Body, Response, Tags, Security, Request, SuccessResponse } from 'tsoa';
import * as multer from 'multer';
import * as express from 'express';
import { sep } from 'path';
import { Contract } from '../../models/contract';
import Container from 'typedi';
import { ContractsService } from '../../services/contracts';
import { IError } from '../../core/types';
import { Errors } from '../../utils/errors';
import { CodeError } from '../../utils/error-with-code';
import multerUpload from '../../utils/multer-uploader';
import { PermissionsService } from '../../services/permissions';
import { User } from '../../models/user';
import { Permissions } from '../../models/permissions';

interface IContractCreateRequestBody {
  /**
   * @isInt clientId must be an integer
   */
  clientId: number;
  name: string;
  conclusionDate: Date;
  copyPath: string;
  comment?: string;
}

interface ICopyUploadResponse {
  contentPath: string;
}

@Tags('Contracts')
@Security('JWT')
@Route('/contracts')
export class ContractsController extends Controller {
  private service: ContractsService;
  private permissionService: PermissionsService;

  constructor() {
    super();
    this.service = Container.get(ContractsService);
    this.permissionService = Container.get(PermissionsService);
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
  @Response<IError>('403', 'Нет прав для добавление нового договора')
  @Response<IError>('406', 'Ошибка добавление нового договора в базу')
  @Post()
  public async insertContract(
    @Request() req: Express.Request,
    @Body() requestBody: IContractCreateRequestBody,
  ): Promise<number | IError> {
    await this.permissionService.mustHavePermission((req.user as User).id, Permissions.ADD_CONTRACTS);
    try {
      this.setStatus(201);
      return await this.service.insert({
        name: requestBody.name,
        conclusionDate: requestBody.conclusionDate,
        comment: requestBody.comment,
        scanPath: requestBody.copyPath,
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

  @SuccessResponse('201', 'Договор успешно загружен')
  @Response<ICopyUploadResponse>('201')
  @Response<IError>('406', 'Ошибка загрузки договора на сервер')
  @Post('/uploadCopyFile')
  public async uploadContractCopy(@Request() requestBody: express.Request): Promise<ICopyUploadResponse | IError> {
    try {
      const file = await this.handleContractCopyFile(requestBody);
      return {
        contentPath: file.path.replace(`public${sep}`, ''),
      };
    } catch (err) {
      return {
        code: Errors.FILE_UPLOAD_ERROR,
        message: err.message,
      };
    }
  }

  private handleContractCopyFile(requestBody: express.Request): Promise<Express.Multer.File> {
    const multerSingle = multerUpload.single('contractCopyFile');
    return new Promise((resolve, reject) => {
      multerSingle(requestBody, undefined, async (error) => {
        if (error) {
          reject(error);
        }
        resolve(requestBody.file);
      });
    });
  }
}
