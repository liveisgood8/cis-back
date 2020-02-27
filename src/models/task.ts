import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract';

@Entity()
export class Task {
  /**
   * @isInt Task id should be an integer
   */
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Contract, (contract) => contract.tasks)
  contract: Contract;

  @Column({ length: 255 })
  name: string;

  @CreateDateColumn()
  creationDate?: Date;
}
