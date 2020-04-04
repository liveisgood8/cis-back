import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Contract } from '../models/contract';

@Service()
export class ContractsService {
  constructor(
    private contractsRepository: Repository<Contract>,
  ) { }

  public async getAll(): Promise<Contract[]> {
    return this.contractsRepository.find();
  }

  public async getByClientId(id: number): Promise<Contract[]> {
    return this.contractsRepository.find({
      where: {
        client: {
          id,
        },
      },
    });
  }

  public async insert(contract: QueryDeepPartialEntity<Contract>): Promise<number> {
    const result = await this.contractsRepository.insert(contract);
    return result.identifiers[0].id;
  }
}
