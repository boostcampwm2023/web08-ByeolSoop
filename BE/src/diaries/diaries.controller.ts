import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { DiariesService } from "./diaries.service";
import {
  CreateDiaryDto,
  DeleteDiaryDto,
  ReadDiaryDto,
  UpdateDiaryDto,
} from "./diaries.dto";
import { Diary } from "./diaries.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller("diaries")
@UseGuards(AuthGuard())
export class DiariesController {
  constructor(private diariesService: DiariesService) {}

  @Post()
  async writeDiary(@Body() createDiaryDto: CreateDiaryDto): Promise<Diary> {
    return this.diariesService.writeDiary(createDiaryDto);
  }

  @Get("/:uuid")
  async readDiary(@Param("uuid") uuid: string): Promise<String> {
    const readDiaryDto: ReadDiaryDto = { uuid };
    const diary = await this.diariesService.readDiary(readDiaryDto);

    const response = JSON.stringify({
      userId: diary.user.userId,
      title: diary.title,
      content: diary.content,
      date: diary.date,
      tags: [],
      emotion: {
        positive: diary.positiveRatio,
        neutral: diary.neutralRatio,
        negative: diary.negativeRatio,
        sentiment: diary.sentiment,
      },
      coordinate: {
        x: diary.point.split(",")[0],
        y: diary.point.split(",")[1],
        z: diary.point.split(",")[2],
      },
      shape_uuid: diary.shape.uuid,
    });

    return response;
  }

  @Put()
  modifyDiary(@Body() updateDiaryDto: UpdateDiaryDto): Promise<Diary> {
    return this.diariesService.modifyDiary(updateDiaryDto);
  }

  @Delete("/:uuid")
  deleteBoard(@Param("uuid") uuid: string): Promise<void> {
    const deleteDiaryDto: DeleteDiaryDto = { uuid };
    return this.diariesService.deleteDiary(deleteDiaryDto);
  }
}
