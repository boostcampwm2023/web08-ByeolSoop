import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { GetUser } from "src/auth/get-user.decorator";
import { JwtAuthGuard } from "src/auth/guard/auth.jwt-guard";
import { User } from "src/auth/users.entity";
import { StatService } from "./stat.service";
import { DiariesDateDto, StatTagDto } from "./dto/stat.tags.dto";
import { StatShapeDto } from "./dto/stat.shapes.dto";

@Controller("stat")
@UseGuards(JwtAuthGuard)
export class StatController {
  constructor(private statService: StatService) {}

  @Get("/tags-rank/:year")
  async getTagsRank(
    @Param("year", ParseIntPipe) year: number,
    @GetUser() user: User,
  ): Promise<StatTagDto> {
    return this.statService.getTopThreeTagsByUser(year, user.id);
  }

  @Get("/diaries/:year")
  async getDiariesDate(
    @Param("year", ParseIntPipe) year: number,
    @GetUser() user: User,
  ): Promise<DiariesDateDto> {
    return this.statService.getDiariesDateByUser(year, user.id);
  }

  @Get("/shapes-rank/:year")
  async getShapesRank(
    @Param("year", ParseIntPipe) year: number,
    @GetUser() user: User,
  ): Promise<StatShapeDto> {
    return this.statService.getTopThreeShapesByUser(year, user.id);
  }
}
