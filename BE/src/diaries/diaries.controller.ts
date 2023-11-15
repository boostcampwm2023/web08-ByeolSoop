import { Body, Controller, Post } from "@nestjs/common";
import { DiariesService } from "./diaries.service";
import { CreateDiaryDto } from "./diaries.dto";

@Controller("diaries")
export class DiariesController {
  constructor(private diariesService: DiariesService) {}
}
