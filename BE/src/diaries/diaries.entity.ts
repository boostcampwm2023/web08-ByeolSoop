import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  ManyToOne,
  Generated,
} from "typeorm";
import { User } from "src/users/users.entity";
import { Shape } from "src/shapes/shapes.entity";

@Entity()
export class Diary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid" })
  @Generated("uuid")
  uuid: string;

  @ManyToOne(() => User, (user) => user.userId, { nullable: false })
  user: User;

  @ManyToOne(() => Shape, (shape) => shape.id, { nullable: false })
  shape: Shape;

  @Column()
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ length: 7 })
  color: string;

  @Column()
  date: Date;

  @Column()
  point: string;

  @CreateDateColumn({ type: "datetime" })
  createdDate: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedDate: Date;

  @DeleteDateColumn({ type: "datetime" })
  deletedDate: Date;
}
