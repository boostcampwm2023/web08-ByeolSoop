import { Injectable } from "@nestjs/common";
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
import { User } from "src/auth/users.entity";
import { createCipheriv, createDecipheriv } from "crypto";
import { ShapesRepository } from "src/shapes/shapes.repository";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

@Injectable()
export class DiariesService {
  constructor(
    private diariesRepository: DiariesRepository,
    private tagsRepository: TagsRepository,
    private shapesRepository: ShapesRepository,
    private httpService: HttpService,
  ) {}

  async writeDiary(createDiaryDto: CreateDiaryDto, user: User): Promise<Diary> {
    const { content, shapeUuid, tags } = createDiaryDto;
    const shape = await this.shapesRepository.getShapeByUuid(shapeUuid);
    const encryptedContent = this.getEncryptedContent(content);
    const tagEntities = await this.getTags(tags);
    const sentimentResult = await this.getSentiment(content);

    const diary = await this.diariesRepository.createDiary(
      createDiaryDto,
      encryptedContent,
      tagEntities,
      user,
      shape,
      sentimentResult,
    );

    return diary;
  }

  async readDiary(readDiaryDto: ReadDiaryDto): Promise<Diary> {
    let diary = await this.diariesRepository.readDiary(readDiaryDto);

    diary.content = this.getDecryptedContent(diary.content);

    // Mysql DB에서 가져온 UST 날짜 데이터를 KST로 변경
    diary.date.setHours(diary.date.getHours() + 9);
    return diary;
  }

  async readDiariesByUser(user: User): Promise<Diary[]> {
    let diaryList: Diary[] =
      await this.diariesRepository.readDiariesByUser(user);

    await Promise.all(
      diaryList.map((diary) => {
        let decipher = createDecipheriv(
          "aes-256-cbc",
          process.env.CONTENT_SECRET_KEY,
          process.env.CONTENT_IV,
        );
        let decryptedContent = decipher.update(diary.content, "hex", "utf8");
        decryptedContent += decipher.final("utf8");
        diary.content = decryptedContent;

        // Mysql DB에서 가져온 UST 날짜 데이터를 KST로 변경
        diary.date.setHours(diary.date.getHours() + 9);
      }),
    );

    return diaryList;
  }

  async modifyDiary(
    updateDiaryDto: UpdateDiaryDto,
    user: User,
  ): Promise<Diary> {
    const { content, shapeUuid, tags } = updateDiaryDto;
    const shape = await this.shapesRepository.getShapeByUuid(shapeUuid);
    const encryptedContent = this.getEncryptedContent(content);
    const tagEntities = await this.getTags(tags);
    const sentimentResult = await this.getSentiment(content);

    return this.diariesRepository.updateDiary(
      updateDiaryDto,
      encryptedContent,
      tagEntities,
      user,
      shape,
      sentimentResult,
    );
  }

  async deleteDiary(deleteDiaryDto: DeleteDiaryDto): Promise<void> {
    await this.diariesRepository.deleteDiary(deleteDiaryDto);
    return;
  }

  getEncryptedContent(content: string): string {
    const cipher = createCipheriv(
      "aes-256-cbc",
      process.env.CONTENT_SECRET_KEY,
      process.env.CONTENT_IV,
    );

    let encryptedContent = cipher.update(content, "utf8", "hex");
    encryptedContent += cipher.final("hex");
    return encryptedContent;
  }

  getDecryptedContent(content: string): string {
    const decipher = createDecipheriv(
      "aes-256-cbc",
      process.env.CONTENT_SECRET_KEY,
      process.env.CONTENT_IV,
    );
    let decryptedContent = decipher.update(content, "hex", "utf8");
    decryptedContent += decipher.final("utf8");
    return decryptedContent;
  }

  async getTags(tagNames: string[]): Promise<Tag[]> {
    return await Promise.all(
      tagNames.map(async (tagName) => {
        try {
          const tag = await this.tagsRepository.getTagByName(tagName);
          return tag;
        } catch {
          return await this.tagsRepository.createTag(tagName);
        }
      }),
    );
  }

  async getSentimentByContent(content: string): Promise<{
    positiveRatio: number;
    negativeRatio: number;
    neutralRatio: number;
    sentiment: string;
  }> {
    const headersData = {
      "X-NCP-APIGW-API-KEY-ID": process.env.NCP_API_KEY,
      "X-NCP-APIGW-API-KEY": process.env.NCP_API_SECRET,
      "Content-Type": "application/json",
    };

    const BodyData = {
      content: content,
    };
    try {
      const sentimentResponse = lastValueFrom(
        await this.httpService.post(
          "https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze",
          BodyData,
          { headers: headersData },
        ),
      );
      const result = {
        positiveRatio: (await sentimentResponse).data.document.confidence
          .positive,
        neutralRatio: (await sentimentResponse).data.document.confidence
          .neutral,
        negativeRatio: (await sentimentResponse).data.document.confidence
          .negative,
        sentiment: (await sentimentResponse).data.document.sentiment,
      };
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getSentiment(content: string): Promise<{
    positiveRatio: number;
    negativeRatio: number;
    neutralRatio: number;
    sentiment: string;
  }> {
    let currentContent;
    let sentimentResult;
    let result = {
      positiveRatio: 0,
      negativeRatio: 0,
      neutralRatio: 0,
      sentiment: "neutral",
    };

    if (content.length === 0) {
      result.neutralRatio = 100;
      return result;
    }

    if (content.length <= 1000) {
      return await this.getSentimentByContent(content);
    }

    for (let i; i < content.length / 1000; i++) {
      currentContent = content.slice(i * 1000, (i + 1) * 1000);
      sentimentResult = await this.getSentimentByContent(currentContent);

      result.positiveRatio +=
        (await sentimentResult).positiveRatio * (currentContent.length / 1000);
      result.negativeRatio +=
        (await sentimentResult).negativeRatio * (currentContent.length / 1000);
      result.neutralRatio +=
        (await sentimentResult).neutralRatio * (currentContent.length / 1000);
    }

    result.positiveRatio = result.positiveRatio / (content.length / 1000);
    result.negativeRatio = result.negativeRatio / (content.length / 1000);
    result.neutralRatio = result.neutralRatio / (content.length / 1000);
    result.sentiment =
      result.positiveRatio >= result.negativeRatio
        ? result.positiveRatio > result.neutralRatio
          ? "positive"
          : "neutral"
        : result.negativeRatio > result.neutralRatio
        ? "negative"
        : "neutral";

    return result;
  }
}
