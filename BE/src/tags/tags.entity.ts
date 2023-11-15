import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
  Column,
} from "typeorm";
import { Diary } from "src/diaries/diaries.entity";

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Diary)
  @JoinTable()
  diaries: Diary[];
}
