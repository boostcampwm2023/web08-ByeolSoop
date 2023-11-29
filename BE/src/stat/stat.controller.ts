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

@Controller("stat")
@UseGuards(JwtAuthGuard)
export class StatController {
  constructor(private statService: StatService) {}

  @Get("/tags-rank/:year")
  async getTagsRank(
    @Param("year", ParseIntPipe) year: number,
    @GetUser() user: User,
  ): Promise<Object> {
    return this.statService.getTopThreeTagsByUser(year, user.id);
  }
}
