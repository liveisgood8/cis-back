import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Client } from '../models/client';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Service()
export class ClientsService {
  constructor(
    private clientRepository: Repository<Client>,
  ) {}

  public async getAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  public async getById(id: number): Promise<Client> {
    return this.clientRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  public async insert(client: QueryDeepPartialEntity<Client>): Promise<number> {
    const result = await this.clientRepository.insert(client);
    return result.identifiers[0].id;
  }
}
