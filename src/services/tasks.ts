import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Task } from '../models/task';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Service()
export class TasksService {
  constructor(
    private tasksRepository: Repository<Task>,
  ) {}

  public async getById(id: number): Promise<Task> {
    return this.tasksRepository.findOne(id, {
      relations: ['contract', 'contract.client'],
    });
  }

  public async getAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  public async getByContractId(id: number): Promise<Task[]> {
    return this.tasksRepository.find({
      where: {
        contract: {
          id,
        },
      },
    });
  }

  public async insert(client: QueryDeepPartialEntity<Task>): Promise<number> {
    const result = await this.tasksRepository.insert(client);
    return result.identifiers[0].id;
  }
}
