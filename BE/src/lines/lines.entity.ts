import { Diary } from "src/diaries/diaries.entity";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "constellation" })
export class Line extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Diary, (diary) => diary.id)
  firstDiary: Diary;

  @ManyToOne(() => Diary, (diary) => diary.id)
  secondDiary: Diary;
}
