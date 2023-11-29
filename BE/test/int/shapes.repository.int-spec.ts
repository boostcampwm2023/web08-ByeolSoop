import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { Shape } from "src/shapes/shapes.entity";
import { ShapesModule } from "src/shapes/shapes.module";
import { ShapesRepository } from "src/shapes/shapes.repository";

describe("ShapesRepository 통합 테스트", () => {
  let shapesRepository: ShapesRepository;

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

    shapesRepository =
      await moduleFixture.get<ShapesRepository>(ShapesRepository);
  });

  afterAll(async () => {});

  describe("createDefaultShapes 통합 테스트", () => {
    it("메서드 정상 요청", async () => {
      const commonUser = await User.findOne({
        where: { userId: "commonUser" },
      });

      await shapesRepository.createDefaultShapes(commonUser);

      // 응답이 없는 메서드는 어떻게 테스트해야 할까?
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
      expect(result.length).toBe(18);
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
