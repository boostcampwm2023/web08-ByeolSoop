import { Injectable } from "@nestjs/common";
import { Diary } from "src/diaries/diaries.entity";
import {
  DiariesDateDto,
  DiariesInfoDto,
  StatTagDto,
  TagInfoDto,
} from "./dto/stat.tags.dto";

@Injectable()
export class StatService {
  async getTopThreeTagsByUser(
    year: number,
    userId: number,
  ): Promise<StatTagDto> {
    const result: TagInfoDto[] = await this.fetchTopThreeTagsByUser(
      year,
      userId,
    );
    return this.getFormatResult(result);
  }

  async getDiariesDateByUser(
    year: number,
    userId: number,
  ): Promise<DiariesDateDto> {
    const diariesData = await this.fetchDiariesDateByUser(year, userId);
    const formattedResult = {};

    await diariesData.forEach((diary) => {
      const { date, sentiment } = diary;
      const formattedDate = this.getFormattedDate(date);
      if (!formattedResult[formattedDate]) {
        formattedResult[formattedDate] = {
          sentiment: sentiment,
          count: 1,
        };
      } else {
        formattedResult[formattedDate].count += 1;
      }
    });

    return formattedResult;
  }

  private async fetchTopThreeTagsByUser(
    year: number,
    userId: number,
  ): Promise<TagInfoDto[]> {
    return await Diary.createQueryBuilder("diary")
      .select("tags.name", "tag")
      .addSelect("tags.id", "id")
      .addSelect("COUNT(*)", "count")
      .innerJoin("diary.tags", "tags")
      .where("diary.user = :userId", { userId })
      .andWhere("YEAR(diary.date) = :year", { year })
      .groupBy("tags.name")
      .addGroupBy("tags.id")
      .orderBy("count", "DESC")
      .take(3)
      .getRawMany();
  }

  private async fetchDiariesDateByUser(
    year: number,
    userId: number,
  ): Promise<DiariesInfoDto[]> {
    return await Diary.createQueryBuilder("diary")
      .select(["diary.date", "diary.updatedDate", "diary.sentiment"])
      .where("diary.user = :userId", { userId })
      .andWhere("YEAR(diary.date) = :year", { year })
      .orderBy({
        "diary.date": "ASC",
        "diary.updatedDate": "DESC",
      })
      .getMany();
  }

  private getFormatResult(result: TagInfoDto[]): StatTagDto {
    const keys = ["first", "second", "third"];
    const formattedResult = {};
    result.forEach((item, index) => {
      const rank = index + 1;
      formattedResult[keys[index]] = { rank, ...item };
    });

    return formattedResult;
  }

  private getFormattedDate(date: Date): string {
    date.setHours(date.getHours() + 9);
    let formattedDate;
    formattedDate = date.getFullYear().toString() + "-";
    formattedDate +=
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1).toString()
        : (date.getMonth() + 1).toString();
    formattedDate += "-";
    formattedDate +=
      date.getDate() < 10
        ? "0" + date.getDate().toString()
        : date.getDate().toString();

    return formattedDate;
  }
}
