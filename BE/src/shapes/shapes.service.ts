import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ShapesRepository } from "./shapes.repository";
import { getFileFromS3 } from "src/utils/e3";
import { defaultShapes } from "./shapes.default";
import { Shape } from "./shapes.entity";
import { User } from "src/users/users.entity";

@Injectable()
export class ShapesService {
  constructor(private shapesRepository: ShapesRepository) {}

  async getDefaultShapeFiles(): Promise<Shape[]> {
    const promises = defaultShapes.map(async (defaultShape) => {
      return this.shapesRepository.getShapeByShapePath(defaultShape.shapePath);
    });

    const shapeFiles = await Promise.all(promises);
    return shapeFiles;
  }

  async getShapeFileByUuid(uuid: string, user: User): Promise<object> {
    const shape = await this.shapesRepository.getShapeByUuid(uuid);
    const shapeUser = await shape.user;

    if (shapeUser.userId !== "commonUser" && shapeUser.id !== user.id) {
      throw new UnauthorizedException();
    }
    return getFileFromS3(shape.shapePath);
  }
}
