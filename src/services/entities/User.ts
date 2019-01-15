import { genSalt, hash } from 'src/lib/hash';
import { AfterLoad, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 15,
  })
  public email: string;

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
