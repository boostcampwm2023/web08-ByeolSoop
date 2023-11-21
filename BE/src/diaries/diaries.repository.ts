import { User } from "src/users/users.entity";
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

export class DiariesRepository {
  async createDiary(
    createDiaryDto: CreateDiaryDto,
    encodedContent: string,
    tags: Tag[],
  ): Promise<Diary> {
    const { title, point, date } = createDiaryDto;
    const content = encodedContent;

    // 미구현 기능을 대체하기 위한 임시 값
    const positiveRatio = 0.0;
    const negativeRatio = 100.0;
    const neutralRatio = 0.0;
    const sentiment = sentimentStatus.NEUTRAL;
    const shape = await Shape.findOne({ where: { id: 1 } });
    const user = await User.findOne({ where: { id: 1 } });

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
    const diary = Diary.findOne({
      where: { uuid: uuid },
      relations: ["user", "shape"],
    });
    return diary;
  }

  async updateDiary(
    updateDiaryDto: UpdateDiaryDto,
    encodedContent: string,
  ): Promise<Diary> {
    const { uuid, title, date, shapeUuid } = updateDiaryDto;
    const diary = await this.getDiaryByUuid(uuid);

    diary.title = title;
    diary.date = date;
    diary.content = encodedContent;
    diary.shape = await Shape.findOne({ where: { uuid: shapeUuid } });

    await diary.save();
    return diary;
  }

  async deleteDiary(deleteDiaryDto: DeleteDiaryDto): Promise<void> {
    const { uuid } = deleteDiaryDto;
    const diary = await this.getDiaryByUuid(uuid);

    await Diary.softRemove(diary);
  }

  async getDiaryByUuid(uuid: string): Promise<Diary> {
    const found = await Diary.findOneBy({ uuid });
    if (!found) {
      throw new NotFoundException(`Can't find Diary with uuid: [${uuid}]`);
    }
    return found;
  }
}
