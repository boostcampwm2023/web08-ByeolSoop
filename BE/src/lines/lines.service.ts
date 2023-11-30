import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateLineDto } from "./dto/lines.dto";
import { User } from "src/auth/users.entity";
import { Line } from "./lines.entity";
import { LinesRepository } from "./lines.repository";
import { DiariesRepository } from "src/diaries/diaries.repository";
import { Diary } from "src/diaries/diaries.entity";

@Injectable()
export class LinesService {
  constructor(
    private linesRepository: LinesRepository,
    private diariesRepository: DiariesRepository,
  ) {}

  async createLine(createLineDto: CreateLineDto, user: User): Promise<Line> {
    const { uuid1, uuid2 } = createLineDto;

    if (uuid1 === uuid2) {
      throw new BadRequestException(
        "동일한 일기에 별자리선을 생성할 수 없습니다.",
      );
    }

    const firstDiary = await this.diariesRepository.getDiaryByUuid(uuid1);
    const secondDiary = await this.diariesRepository.getDiaryByUuid(uuid2);

    const isDuplicate = await this.isDuplicateLine(
      firstDiary,
      secondDiary,
      user,
    );
    if (isDuplicate) {
      throw new BadRequestException("이미 존재하는 별자리선입니다.");
    }

    if (firstDiary.user.id !== user.id || secondDiary.user.id !== user.id) {
      throw new NotFoundException("존재하지 않는 일기입니다.");
    }

    return this.linesRepository.createLine(firstDiary, secondDiary, user);
  }

  private async isDuplicateLine(
    firstDiary: Diary,
    secondDiary: Diary,
    user: User,
  ): Promise<boolean> {
    const existingLine = await Line.findOne({
      where: [
        {
          firstDiary: { id: firstDiary.id },
          secondDiary: { id: secondDiary.id },
          user: { id: user.id },
        },
        {
          firstDiary: { id: secondDiary.id },
          secondDiary: { id: firstDiary.id },
          user: { id: user.id },
        },
      ],
    });

    return !!existingLine;
  }
}
