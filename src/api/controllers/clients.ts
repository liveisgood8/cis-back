import { Controller, Route, Get } from 'tsoa';
import { Client } from '../../models/client';
import Container from 'typedi';
import { ClientsService } from '../../services/clients';

@Route('/clients')
export class ClientsController extends Controller {
  @Get('/all')
  public async getAll(): Promise<Client[]> {
    const service = Container.get(ClientsService);
    return service.getAll();
  }

  /**
   * @isInt id Id of client must be an integer
   */
  @Get('/id/{id}')
  public async getById(id: number): Promise<Client> {
    const service = Container.get(ClientsService);
    const client = await service.getById(id);
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }
}
