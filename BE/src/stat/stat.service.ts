import { Injectable } from "@nestjs/common";
import { Diary } from "src/diaries/diaries.entity";
import { StatTagDto, TagInfoDto } from "./dto/stat.tags.dto";

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

  private getFormatResult(result: TagInfoDto[]): StatTagDto {
    const keys = ["first", "second", "third"];
    const formattedResult = {};
    result.forEach((item, index) => {
      const rank = index + 1;
      formattedResult[keys[index]] = { rank, ...item };
    });

    return formattedResult;
  }
}
