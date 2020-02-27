import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Contract } from '../models/contract';
import { Client } from '../models/client';

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
}
