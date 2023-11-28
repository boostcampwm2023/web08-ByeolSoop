import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ShapesRepository } from "./shapes.repository";
import { getShapeFromS3 } from "src/utils/e3";
import { defaultShapes } from "./shapes.default";
import { Shape } from "./shapes.entity";
import { User } from "src/auth/users.entity";

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

  async getShapeFileByUuid(uuid: string, user: User): Promise<string> {
    const shape = await this.shapesRepository.getShapeByUuid(uuid);
    const { userId, id } = await shape.user;

    if (userId !== "commonUser" && id !== user.id) {
      throw new UnauthorizedException();
    }

    const shapeFile = await getShapeFromS3(shape.shapePath);
    return shapeFile;
  }
}
