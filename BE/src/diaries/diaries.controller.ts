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
import { ReadDiaryDto, ReadDiaryResponseDto } from "./dto/diaries.read.dto";
import { PrivateDiaryGuard } from "src/auth/guard/auth.diary-guard";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/users/users.entity";
import { Tag } from "src/tags/tags.entity";

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
  @UseGuards(PrivateDiaryGuard)
  async readDiary(@Param("uuid") uuid: string): Promise<ReadDiaryResponseDto> {
    const readDiaryDto: ReadDiaryDto = { uuid };
    const diary = await this.diariesService.readDiary(readDiaryDto);

    return this.getReadResponseDtoFormat(diary);
  }

  @Get()
  async readDiariesByUser(
    @GetUser() user: User,
  ): Promise<ReadDiaryResponseDto[]> {
    const diaryList = await this.diariesService.readDiariesByUser(user);
    const readDiaryResponseDtoList = diaryList.map((diary) =>
      this.getReadResponseDtoFormat(diary),
    );

    return readDiaryResponseDtoList;
  }

  @Put()
  @UseGuards(PrivateDiaryGuard)
  modifyDiary(@Body() updateDiaryDto: UpdateDiaryDto): Promise<Diary> {
    return this.diariesService.modifyDiary(updateDiaryDto);
  }

  @Delete("/:uuid")
  @UseGuards(PrivateDiaryGuard)
  @HttpCode(204)
  async deleteDiary(@Param("uuid") uuid: string): Promise<void> {
    const deleteDiaryDto: DeleteDiaryDto = { uuid };
    await this.diariesService.deleteDiary(deleteDiaryDto);
    return;
  }

  getTagNames(tags: Tag[]): string[] {
    const tagNames = tags.map((tag) => tag.name);
    return tagNames;
  }

  getCoordinate(point: string): { x: number; y: number; z: number } {
    const [x, y, z] = point.split(",");
    return {
      x: parseFloat(x),
      y: parseFloat(y),
      z: parseFloat(z),
    };
  }

  getReadResponseDtoFormat(diary: Diary): ReadDiaryResponseDto {
    const tagNames = this.getTagNames(diary.tags);
    const coordinate = this.getCoordinate(diary.point);

    return {
      coordinate,
      uuid: diary.uuid,
      userId: diary.user.userId,
      title: diary.title,
      content: diary.content,
      date: diary.date,
      tags: tagNames,
      emotion: {
        positive: diary.positiveRatio,
        neutral: diary.neutralRatio,
        negative: diary.negativeRatio,
        sentiment: diary.sentiment,
      },
      shapeUuid: diary.shape.uuid,
    };
  }
}
