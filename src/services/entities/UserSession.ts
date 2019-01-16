import {
  Column, CreateDateColumn, Entity, Index,
  ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class UserSession {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne((type) => User, (user) => user.sessions)
  public user: User;

  @Column({
    type: 'varchar',
    length: 36,
  })
  public sessionKey: string;

  @CreateDateColumn()
  public createdDate: Date;

  @UpdateDateColumn()
  public updatedDate: Date;
}
