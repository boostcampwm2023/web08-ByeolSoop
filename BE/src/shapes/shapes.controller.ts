import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ShapesService } from "./shapes.service";
import { AuthGuard } from "@nestjs/passport";
import { Shape } from "./shapes.entity";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/users/users.entity";

@Controller("shapes")
export class ShapesController {
  constructor(private shapesService: ShapesService) {}

  @Get("/default")
  async getDefaultShapeFiles(): Promise<Shape[]> {
    return this.shapesService.getDefaultShapeFiles();
  }

  @Get("/:uuid")
  @UseGuards(AuthGuard())
  async getShapeFilesByUuid(
    @Param("uuid") uuid: string,
    @GetUser() user: User,
  ): Promise<object> {
    return this.shapesService.getShapeFileByUuid(uuid, user);
  }
}
