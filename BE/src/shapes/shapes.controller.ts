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
    return this.shapesService.getShapeFileByUuid(uuid, user);
  }

  @Get("/")
  @UseGuards(JwtAuthGuard)
  async getShapesByUser(@GetUser() user: User): Promise<object> {
    const shapeLists = await this.shapesService.getShapesByUser(user);
    const shapeUuidList = shapeLists[0];
    const shapeFileList = shapeLists[1];

    let result = {};

    for (let i = 0; i < shapeUuidList.length; i++) {
      const response = {
        uuid: shapeUuidList[i],
        svg: shapeFileList[i],
      };
      result[`shape${i + 1}`] = response;
    }

    return result;
  }
}
