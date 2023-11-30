import { Module } from "@nestjs/common";
import { StatController } from "./stat.controller";
import { StatService } from "./stat.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Diary } from "src/diaries/diaries.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Diary])],
  controllers: [StatController],
  providers: [StatService],
})
export class StatModule {}
