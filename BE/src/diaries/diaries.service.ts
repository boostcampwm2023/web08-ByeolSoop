import { Injectable } from "@nestjs/common";
import { DiariesRepository } from "./diaries.repository";
import { Diary } from "./diaries.entity";
import {
  CreateDiaryDto,
  DeleteDiaryDto,
  ReadDiaryDto,
  UpdateDiaryDto,
} from "./diaries.dto";
import { TagsRepository } from "src/tags/tags.repository";
import { Tag } from "src/tags/tags.entity";

@Injectable()
export class DiariesService {
  constructor(
    private diariesRepository: DiariesRepository,
    private tagsRepository: TagsRepository,
  ) {}

  async writeDiary(createDiaryDto: CreateDiaryDto): Promise<Diary> {
    const encodedContent = btoa(createDiaryDto.content);
    const tags = [];

    await Promise.all(
      createDiaryDto.tags.map(async (tag) => {
        if ((await Tag.findOne({ where: { name: tag } })) !== null) {
          const tagEntity = await Tag.findOneBy({ name: tag });
          tags.push(tagEntity);
        } else {
          tags.push(await this.tagsRepository.createTag(tag));
        }
      }),
    );

    const diary = await this.diariesRepository.createDiary(
      createDiaryDto,
      encodedContent,
      tags,
    );

    return diary;
  }

  async readDiary(readDiaryDto: ReadDiaryDto): Promise<Diary> {
    let diary = await this.diariesRepository.readDiary(readDiaryDto);
    diary.content = atob(diary.content);
    // Mysql DB에서 가져온 UST 날짜 데이터를 KST로 변경
    diary.date.setHours(diary.date.getHours() + 9);
    return diary;
  }

  async readDiariesByUser(user): Promise<Diary[]> {
    let diaryList: Diary[] =
      await this.diariesRepository.readDiariesByUser(user);

    diaryList.map((diary) => {
      diary.content = atob(diary.content);
      // Mysql DB에서 가져온 UST 날짜 데이터를 KST로 변경
      diary.date.setHours(diary.date.getHours() + 9);
    });

    return diaryList;
  }

  async modifyDiary(updateDiaryDto: UpdateDiaryDto): Promise<Diary> {
    const encodedContent = btoa(updateDiaryDto.content);
    return this.diariesRepository.updateDiary(updateDiaryDto, encodedContent);
  }

  async deleteDiary(deleteDiaryDto: DeleteDiaryDto): Promise<void> {
    return this.diariesRepository.deleteDiary(deleteDiaryDto);
  }
}
