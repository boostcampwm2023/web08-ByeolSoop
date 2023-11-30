import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/auth.jwt-guard";
import { LinesService } from "./lines.service";
import { CreateLineDto, ReadLineDto } from "./dto/lines.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/users.entity";
import { Line } from "./lines.entity";
import { getReadLineDtoFormat } from "src/utils/data-transform";

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

  @Get()
  async getLinesByUser(@GetUser() user: User): Promise<ReadLineDto[]> {
    const lines: Line[] = await this.linesService.getLinesByUser(user);

    const readLineDtoList: ReadLineDto[] = lines.map((line) =>
      getReadLineDtoFormat(line),
    );

    return readLineDtoList;
  }
}
