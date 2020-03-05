import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract';
import { User } from './user';

@Entity()
export class BusinessRequest {
  /**
   * @isInt Contract id should be an integer
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  isHandled: boolean;

  @ManyToOne((type) => User, (user) => user.requests)
  user: User;

  @ManyToOne((type) => Contract, (contract) => contract.requests)
  contract: Contract;

  @CreateDateColumn()
  creationDate?: Date;
}
