import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Generated,
  OneToMany,
} from "typeorm";
import { User } from "src/users/users.entity";
import { Diary } from "src/diaries/diaries.entity";

@Entity()
export class Shape extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid" })
  @Generated("uuid")
  uuid: string;

  @ManyToOne(() => User, (user) => user.userId, { nullable: false })
  user: User;

  @Column()
  shapePath: string;

  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[];
}
