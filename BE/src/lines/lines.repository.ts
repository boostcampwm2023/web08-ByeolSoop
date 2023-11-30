import { Diary } from "src/diaries/diaries.entity";
import { Line } from "./lines.entity";
import { User } from "src/auth/users.entity";
import { NotFoundException } from "@nestjs/common";

export class LinesRepository {
  async createLine(
    firstDiary: Diary,
    secondDiary: Diary,
    user: User,
  ): Promise<Line> {
    const newLine = Line.create({
      firstDiary,
      secondDiary,
      user,
    });
    await newLine.save();

    return newLine;
  }

  async fetchLinesByUser(user: User): Promise<Line[]> {
    const linesList = await Line.find({
      where: { user: { id: user.id } },
    });
    return linesList;
  }

  async deleteDiary(id: number): Promise<void> {
    const diary = await this.getLineById(id);

    await Line.softRemove(diary);
  }

  async getLineById(id: number): Promise<Line> {
    const found = await Line.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException("존재하지 않는 별자리선입니다.");
    }

    return found;
  }
}
