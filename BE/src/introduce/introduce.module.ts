import { Module } from "@nestjs/common";
import { IntroduceController } from "./introduce.controller";
import { IntroduceService } from "./introduce.service";

@Module({
  imports: [],
  controllers: [IntroduceController],
  providers: [IntroduceService],
})
export class IntroduceModule {}
