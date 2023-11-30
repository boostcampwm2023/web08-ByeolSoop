import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/auth.jwt-guard";
import { LinesService } from "./lines.service";
import { CreateLineDto } from "./dto/lines.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/users.entity";
import { Line } from "./lines.entity";

@Controller("lines")
@UseGuards(JwtAuthGuard)
export class LinesController {
  constructor(private linesService: LinesService) {}

  @Post()
  @HttpCode(201)
  async createLine(
    @Body() createLineDto: CreateLineDto,
    @GetUser() user: User,
  ): Promise<{ id: number }> {
    const line: Line = await this.linesService.createLine(createLineDto, user);
    return { id: line.id };
  }
}
