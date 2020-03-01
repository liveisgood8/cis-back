import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Task } from '../models/task';
import { Contract } from '../models/contract';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Service()
export class TasksService {
  constructor(
    private tasksRepository: Repository<Task>,
  ) {}

  public async getAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  public async getByContractId(id: number): Promise<Task[]> {
    const contract = new Contract();
    contract.id = id;

    return this.tasksRepository.find({
      where: {
        contract: contract,
      },
    });
  }

  public async insert(client: QueryDeepPartialEntity<Task>): Promise<number> {
    const result = await this.tasksRepository.insert(client);
    return result.identifiers[0].id;
  }
}
