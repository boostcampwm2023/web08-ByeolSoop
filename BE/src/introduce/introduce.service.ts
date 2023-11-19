import { Injectable } from "@nestjs/common";
import { getFileFromS3 } from "src/utils/e3";

@Injectable()
export class IntroduceService {
  async getIntroduceVideo(): Promise<object> {
    return getFileFromS3("test.mp4");
  }
}
