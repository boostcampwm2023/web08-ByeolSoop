import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IntroduceController } from "./introduce.controller";
import { IntroduceService } from "./introduce.service";

@Module({
  imports: [TypeOrmModule.forFeature()],
  controllers: [IntroduceController],
  providers: [IntroduceService],
})
export class IntroduceModule {}
