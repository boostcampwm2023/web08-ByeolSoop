import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ShapesService } from "src/shapes/shapes.service";
import { ShapesRepository } from "src/shapes/shapes.repository";
import { Shape } from "src/shapes/shapes.entity";
import { User } from "src/auth/users.entity";
import { defaultShapes } from "src/shapes/shapes.default";
import * as s3 from "src/utils/s3";

jest.mock("src/utils/s3", () => ({
  getShapeFromS3: jest.fn().mockResolvedValue("shape_svg_string"),
}));

describe("ShapesService 통합 테스트", () => {
  let shapeService: ShapesService;
  let shapesRepository: ShapesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShapesService, ShapesRepository],
    }).compile();

    shapeService = module.get<ShapesService>(ShapesService);
    shapesRepository = module.get<ShapesRepository>(ShapesRepository);
    jest.clearAllMocks();
  });

  describe("getDefaultShapeFiles 메서드", () => {
    it("메서드 정상 요청", async () => {
      const shape: Shape = new Shape();
      jest
        .spyOn(shapesRepository, "getShapeByShapePath")
        .mockResolvedValue(shape);

      const shapes = await shapeService.getDefaultShapeFiles();
      expect(shapes).toHaveLength(defaultShapes.length);
      expect(shapes.every((shape) => shape instanceof Shape)).toBe(true);
    });
  });

  describe("getShapeFileByUuid 메서드", () => {
    it("메서드 정상 요청", async () => {
      const shape: Shape = new Shape();
      shape.user = new User();
      jest.spyOn(shapesRepository, "getShapeByUuid").mockResolvedValue(shape);

      const shapeFile = await shapeService.getShapeFileByUuid(
        "uuid",
        new User(),
      );
      expect(shapeFile).toBe("shape_svg_string");
    });

    it("요청한 모양이 사용자의 소유가 아닐 경우 Unauthorized 응답", async () => {
      const shape: Shape = new Shape();
      shape.user = new User();
      shape.user.id = 35;
      jest.spyOn(shapesRepository, "getShapeByUuid").mockResolvedValue(shape);

      await expect(
        shapeService.getShapeFileByUuid("uuid", new User()),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("getShapesByUser 메서드", () => {
    it("메서드 정상 요청", async () => {
      const shapeDefault: Shape = new Shape();
      const shapeUser: Shape = new Shape();

      jest
        .spyOn(shapeService, "getDefaultShapeFiles")
        // 원래는 15개의 기본 모양이 있지만, mocking 용으로 3개의 모양만 반환하도록 함
        .mockResolvedValue([shapeDefault, shapeDefault, shapeDefault]);
      jest
        .spyOn(shapesRepository, "getShapesByUser")
        .mockResolvedValue([shapeUser]);
      jest
        .spyOn(shapeService, "getShapeFileByUuid")
        .mockResolvedValue("shape_svg_string");

      const [shapeUuidList, shapeFileList] = await shapeService.getShapesByUser(
        new User(),
      );
      expect(shapeUuidList).toHaveLength(4);
      expect(shapeFileList).toHaveLength(4);
      expect(shapeFileList.every((file) => file === "shape_svg_string")).toBe(
        true,
      );
    });
  });
});
