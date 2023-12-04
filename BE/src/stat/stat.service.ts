import { Injectable } from "@nestjs/common";
import { Diary } from "src/diaries/diaries.entity";
import {
  DiariesDateDto,
  DiariesInfoDto,
  StatTagDto,
  TagInfoDto,
} from "./dto/stat.tags.dto";
import { ShapeInfoDto, StatShapeDto } from "./dto/stat.shapes.dto";

@Injectable()
export class StatService {
  async getTopThreeTagsByUser(
    year: number,
    userId: number,
  ): Promise<StatTagDto> {
    const result: TagInfoDto[] = await this.fetchTopThreeByUser<TagInfoDto>(
      year,
      userId,
      "tags",
      ["tags.name", "tags.id"],
      ["tags.name as tag", "tags.id as id"],
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

  async getTopThreeShapesByUser(
    year: number,
    userId: number,
  ): Promise<StatShapeDto> {
    const result: ShapeInfoDto[] = await this.fetchTopThreeByUser<ShapeInfoDto>(
      year,
      userId,
      "shape",
      ["shape.uuid"],
      ["shape.uuid as uuid"],
    );
    return this.getFormatResult(result);
  }

  private async fetchTopThreeByUser<T extends TagInfoDto | ShapeInfoDto>(
    year: number,
    userId: number,
    joinTable: string,
    groupByFields: any,
    selectFields: any,
  ): Promise<T[]> {
    return Diary.createQueryBuilder("diary")
      .select(selectFields)
      .addSelect("COUNT(*)", "count")
      .innerJoin(`diary.${joinTable}`, joinTable)
      .where("diary.user = :userId", { userId })
      .andWhere("YEAR(diary.date) = :year", { year })
      .groupBy(groupByFields)
      .orderBy("count", "DESC")
      .limit(3)
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

  private getFormatResult(
    result: TagInfoDto[] | ShapeInfoDto[],
  ): StatTagDto | StatShapeDto {
    const keys = ["first", "second", "third"];
    const formattedResult = {};
    result.forEach((item: TagInfoDto | ShapeInfoDto, index: number) => {
      const rank = index + 1;
      item.count = Number(item.count);
      formattedResult[keys[index]] = { rank, ...item };
    });

    return formattedResult;
  }

  private getFormattedDate(date: Date): string {
    date.setHours(date.getHours() + 9);

    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }
}
