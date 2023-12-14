import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { Shape } from "src/shapes/shapes.entity";
import { ShapesRepository } from "src/shapes/shapes.repository";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

describe("ShapesRepository 통합 테스트", () => {
  let shapesRepository: ShapesRepository;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;
  let commonUser: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [ShapesRepository],
    }).compile();

    shapesRepository = moduleFixture.get<ShapesRepository>(ShapesRepository);
    dataSource = moduleFixture.get<DataSource>(DataSource);
    commonUser = await User.findOne({
      where: { userId: "commonUser" },
    });
  });

  beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();
  });

  afterEach(async () => {
    await transactionalContext.finish();
  });

  afterAll(async () => {});

  describe("createDefaultShapes 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      await dataSource.query("SET FOREIGN_KEY_CHECKS = 0");
      await Shape.delete({});
      await dataSource.query("SET FOREIGN_KEY_CHECKS = 1");
      expect(await Shape.find()).toHaveLength(0);

      await shapesRepository.createDefaultShapes(commonUser);
      expect(await Shape.find()).toHaveLength(15);
    });
  });

  describe("getShapesByUser 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const result: Shape[] =
        await shapesRepository.getShapesByUser("commonUser");

      expect(result).toHaveLength(15);
    });
  });

  describe("getShapeByShapePath 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const shapePath = "BasicShape10.svg";
      const result = await shapesRepository.getShapeByShapePath(shapePath);

      expect(result.shapePath).toEqual(shapePath);
      expect(result.uuid).toBe("c048ba4f-4ea9-4605-bcc9-e45103d68a4f");
      expect(result.user.userId).toBe("commonUser");
    });
  });

  describe("getShapeByUuid 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const uuid = "c048ba4f-4ea9-4605-bcc9-e45103d68a4f";
      const result = await shapesRepository.getShapeByUuid(uuid);

      expect(result.uuid).toEqual(uuid);
      expect(result.shapePath).toBe("BasicShape10.svg");
      expect(result.user.userId).toBe("commonUser");
    });
  });
});
