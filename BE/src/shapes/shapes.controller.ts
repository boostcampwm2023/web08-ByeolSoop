import {
  Controller,
  Get,
  Header,
  InternalServerErrorException,
  Param,
  StreamableFile,
  UseGuards,
} from "@nestjs/common";
import { ShapesService } from "./shapes.service";
import { Shape } from "./shapes.entity";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/users/users.entity";
import { JwtAuthGuard } from "src/auth/guard/auth.jwt-guard";

@Controller("shapes")
export class ShapesController {
  constructor(private shapesService: ShapesService) {}

  @Get("/default")
  async getDefaultShapeFiles(): Promise<Shape[]> {
    return this.shapesService.getDefaultShapeFiles();
  }

  @Get("/:uuid")
  @UseGuards(JwtAuthGuard)
  @Header("Content-Type", "image/png")
  async getShapeFilesByUuid(
    @Param("uuid") uuid: string,
    @GetUser() user: User,
  ): Promise<StreamableFile> {
    const stream = await this.shapesService.getShapeFileByUuid(uuid, user);
    try {
      return new StreamableFile(stream);
    } catch (error) {
      throw new InternalServerErrorException(
        "파일을 읽어오는 도중 서버에서 문제가 발생했습니다.",
      );
    }
  }
}
