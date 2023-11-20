import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiariesController } from "./diaries.controller";
import { DiariesService } from "./diaries.service";
import { DiariesRepository } from "./diaries.repository";
import { Diary } from "./diaries.entity";
import { AuthModule } from "src/auth/auth.module";
import { TagsModule } from "src/tags/tags.module";

@Module({
  imports: [TypeOrmModule.forFeature([Diary]), AuthModule, TagsModule],
  controllers: [DiariesController],
  providers: [DiariesService, DiariesRepository],
})
export class DiariesModule {}
