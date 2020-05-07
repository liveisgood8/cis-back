import { Tags, Route, Security, Controller, Get, Response, Query } from 'tsoa';
import { SearchService } from '../../services/search';
import Container from 'typedi';
import { IError } from '../../core/types';
import { CodeError } from '../../utils/error-with-code';
import { Errors } from '../../utils/errors';
import { Client } from '../../models/client';
import { Contract } from '../../models/contract';
import { Task } from '../../models/task';
import { BusinessRequest } from '../../models/request';

@Tags('Search')
@Route('/search')
@Security('JWT')
export class SearchController extends Controller {
  private service: SearchService;
  constructor() {
    super();
    this.service = Container.get(SearchService);
  }

  @Response<IError>('500', 'Ошибка получения прав из базы')
  @Get()
  public async search(
    @Query('scope') scope: 'clients' | 'contracts' | 'tasks' | 'requests',
    @Query('query') query: string,
  ): Promise<Client[] | Contract[] | Task[] | BusinessRequest[]> {
    try {
      return await this.service.search(scope, query);
    } catch (err) {
      throw new CodeError(Errors.SERVICE_ERROR,
        500,
        err.message);
    }
  }
}
