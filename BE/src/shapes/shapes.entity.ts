import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Generated,
  OneToMany,
  Unique,
} from "typeorm";
import { User } from "src/auth/users.entity";
import { Diary } from "src/diaries/diaries.entity";

@Entity()
@Unique(["uuid"])
export class Shape extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid" })
  @Generated("uuid")
  uuid: string;

  @ManyToOne(() => User, (user) => user.userId, {
    nullable: false,
    eager: true,
  })
  user: User;

  @Column()
  shapePath: string;

  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[];
}
