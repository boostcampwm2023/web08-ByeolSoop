import {
  Controller,
  Get,
  InternalServerErrorException,
  StreamableFile,
} from "@nestjs/common";
import { IntroduceService } from "./introduce.service";

@Controller("introduce")
export class IntroduceController {
  constructor(private introduceService: IntroduceService) {}

  @Get()
  async getIntroduceVideo(): Promise<StreamableFile> {
    const stream = await this.introduceService.getIntroduceVideo();
    try {
      return new StreamableFile(stream);
    } catch (error) {
      throw new InternalServerErrorException(
        "파일을 읽어오는 도중 서버에서 문제가 발생했습니다.",
      );
    }
  }
}
