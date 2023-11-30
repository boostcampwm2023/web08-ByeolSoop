import { Module } from "@nestjs/common";
import { LinesController } from "./lines.controller";
import { LinesService } from "./lines.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Line } from "./lines.entity";
import { DiariesModule } from "src/diaries/diaries.module";
import { DiariesRepository } from "src/diaries/diaries.repository";
import { LinesRepository } from "./lines.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Line]), DiariesModule],
  controllers: [LinesController],
  providers: [LinesService, LinesRepository, DiariesRepository],
})
export class LinesModule {}
