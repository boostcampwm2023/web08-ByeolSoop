import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ShapesService } from "./shapes.service";
import { AuthGuard } from "@nestjs/passport";
import { IdGuard } from "src/auth/auth.id-guard";
import { Shape } from "./shapes.entity";

@Controller("shapes")
export class ShapesController {
  constructor(private shapesService: ShapesService) {}

  @Get("/default")
  async getDefaultShapeFiles(): Promise<Shape[]> {
    return this.shapesService.getDefaultShapeFiles();
  }

  @Get("/:uuid")
  @UseGuards(AuthGuard(), IdGuard)
  async getShapeFilesByUuid(@Param("uuid") uuid: string): Promise<object> {
    return this.shapesService.getShapeFileByUuid(uuid);
  }
}
