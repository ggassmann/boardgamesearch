import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

export enum ScrapeStatus {
  new,
  processing,
  finished,
  doesNotExist,
  errorOccured,
}

@Entity()
export class ScrapeProgress {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 75,
  })
  public name: string;

  @Column('int')
  public index: number;

  @Column('int')
  public status: ScrapeStatus;
}
