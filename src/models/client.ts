import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
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

  /**
   * @maxLength 128
   */
  @Column({ length: 128 })
  email: string;

  @Column({ length: 255 })
  address: string;

  /**
   * @maxLength 128
   */
  @Column({ length: 128 })
  comment?: string;

  @CreateDateColumn()
  creationDate?: Date;

  @OneToMany((type) => Contract, (contract) => contract.client)
  contracts: Contract[];
}
