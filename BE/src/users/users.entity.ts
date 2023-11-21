import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { premiumStatus } from "src/utils/enum";
import { Diary } from "../diaries/diaries.entity";
import { Shape } from "src/shapes/shapes.entity";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ length: 20 })
  nickname: string;

  @Column({ default: 0 })
  credit: number;

  @Column({ type: "enum", enum: premiumStatus, default: premiumStatus.FALSE })
  premium: premiumStatus;

  @CreateDateColumn({ type: "datetime" })
  createdDate: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedDate: Date;

  @DeleteDateColumn({ type: "datetime" })
  deletedDate: Date;

  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[];

  @OneToMany(() => Shape, (shape) => shape.user)
  shapes: Diary[];
}
