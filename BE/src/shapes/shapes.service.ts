import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ShapesRepository } from "./shapes.repository";
import { getShapeFromS3 } from "src/utils/s3";
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
    const { userId, id } = shape.user;

    if (userId !== "commonUser" && id !== user.id) {
      throw new UnauthorizedException();
    }

    return getShapeFromS3(shape.shapePath);
  }

  async getShapesByUser(user: User): Promise<string[][]> {
    let shapeList = [];
    const defaultShapeList = await this.getDefaultShapeFiles();

    if (user.userId !== "commonUser") {
      shapeList = defaultShapeList.concat(
        await this.shapesRepository.getShapesByUser(user),
      );
    } else {
      shapeList = defaultShapeList;
    }

    const shapeUuidList = shapeList.map((shape) => {
      return shape.uuid;
    });

    // getShapeFileByUuid가 async라서 Promise.all로 await을 걸지 않으면 Promise<string[]>이 반환
    const shapeFileList = await Promise.all(
      shapeUuidList.map((uuid) => {
        return this.getShapeFileByUuid(uuid, user);
      }),
    );

    return [shapeUuidList, shapeFileList];
  }
}
