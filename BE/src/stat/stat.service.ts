import { Injectable } from "@nestjs/common";
import { Diary } from "src/diaries/diaries.entity";
import { StatTagDto, TagInfoDto } from "./dto/stat.tags.dto";
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
}
