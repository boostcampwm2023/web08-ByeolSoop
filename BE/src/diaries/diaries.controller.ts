import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { DiariesService } from "./diaries.service";
import {
  CreateDiaryDto,
  DeleteDiaryDto,
  DiaryUuidDto,
  UpdateDiaryDto,
} from "./dto/diaries.dto";
import { Diary } from "./diaries.entity";
import { AuthGuard } from "@nestjs/passport";
import { IdGuard } from "src/auth/guard/auth.id-guard";
import { ReadDiaryDto } from "./dto/diaries.read.dto";

@Controller("diaries")
@UseGuards(AuthGuard())
export class DiariesController {
  constructor(private diariesService: DiariesService) {}

  @Post()
  @HttpCode(201)
  async writeDiary(
    @Body() createDiaryDto: CreateDiaryDto,
  ): Promise<DiaryUuidDto> {
    const diary: Diary = await this.diariesService.writeDiary(createDiaryDto);
    return { uuid: diary.uuid };
  }

  @Get("/:uuid")
  @UseGuards(IdGuard)
  async readDiary(@Param("uuid") uuid: string): Promise<Object> {
    const readDiaryDto: ReadDiaryDto = { uuid };
    const diary = await this.diariesService.readDiary(readDiaryDto);
    const coordinateArray = diary.point.split(",");

    const response = {
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
        x: parseFloat(coordinateArray[0]),
        y: parseFloat(coordinateArray[1]),
        z: parseFloat(coordinateArray[2]),
      },
      shape_uuid: diary.shape.uuid,
    };

    return response;
  }

  @Put()
  @UseGuards(IdGuard)
  modifyDiary(@Body() updateDiaryDto: UpdateDiaryDto): Promise<Diary> {
    return this.diariesService.modifyDiary(updateDiaryDto);
  }

  @Delete("/:uuid")
  @UseGuards(IdGuard)
  deleteBoard(@Param("uuid") uuid: string): Promise<void> {
    const deleteDiaryDto: DeleteDiaryDto = { uuid };
    return this.diariesService.deleteDiary(deleteDiaryDto);
  }
}
