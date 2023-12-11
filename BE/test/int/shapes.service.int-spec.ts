import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ShapesService } from "src/shapes/shapes.service";
import { ShapesRepository } from "src/shapes/shapes.repository";
import { Shape } from "src/shapes/shapes.entity";
import { User } from "src/auth/users.entity";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { defaultShapes } from "src/shapes/shapes.default";

jest.mock("src/utils/s3", () => ({
  getShapeFromS3: jest.fn().mockResolvedValue("shape_svg_string"),
}));

describe("ShapesService 통합 테스트", () => {
  let shapeService: ShapesService;
  let shapesRepository: ShapesRepository;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;
  let oldUser: User;
  const shapeUuid = "8d010933-03f6-48f1-aa9f-5e4771eaf28c";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [ShapesService, ShapesRepository],
    }).compile();

    shapeService = moduleFixture.get<ShapesService>(ShapesService);
    shapesRepository = moduleFixture.get<ShapesRepository>(ShapesRepository);
    dataSource = moduleFixture.get<DataSource>(DataSource);

    oldUser = await User.findOne({ where: { userId: "oldUser" } });
  });

  beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();
  });

  afterEach(async () => {
    await transactionalContext.finish();
    await jest.restoreAllMocks();
  });

  describe("getDefaultShapeFiles 메서드", () => {
    it("메서드 정상 요청", async () => {
      const shapes = await shapeService.getDefaultShapeFiles();

      expect(shapes).toHaveLength(defaultShapes.length);
      expect(shapes.every((shape) => shape instanceof Shape)).toBe(true);
      expect(shapes.map((shape) => shape.shapePath).sort()).toEqual(
        defaultShapes.map((shape) => shape.shapePath).sort(),
      );
    });
  });

  describe("getShapeFileByUuid 메서드", () => {
    it("메서드 정상 요청", async () => {
      const shapeFile = await shapeService.getShapeFileByUuid(
        shapeUuid,
        oldUser,
      );
      expect(shapeFile).toBe("shape_svg_string");
    });

    it("요청한 모양이 사용자의 소유가 아닐 경우 Unauthorized 응답", async () => {
      const shape: Shape = new Shape();
      shape.user = new User();
      shape.user.id = 35;

      jest.spyOn(shapesRepository, "getShapeByUuid").mockResolvedValue(shape);

      await expect(
        shapeService.getShapeFileByUuid("uuid", oldUser),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("getShapesByUser 메서드", () => {
    it("메서드 정상 요청", async () => {
      const [shapeUuidList, shapeFileList] =
        await shapeService.getShapesByUser(oldUser);

      expect(shapeUuidList).toHaveLength(15);
      expect(shapeUuidList).toContain(shapeUuid);
      expect(shapeFileList).toHaveLength(15);
      expect(shapeFileList.every((file) => file === "shape_svg_string")).toBe(
        true,
      );
    });
  });
});
