import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiariesController } from "./diaries.controller";
import { DiariesService } from "./diaries.service";
import { DiariesRepository } from "./diaries.repository";
import { Diary } from "./diaries.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Diary])],
  controllers: [DiariesController],
  providers: [DiariesService, DiariesRepository],
})
export class DiariesModule {}
