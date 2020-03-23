import { Service } from 'typedi';
import { User } from '../models/user';
import { Repository } from 'typeorm';
import { readdir } from 'fs';
import { basename, join, resolve as pathResolve } from 'path';

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

  public async getProfileImages(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      readdir(pathResolve(__dirname, '../../../public/profile-images/'), (err, files) => {
        if (err) {
          reject(err);
        }
        resolve(files ? files.map((e) => '/profile-images/' + basename(e)) : []);
      });
    });
  }
}
