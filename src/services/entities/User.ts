import { genSalt, hash } from 'src/lib/hash';
import { AfterLoad, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 15,
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
    length: 15,
  })
  public password: string;

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
