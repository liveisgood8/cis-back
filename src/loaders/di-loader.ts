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
import { PermissionsService } from '../services/permissions';
import { UserPermissions } from '../models/permissions';
import { BusinessRequestsService } from '../services/requests';
import { BusinessRequest } from '../models/request';
import { MailService } from '../services/mail';

export default (): void => {
  Container.set(AuthService, new AuthService(getRepository(User)));
  Container.set(UsersService, new UsersService(getRepository(User)));
  Container.set(ClientsService, new ClientsService(getRepository(Client)));
  Container.set(ContractsService, new ContractsService(getRepository(Contract)));
  Container.set(TasksService, new TasksService(getRepository(Task)));
  Container.set(PermissionsService, new PermissionsService(getRepository(UserPermissions)));
  Container.set(BusinessRequestsService, new BusinessRequestsService(getRepository(BusinessRequest)));
  Container.set(MailService, new MailService());
};
