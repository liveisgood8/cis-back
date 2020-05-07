import { Service } from 'typedi';
import { Repository, Like } from 'typeorm';
import { Task } from '../models/task';
import { Contract } from '../models/contract';
import { Client } from '../models/client';
import { BusinessRequest } from '../models/request';

@Service()
export class SearchService {
  constructor(
    private clientsRepository: Repository<Client>,
    private contractsRepository: Repository<Contract>,
    private tasksRepository: Repository<Task>,
    private requestsRepository: Repository<BusinessRequest>,
  ) { }

  public async search(
    scope: 'clients' | 'contracts' | 'tasks' | 'requests',
    query: string,
  ): Promise<Client[] | Contract[] | Task[] | BusinessRequest[]> {
    switch (scope) {
      case 'clients':
        return this.searchClients(query);
      case 'contracts':
        return this.searchContracts(query);
      case 'tasks':
        return this.searchTasks(query);
      case 'requests':
        return this.searchRequests(query);
    }
  }

  private async searchClients(query: string): Promise<Client[]> {
    return this.clientsRepository.find({
      where: [{
        name: Like(`%${query}%`),
      }, {
        comment: Like(`%${query}%`),
      }, {
        email: Like(`%${query}%`),
      }, {
        address: Like(`%${query}%`),
      }],
    });
  }

  private async searchContracts(query: string): Promise<Contract[]> {
    return this.contractsRepository.find({
      where: [{
        name: Like(`%${query}%`),
      }, {
        comment: Like(`%${query}%`),
      }],
    });
  }

  private async searchTasks(query: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: [{
        name: Like(`%${query}%`),
      }, {
        description: Like(`%${query}%`),
      }],
    });
  }

  private async searchRequests(query: string): Promise<BusinessRequest[]> {
    return this.requestsRepository.find({
      where: [{
        title: Like(`%${query}%`),
      }, {
        message: Like(`%${query}%`),
      }],
    });
  }
}
