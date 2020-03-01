import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  creationDate?: Date;
}
