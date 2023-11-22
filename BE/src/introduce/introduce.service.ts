import { Injectable, StreamableFile } from "@nestjs/common";
import { getFileFromS3 } from "src/utils/e3";
import { Readable } from "stream";

@Injectable()
export class IntroduceService {
  async getIntroduceVideo(): Promise<Readable> {
    return getFileFromS3("test.mp4");
  }
}
