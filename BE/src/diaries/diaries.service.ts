import { Injectable } from "@nestjs/common";
import { DiariesRepository } from "./diaries.repository";
import { Diary } from "./diaries.entity";

@Injectable()
export class DiariesService {
  constructor(private diariesRepository: DiariesRepository) {}
}
