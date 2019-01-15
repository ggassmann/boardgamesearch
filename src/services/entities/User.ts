import { genSalt, hash } from 'src/lib/hash';
import {
  AfterLoad, BeforeUpdate, Column, CreateDateColumn,
  Entity, Index, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSession } from './UserSession';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 80,
  })
  public email: string;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 50,
  })
  public oauthName: string;

  @Column({
    type: 'varchar',
    length: 80,
  })
  public displayName: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  public avatar: string;

  @OneToMany((type) => UserSession, (userSession) => userSession.user)
  public sessions: Promise<UserSession[]>;

  @Column({
    type: 'varchar',
    length: 25,
  })
  public password: string;

  @CreateDateColumn()
  public createdDate: Date;

  @UpdateDateColumn()
  public updatedDate: Date;

  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeUpdate()
  private async encryptPassword(): Promise<void> {
    if (this.tempPassword !== this.password) {
      const salt = await genSalt(12);
      this.password = await hash(this.password, salt);
    }
  }
}
