import { Injectable } from "@nestjs/common";
import { DiariesRepository } from "./diaries.repository";
import { Diary } from "./diaries.entity";
import { CreateDiaryDto, ReadDiaryDto } from "./diaries.dto";

@Injectable()
export class DiariesService {
  constructor(private diariesRepository: DiariesRepository) {}

  async writeDiary(createDiaryDto: CreateDiaryDto): Promise<Diary>{
    const encodedContent = btoa(createDiaryDto.content);
    return this.diariesRepository.createDiary(createDiaryDto, encodedContent);
  }

  async readDiary(readDiaryDto: ReadDiaryDto): Promise<Diary>{
    let diary = await this.diariesRepository.readDiary(readDiaryDto);
    diary.content = atob(diary.content);
    return diary;
  }
}
