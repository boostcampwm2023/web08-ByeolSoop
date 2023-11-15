import { Injectable } from "@nestjs/common";
import { DiariesRepository } from "./diaries.repository";
import { Diary } from "./diaries.entity";
import { CreateDiaryDto, ReadDiaryDto, UpdateDiaryDto } from "./diaries.dto";

@Injectable()
export class DiariesService {
  constructor(private diariesRepository: DiariesRepository) {}

  async writeDiary(createDiaryDto: CreateDiaryDto): Promise<Diary> {
    const encodedContent = btoa(createDiaryDto.content);
    return this.diariesRepository.createDiary(createDiaryDto, encodedContent);
  }

  async readDiary(readDiaryDto: ReadDiaryDto): Promise<Diary> {
    let diary = await this.diariesRepository.readDiary(readDiaryDto);
    diary.content = atob(diary.content);
    return diary;
  }

  async modifyDiary(updateDiaryDto: UpdateDiaryDto): Promise<Diary> {
    const encodedContent = btoa(updateDiaryDto.content);
    return this.diariesRepository.updateDiary(updateDiaryDto, encodedContent);
  }
}
