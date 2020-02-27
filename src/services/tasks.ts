import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Task } from '../models/task';
import { Contract } from '../models/contract';

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
}
