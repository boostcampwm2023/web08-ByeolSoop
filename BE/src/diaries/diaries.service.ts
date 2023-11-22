import { Injectable, NotFoundException } from "@nestjs/common";
import { DiariesRepository } from "./diaries.repository";
import { Diary } from "./diaries.entity";
import {
  CreateDiaryDto,
  DeleteDiaryDto,
  UpdateDiaryDto,
} from "./dto/diaries.dto";
import { TagsRepository } from "src/tags/tags.repository";
import { Tag } from "src/tags/tags.entity";
import { ReadDiaryDto } from "./dto/diaries.read.dto";
import { createCipheriv, createDecipheriv } from "crypto";

@Injectable()
export class DiariesService {
  constructor(
    private diariesRepository: DiariesRepository,
    private tagsRepository: TagsRepository,
  ) {}

  async writeDiary(createDiaryDto: CreateDiaryDto): Promise<Diary> {
    const tags = [];

    const cipher = createCipheriv(
      "aes-256-cbc",
      process.env.CONTENT_SECRET_KEY,
      process.env.CONTENT_IV,
    );
    let encryptedContent = cipher.update(createDiaryDto.content, "utf8", "hex");
    encryptedContent += cipher.final("hex");

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
      encryptedContent,
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
    const cipher = createCipheriv(
      "aes-256-cbc",
      process.env.CONTENT_SECRET_KEY,
      process.env.CONTENT_IV,
    );
    let encryptedContent = cipher.update(updateDiaryDto.content, "utf8", "hex");
    encryptedContent += cipher.final("hex");

    return this.diariesRepository.updateDiary(updateDiaryDto, encryptedContent);
  }

  async deleteDiary(deleteDiaryDto: DeleteDiaryDto): Promise<void> {
    await this.diariesRepository.deleteDiary(deleteDiaryDto);
    return;
  }
}
