import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from "typeorm";
import { premiumStatus } from "src/utils/enum";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  userID: string;

  @Column({ length: 20 })
  password: string;

  @Column({ length: 20 })
  nickname: string;

  @Column()
  credit: number;

  @Column({ type: "enum", enum: premiumStatus, default: premiumStatus.TRUE })
  premium: premiumStatus;

  @CreateDateColumn({ type: "datetime" })
  createdDate: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedDate: Date;

  @DeleteDateColumn({ type: "datetime" })
  deletedDate: Date;
}
