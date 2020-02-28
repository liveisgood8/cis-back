import { Service } from 'typedi';
import { Repository, QueryFailedError } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Contract } from '../models/contract';
import { Client } from '../models/client';
import { IError } from '../core/types';
import { Errors } from '../utils/errors';

@Service()
export class ContractsService {
  constructor(
    private contractsRepository: Repository<Contract>,
  ) { }

  public async getAll(): Promise<Contract[]> {
    return this.contractsRepository.find();
  }

  public async getByClientId(id: number): Promise<Contract[]> {
    const client = new Client();
    client.id = id;

    return this.contractsRepository.find({
      where: {
        client: client,
      },
    });
  }

  public async insert(contract: QueryDeepPartialEntity<Contract>): Promise<void | IError> {
    try {
      await this.contractsRepository.insert(contract);
    } catch (err) {
      console.error(err);
      return {
        code: Errors.INSERT_ENTITY_ERROR,
        message: err.message,
      };
    }
  }
}
