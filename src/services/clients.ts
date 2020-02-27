import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Client } from '../models/client';

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
}
