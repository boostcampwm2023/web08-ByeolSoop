import { Controller, Get, Header, Param, UseGuards } from "@nestjs/common";
import { ShapesService } from "./shapes.service";
import { Shape } from "./shapes.entity";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/users.entity";
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
  @Header("Content-Type", "image/svg+xml")
  async getShapeFilesByUuid(
    @Param("uuid") uuid: string,
    @GetUser() user: User,
  ): Promise<string> {
    const svgString = await this.shapesService.getShapeFileByUuid(uuid, user);
    return svgString;
  }
}
