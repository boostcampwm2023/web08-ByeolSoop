import { Controller, Get } from "@nestjs/common";
import { IntroduceService } from "./introduce.service";

@Controller("introduce")
export class IntroduceController {
  constructor(private introduceService: IntroduceService) {}

  @Get()
  async getIntroduceVideo(): Promise<object> {
    return this.introduceService.getIntroduceVideo();
  }
}
