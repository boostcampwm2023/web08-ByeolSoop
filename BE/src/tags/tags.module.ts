import { Module } from "@nestjs/common";
import { TagsRepository } from "./tags.repository";
import { Tag } from "./tags.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [],
  providers: [TagsRepository],
  exports: [TagsRepository],
})
export class TagsModule {}
