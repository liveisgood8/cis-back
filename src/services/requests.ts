import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BusinessRequest } from '../models/request';
import { User } from '../models/user';

@Service()
export class BusinessRequestsService {
  constructor(
    private requestsRepository: Repository<BusinessRequest>,
  ) { }

  public async getForUser(id: number): Promise<BusinessRequest[]> {
    const user = new User();
    user.id = id;

    return this.requestsRepository.find({
      where: {
        user: user,
      },
    });
  }

  public async getPendingCountForUser(id: number): Promise<number> {
    const user = new User();
    user.id = id;

    return this.requestsRepository.count({
      where: {
        user: user,
      },
    });
  }

  public async insert(contract: QueryDeepPartialEntity<BusinessRequest>): Promise<number> {
    const result = await this.requestsRepository.insert(contract);
    return result.identifiers[0].id;
  }
}
