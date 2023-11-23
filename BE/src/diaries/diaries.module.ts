import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiariesController } from "./diaries.controller";
import { DiariesService } from "./diaries.service";
import { DiariesRepository } from "./diaries.repository";
import { Diary } from "./diaries.entity";
import { AuthModule } from "src/auth/auth.module";
import { TagsModule } from "src/tags/tags.module";
import { ShapesModule } from "src/shapes/shapes.module";
import { ShapesRepository } from "src/shapes/shapes.repository";
import { TagsRepository } from "src/tags/tags.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary]),
    AuthModule,
    TagsModule,
    ShapesModule,
  ],
  controllers: [DiariesController],
  providers: [
    DiariesService,
    DiariesRepository,
    TagsRepository,
    ShapesRepository,
  ],
})
export class DiariesModule {}
