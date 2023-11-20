import { Injectable } from "@nestjs/common";
import { ShapesRepository } from "./shapes.repository";
import { getFileFromS3 } from "src/utils/e3";
import { defaultShapes } from "./shapes.default";
import { Shape } from "./shapes.entity";

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

  async getShapeFileByUuid(uuid: string): Promise<object> {
    const shape = await this.shapesRepository.getShapeByUuid(uuid);
    return getFileFromS3(shape.shapePath);
  }
}
