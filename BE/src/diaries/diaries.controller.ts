import { Body, Controller, Post } from "@nestjs/common";
import { DiariesService } from "./diaries.service";
import { CreateDiaryDto } from "./diaries.dto";
import { Diary } from "./diaries.entity";

@Controller("diaries")
export class DiariesController {
  constructor(private diariesService: DiariesService) {}

  @Post()
  async writeDiary(@Body() createDiaryDto: CreateDiaryDto): Promise<void>{
    await this.diariesService.writeDiary(createDiaryDto);
    return;
  }
}
