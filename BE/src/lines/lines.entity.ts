import { User } from "src/auth/users.entity";
import { Diary } from "src/diaries/diaries.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "constellation" })
export class Line extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Diary, (diary) => diary.id, {
    nullable: false,
    eager: true,
  })
  firstDiary: Diary;

  @ManyToOne(() => Diary, (diary) => diary.id, {
    nullable: false,
    eager: true,
  })
  secondDiary: Diary;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    eager: true,
  })
  user: User;

  @CreateDateColumn({ type: "datetime" })
  createdDate: Date;

  @DeleteDateColumn({ type: "datetime" })
  deletedDate: Date;
}
