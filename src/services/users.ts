import { Service } from 'typedi';
import { User } from '../models/user';
import { Repository } from 'typeorm';

@Service()
export class UsersService {
  constructor(
    private userRepository: Repository<User>,
  ) {}

  public async getById(id: number): Promise<User | undefined> {
    const user = this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    return user;
  }

  public async getAll(): Promise<User[]> {
    const users = this.userRepository.find();
    return users;
  }
}
