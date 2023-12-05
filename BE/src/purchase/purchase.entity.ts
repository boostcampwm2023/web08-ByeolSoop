import { User } from "src/auth/users.entity";
import { designEnum, domainEnum } from "src/utils/enum";
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  ManyToOne,
} from "typeorm";

@Entity()
export class Purchase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: domainEnum,
  })
  domain: domainEnum;

  @Column({
    type: "enum",
    enum: designEnum,
  })
  design: designEnum;

  @ManyToOne(() => User, (user) => user.userId, {
    nullable: false,
    eager: true,
  })
  user: User;
}
