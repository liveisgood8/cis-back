import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Client } from '../models/client';
import { BusinessRequest } from '../models/request';

@Service()
export class BusinessRequestsService {
  constructor(
    private requestsRepository: Repository<BusinessRequest>,
  ) { }

  public async getForUser(id: number): Promise<BusinessRequest[]> {
    const client = new Client();
    client.id = id;

    return this.requestsRepository.find({
      where: {
        client: client,
      },
    });
  }

  public async getPendingCountForUser(id: number): Promise<number> {
    const client = new Client();
    client.id = id;

    return this.requestsRepository.count({
      where: {
        client: client,
      },
    });
  }

  public async insert(contract: QueryDeepPartialEntity<BusinessRequest>): Promise<number> {
    const result = await this.requestsRepository.insert(contract);
    return result.identifiers[0].id;
  }
}
