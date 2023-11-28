import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ShapesRepository } from "./shapes.repository";
import { getFileFromS3 } from "src/utils/e3";
import { defaultShapes } from "./shapes.default";
import { Shape } from "./shapes.entity";
import { User } from "src/auth/users.entity";
import { Readable } from "stream";

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

  async getShapeFileByUuid(uuid: string, user: User): Promise<Readable> {
    const shape = await this.shapesRepository.getShapeByUuid(uuid);
    const { userId, id } = await shape.user;

    if (userId !== "commonUser" && id !== user.id) {
      throw new UnauthorizedException();
    }
    return getFileFromS3(shape.shapePath);
  }

  async getShapesByUser(user: User): Promise<string[]> {
    const defaultShapeList = await this.getDefaultShapeFiles();
    const shapeList = defaultShapeList.concat(
      await this.shapesRepository.getShapesByUser(user),
    );

    const shapeArray = await Promise.all(
      shapeList.map((shape) => {
        return shape.uuid;
      }),
    );

    return shapeArray;
  }
}
