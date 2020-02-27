import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { type } from 'os';
import { Contract } from './contract';

@Entity()
export class Client {
  /**
   * @isInt Client id should be an integer
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @CreateDateColumn()
  creationDate?: Date;

  @OneToMany((type) => Contract, (contract) => contract.client)
  contracts: Contract[];
}
