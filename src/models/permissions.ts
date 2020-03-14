import { Entity, Column, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

export enum Permissions {
  /** Добавление новых клиентов */
  ADD_CLIENTS = 1,
  /** Добавление новых договоров */
  ADD_CONTRACTS,
  /** Добавление новых задач */
  ADD_TASKS,
  /** Регистрация обращений */
  REGISTER_REQUEST,
}

@Entity()
@Index(['user', 'permissionId'], { unique: true })
export class UserPermissions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.permissions)
  user: User;

  @Column()
  permissionId: number;
}
