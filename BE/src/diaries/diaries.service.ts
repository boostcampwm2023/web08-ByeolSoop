import { Injectable } from "@nestjs/common";
import { DiariesRepository } from "./diaries.repository";
import { Diary } from "./diaries.entity";
import { CreateDiaryDto } from "./diaries.dto";

@Injectable()
export class DiariesService {
  constructor(private diariesRepository: DiariesRepository) {}

  async writeDiary(createDiaryDto: CreateDiaryDto): Promise<Diary>{
    const encodedContent = btoa(createDiaryDto.content);
    return this.diariesRepository.insertDiary(createDiaryDto, encodedContent);
  }
}
