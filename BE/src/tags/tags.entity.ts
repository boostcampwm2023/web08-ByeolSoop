import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from "typeorm";

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
