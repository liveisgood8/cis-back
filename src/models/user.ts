import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { BusinessRequest } from './request';
import { UserPermissions } from './permissions';

@Entity()
export class User {
  /**
   * @isInt User id should be an integer
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  login: string;

  @Column()
  password?: string;

  @Column()
  name?: string;

  @Column()
  surname?: string;

  @Column()
  imageId: number;

  @OneToMany((type) => BusinessRequest, (businessRequest) => businessRequest.user)
  requests: BusinessRequest[];

  @OneToMany((type) => UserPermissions, (userPermissions) => userPermissions.user)
  permissions: UserPermissions[];

  @CreateDateColumn()
  creationDate?: Date;
}
