import { Module } from "@nestjs/common";
import { TagsController } from "./tags.controller";
import { TagsService } from "./tags.service";
import { TagsRepository } from "./tags.repository";
import { Tag } from "./tags.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository],
  exports: [TagsRepository],
})
export class TagsModule {}
