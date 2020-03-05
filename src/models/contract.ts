import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './client';
import { Task } from './task';
import { BusinessRequest } from './request';

@Entity()
export class Contract {
  /**
   * @isInt Contract id should be an integer
   */
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Client, (client) => client.contracts)
  client: Client;

  @Column({ length: 255 })
  name: string;

  /** Дата заключения договора */
  @Column()
  conclusionDate: Date;

  @Column({ length: 255 })
  scanPath: string;

  /**
   * @maxLength 128
   */
  @Column({ length: 128, nullable: true })
  comment?: string;

  @OneToMany((type) => Task, (task) => task.contract)
  tasks: Task[];

  @OneToMany((type) => BusinessRequest, (businessRequest) => businessRequest.contract)
  requests: BusinessRequest[];

  @CreateDateColumn()
  creationDate?: Date;
}
