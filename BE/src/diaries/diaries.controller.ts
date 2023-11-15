import { Body, Controller, Post, Put } from "@nestjs/common";
import { DiariesService } from "./diaries.service";
import { CreateDiaryDto, UpdateDiaryDto } from "./diaries.dto";
import { Diary } from "./diaries.entity";

@Controller("diaries")
export class DiariesController {
  constructor(private diariesService: DiariesService) {}

  @Post()
  async writeDiary(@Body() createDiaryDto: CreateDiaryDto): Promise<void> {
    await this.diariesService.writeDiary(createDiaryDto);
    return;
  }

  @Put()
  modifyDiary(@Body() updateDiaryDto: UpdateDiaryDto): Promise<Diary> {
    return this.diariesService.modifyDiary(updateDiaryDto);
  }
}
