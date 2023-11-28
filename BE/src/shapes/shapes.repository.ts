import { defaultShapes } from "./shapes.default";
import { User } from "src/auth/users.entity";
import { Shape } from "./shapes.entity";
import { NotFoundException } from "@nestjs/common";

export class ShapesRepository {
  async createDefaultShapes(commonUser: User) {
    await Promise.all(
      defaultShapes.map(async (defaultShape) => {
        const existingShape = await this.getShapeByShapePath(
          defaultShape.shapePath,
        );

        if (existingShape) return;

        defaultShape.user = commonUser;
        const shape = Shape.create(defaultShape);
        await shape.save();
      }),
    );
  }

  async getShapeByShapePath(shapePath: string): Promise<Shape | null> {
    return Shape.findOne({ where: { shapePath } });
  }

  async getShapeByUuid(uuid: string): Promise<Shape> {
    const found = await Shape.findOne({ where: { uuid } });
    if (!found) {
      throw new NotFoundException(`Can't find Shape with uuid: [${uuid}]`);
    }
    return found;
  }

  async getShapesByUser(user: User): Promise<Shape[]> {
    let shapeList: Shape[] = await Shape.find({
      where: { user: { userId: user.userId } },
    });
    if (!shapeList) {
      throw new NotFoundException("존재하지 않는 사용자입니다.");
    }

    // 기본 모양 추가
    if (user.userId !== "commonUser") {
      const commonUser = await User.findOne({
        where: { userId: "commonUser" },
      });

      shapeList.concat(
        await Shape.find({
          where: { user: { userId: commonUser.userId } },
        }),
      );
    }

    return shapeList;
  }
}
