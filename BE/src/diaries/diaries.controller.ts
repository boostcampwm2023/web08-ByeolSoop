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
  ReadDiaryDto,
  ReadDiariesResponseDto,
  UpdateDiaryDto,
} from "./diaries.dto";
import { Diary } from "./diaries.entity";
import { AuthGuard } from "@nestjs/passport";
import { IdGuard } from "src/auth/guard/auth.id-guard";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/users/users.entity";

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
      shapeUuid: diary.shape.uuid,
    };

    return response;
  }

  @Get()
  async readDiariesByUser(
    @GetUser() user: User,
  ): Promise<ReadDiariesResponseDto[]> {
    const diaryList = await this.diariesService.readDiariesByUser(user);
    let readDiaryResponseDtoList: ReadDiariesResponseDto[] = [];
    diaryList.map((diary) => {
      const coordinateArray = diary.point.split(",");
      const response = {
        userId: diary.user.userId,
        uuid: diary.uuid,
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
        shapeUuid: diary.shape.uuid,
      };

      const readDiaryResponseDto: ReadDiariesResponseDto = response;
      readDiaryResponseDtoList.push(readDiaryResponseDto);
    });

    return readDiaryResponseDtoList;
  }

  @Put()
  @UseGuards(IdGuard)
  modifyDiary(@Body() updateDiaryDto: UpdateDiaryDto): Promise<Diary> {
    return this.diariesService.modifyDiary(updateDiaryDto);
  }

  @Delete("/:uuid")
  @UseGuards(IdGuard)
  @HttpCode(204)
  async deleteDiary(@Param("uuid") uuid: string): Promise<void> {
    const deleteDiaryDto: DeleteDiaryDto = { uuid };
    await this.diariesService.deleteDiary(deleteDiaryDto);
    return;
  }
}
