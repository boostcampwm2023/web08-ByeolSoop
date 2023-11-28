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
  ManyToMany,
  JoinTable,
  Unique,
} from "typeorm";
import { User } from "src/auth/users.entity";
import { Shape } from "src/shapes/shapes.entity";
import { sentimentStatus } from "src/utils/enum";
import { Tag } from "src/tags/tags.entity";

@Entity()
@Unique(["uuid"])
export class Diary extends BaseEntity {
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

  @ManyToOne(() => Shape, (shape) => shape.id, { nullable: false, eager: true })
  shape: Shape;

  @ManyToMany(() => Tag, { eager: true, nullable: true })
  @JoinTable()
  tags: Tag[];

  @Column()
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "float" })
  positiveRatio: number;

  @Column({ type: "float" })
  negativeRatio: number;

  @Column({ type: "float" })
  neutralRatio: number;

  @Column({
    type: "enum",
    enum: sentimentStatus,
    default: sentimentStatus.error,
  })
  sentiment: sentimentStatus;

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
