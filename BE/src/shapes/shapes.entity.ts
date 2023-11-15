import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Generated,
} from "typeorm";
import { User } from "src/users/users.entity";

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
}
