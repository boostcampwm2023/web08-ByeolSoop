import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { StatService } from "src/stat/stat.service";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

describe("StatService 통합 테스트", () => {
  let service: StatService;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [StatService],
    }).compile();

    service = moduleFixture.get<StatService>(StatService);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();
  });

  afterEach(async () => {
    await transactionalContext.finish();
    await jest.restoreAllMocks();
  });

  describe("getTopThreeTagsByUser 메서드", () => {
    it("메서드 정상 요청", async () => {
      const year = 2023;
      const userId = 2;

      const result = await service.getTopThreeTagsByUser(year, userId);
      const expectedResult = {
        first: { rank: 1, tag: "Old", id: 1, count: 15 },
        second: { rank: 2, tag: "중립", id: 8, count: 6 },
        third: { rank: 3, tag: "긍정", id: 3, count: 5 },
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe("getDiariesDateByUser 메서드", () => {
    it("메서드 정상 요청", async () => {
      const year = 2023;
      const userId = 2;

      const result = await service.getDiariesDateByUser(year, userId);
      const expectedResult = {
        "2023-01-03": { sentiment: "positive", count: 1 },
        "2023-01-06": { sentiment: "neutral", count: 1 },
        "2023-02-22": { sentiment: "neutral", count: 1 },
        "2023-03-03": { sentiment: "negative", count: 1 },
        "2023-03-17": { sentiment: "positive", count: 1 },
        "2023-05-20": { sentiment: "negative", count: 1 },
        "2023-06-06": { sentiment: "negative", count: 1 },
        "2023-08-01": { sentiment: "positive", count: 1 },
        "2023-09-04": { sentiment: "neutral", count: 1 },
        "2023-09-23": { sentiment: "positive", count: 1 },
        "2023-10-01": { sentiment: "negative", count: 1 },
        "2023-10-10": { sentiment: "negative", count: 1 },
        "2023-10-29": { sentiment: "positive", count: 1 },
        "2023-11-01": { sentiment: "neutral", count: 1 },
        "2023-12-25": { sentiment: "neutral", count: 1 },
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe("getTopThreeShapesByUser 메서드", () => {
    it("메서드 정상 요청", async () => {
      const year = 2023;
      const userId = 2;

      const result = await service.getTopThreeShapesByUser(year, userId);
      const expectedResult = {
        first: {
          rank: 1,
          uuid: "eaa0f81e-c6a8-4446-8c5a-44ea1a50bee8",
          count: 6,
        },
        second: {
          rank: 2,
          uuid: "43cb83db-8089-447c-a146-bfa07336528b",
          count: 6,
        },
        third: {
          rank: 3,
          uuid: "7774e2c6-f5b4-47f6-887d-63a6230b4a30",
          count: 3,
        },
      };

      expect(result).toEqual(expectedResult);
    });
  });
});
