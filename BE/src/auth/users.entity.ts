import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  OneToMany,
  Unique,
} from "typeorm";
import { premiumStatus, providerEnum } from "src/utils/enum";
import { Diary } from "../diaries/diaries.entity";
import { Shape } from "src/shapes/shapes.entity";

@Entity()
@Unique(["userId"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  userId: string;

  @Column()
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

  @Column({ type: "enum", enum: providerEnum, default: providerEnum.BYEOLSOOP })
  provider: providerEnum;

  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[];

  @OneToMany(() => Shape, (shape) => shape.user)
  shapes: Diary[];
}
