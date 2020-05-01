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
import { makeTransporter } from '../utils/mail';
import { connectionName } from './typeorm-loader';

export default (): void => {
  Container.set(AuthService, new AuthService(getRepository(User, connectionName)));
  Container.set(UsersService, new UsersService(getRepository(User, connectionName)));
  Container.set(ClientsService, new ClientsService(getRepository(Client, connectionName)));
  Container.set(ContractsService, new ContractsService(getRepository(Contract, connectionName)));
  Container.set(TasksService, new TasksService(getRepository(Task, connectionName)));
  Container.set(PermissionsService, new PermissionsService(getRepository(UserPermissions, connectionName)));
  Container.set(MailService, new MailService(makeTransporter()));
  Container.set(BusinessRequestsService, new BusinessRequestsService(
    getRepository(BusinessRequest, connectionName),
    Container.get(MailService)));
};
