import {
  Column, CreateDateColumn,
  Entity, PrimaryColumn, UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Thing {
  @PrimaryColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  public amazonLink: string;

  @Column({
    type: 'float',
  })
  public amazonPrice: number;

  @CreateDateColumn()
  public createdDate: Date;

  @UpdateDateColumn()
  public updatedDate: Date;
}
