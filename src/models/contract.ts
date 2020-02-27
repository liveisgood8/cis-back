import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './client';
import { Task } from './task';

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

  @OneToMany((type) => Task, (task) => task.contract)
  tasks: Task[];

  @CreateDateColumn()
  creationDate?: Date;
}
