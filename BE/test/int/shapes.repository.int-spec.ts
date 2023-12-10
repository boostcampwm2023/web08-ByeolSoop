import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { Shape } from "src/shapes/shapes.entity";
import { ShapesModule } from "src/shapes/shapes.module";
import { ShapesRepository } from "src/shapes/shapes.repository";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

describe("ShapesRepository 통합 테스트", () => {
  let shapesRepository: ShapesRepository;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeORMTestConfig),
        ShapesModule,
        RedisModule.forRoot({
          readyLog: true,
          config: {
            host: "223.130.129.145",
            port: 6379,
          },
        }),
      ],
      providers: [ShapesRepository],
    }).compile();

    shapesRepository = moduleFixture.get<ShapesRepository>(ShapesRepository);
    dataSource = moduleFixture.get<DataSource>(DataSource);
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
      const commonUser = await User.findOne({
        where: { userId: "commonUser" },
      });

      await shapesRepository.createDefaultShapes(commonUser);
    });
  });

  describe("getShapesByUser 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const commonUser = await User.findOne({
        where: { userId: "commonUser" },
      });

      const result: Shape[] =
        await shapesRepository.getShapesByUser(commonUser);

      // 현재는 기본 모양 15개와 기존에 임시로 사용하던 기본 모양 3개가 모두 있음
      // 추후 임시 모양 삭제 시 15로 수정할 것
      expect(result.length).toBe(15);
    });
  });

  describe("getShapeByShapePath 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const shape = await Shape.findOne({
        where: {
          user: {
            userId: "commonUser",
          },
        },
      });

      const result = await shapesRepository.getShapeByShapePath(
        shape.shapePath,
      );

      expect(result).toStrictEqual(shape);
    });
  });

  describe("getShapeByUuid 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const shape = await Shape.findOne({
        where: {
          user: {
            userId: "commonUser",
          },
        },
      });

      const result = await shapesRepository.getShapeByUuid(shape.uuid);

      expect(result).toStrictEqual(shape);
    });
  });
});
