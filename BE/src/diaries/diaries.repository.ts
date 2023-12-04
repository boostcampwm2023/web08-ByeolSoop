import { User } from "src/auth/users.entity";
import { Line } from "src/lines/lines.entity";
import {
  CreateDiaryDto,
  DeleteDiaryDto,
  UpdateDiaryDto,
} from "./dto/diaries.dto";
import { Diary } from "./diaries.entity";
import { sentimentStatus } from "src/utils/enum";
import { Shape } from "src/shapes/shapes.entity";
import { NotFoundException } from "@nestjs/common";
import { Tag } from "src/tags/tags.entity";
import { ReadDiaryDto } from "./dto/diaries.read.dto";
import { SentimentDto } from "./dto/diaries.sentiment.dto";

export class DiariesRepository {
  async createDiary(
    createDiaryDto: CreateDiaryDto,
    encodedContent: string,
    tags: Tag[],
    user: User,
    shape: Shape,
    sentimentResult: SentimentDto,
  ): Promise<Diary> {
    const { title, point, date } = createDiaryDto;
    const content = encodedContent;

    // 미구현 기능을 대체하기 위한 임시 값
    const positiveRatio = sentimentResult.positiveRatio;
    const negativeRatio = sentimentResult.negativeRatio;
    const neutralRatio = sentimentResult.neutralRatio;
    const sentiment = sentimentResult.sentiment;

    const newDiary = Diary.create({
      title,
      content,
      point,
      date,
      positiveRatio,
      negativeRatio,
      neutralRatio,
      sentiment,
      shape: { id: shape.id },
      user: { id: user.id },
      tags: tags,
    });
    await newDiary.save();

    return newDiary;
  }

  async readDiary(readDiaryDto: ReadDiaryDto): Promise<Diary> {
    const uuid = readDiaryDto.uuid;
    return this.getDiaryByUuid(uuid);
  }

  async readDiariesByUser(user: User): Promise<Diary[]> {
    const diaryList = await Diary.find({
      where: { user: { userId: user.userId } },
    });
    return diaryList;
  }

  async updateDiary(
    updateDiaryDto: UpdateDiaryDto,
    encryptedContent: string,
    tags: Tag[],
    user: User,
    shape: Shape,
    sentimentResult: SentimentDto,
  ): Promise<Diary> {
    const { uuid, title, point, date } = updateDiaryDto;
    const content = encryptedContent;

    const diary = await this.getDiaryByUuid(uuid);

    const positiveRatio = sentimentResult.positiveRatio;
    const negativeRatio = sentimentResult.negativeRatio;
    const neutralRatio = sentimentResult.neutralRatio;
    const sentiment = sentimentStatus[sentimentResult.sentiment.toUpperCase()];

    Object.assign(diary, {
      title,
      content,
      point,
      date,
      positiveRatio,
      negativeRatio,
      neutralRatio,
      sentiment,
      shape,
      user,
      tags,
    });

    await diary.save();
    return diary;
  }

  async deleteDiary(deleteDiaryDto: DeleteDiaryDto): Promise<void> {
    const { uuid } = deleteDiaryDto;
    const diary: Diary = await this.getDiaryByUuid(uuid);

    const lines = await Line.find({
      where: [
        { firstDiary: { id: diary.id } },
        { secondDiary: { id: diary.id } },
      ],
    });
    await Line.softRemove(lines);

    await Diary.softRemove(diary);
  }

  async getDiaryByUuid(uuid: string): Promise<Diary> {
    const found = await Diary.findOne({ where: { uuid } });
    if (!found) {
      throw new NotFoundException("존재하지 않는 일기입니다.");
    }

    return found;
  }
}
