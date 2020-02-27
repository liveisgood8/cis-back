import Container from 'typedi';
import { getRepository } from 'typeorm';
import { AuthService } from '../services/auth';
import { User } from '../models/user';
import { UsersService } from '../services/users';
import { ClientsService } from '../services/clients';
import { Client } from '../models/client';
import { ContractsService } from '../services/contracts';
import { Contract } from '../models/contract';
import { TasksService } from '../services/tasks';
import { Task } from '../models/task';

export default (): void => {
  Container.set(AuthService, new AuthService(getRepository(User)));
  Container.set(UsersService, new UsersService(getRepository(User)));
  Container.set(ClientsService, new ClientsService(getRepository(Client)));
  Container.set(ContractsService, new ContractsService(getRepository(Contract)));
  Container.set(TasksService, new TasksService(getRepository(Task)));
};
