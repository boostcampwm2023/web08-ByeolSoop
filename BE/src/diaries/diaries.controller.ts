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
import { ReadDiaryDto, ReadDiaryResponseDto } from "./dto/diaries.read.dto";
import { PrivateDiaryGuard } from "src/auth/guard/auth.diary-guard";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/users.entity";
import { JwtAuthGuard } from "src/auth/guard/auth.jwt-guard";
import { getReadResponseDtoFormat } from "src/utils/data-transform";

@Controller("diaries")
@UseGuards(JwtAuthGuard)
export class DiariesController {
  constructor(private diariesService: DiariesService) {}

  @Post()
  @HttpCode(201)
  async writeDiary(
    @Body() createDiaryDto: CreateDiaryDto,
    @GetUser() user: User,
  ): Promise<DiaryUuidDto> {
    const diary: Diary = await this.diariesService.writeDiary(
      createDiaryDto,
      user,
    );
    return { uuid: diary.uuid };
  }

  @Get("/:uuid")
  @UseGuards(PrivateDiaryGuard)
  async readDiary(@Param("uuid") uuid: string): Promise<ReadDiaryResponseDto> {
    const readDiaryDto: ReadDiaryDto = { uuid };
    const diary = await this.diariesService.readDiary(readDiaryDto);

    return getReadResponseDtoFormat(diary);
  }

  @Get()
  async readDiariesByUser(
    @GetUser() user: User,
  ): Promise<ReadDiaryResponseDto[]> {
    const diaryList = await this.diariesService.readDiariesByUser(user);
    const readDiaryResponseDtoList = diaryList.map((diary) =>
      getReadResponseDtoFormat(diary),
    );

    return readDiaryResponseDtoList;
  }

  @Put()
  @UseGuards(PrivateDiaryGuard)
  @HttpCode(204)
  async modifyDiary(
    @Body() updateDiaryDto: UpdateDiaryDto,
    @GetUser() user: User,
  ): Promise<void> {
    await this.diariesService.modifyDiary(updateDiaryDto, user);
    return;
  }

  @Delete("/:uuid")
  @UseGuards(PrivateDiaryGuard)
  @HttpCode(204)
  async deleteDiary(@Param("uuid") uuid: string): Promise<void> {
    const deleteDiaryDto: DeleteDiaryDto = { uuid };
    await this.diariesService.deleteDiary(deleteDiaryDto);
    return;
  }
}
