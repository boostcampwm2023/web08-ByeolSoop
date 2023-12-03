import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { Diary } from "src/diaries/diaries.entity";
import { StatService } from "src/stat/stat.service";

describe("StatService 통합 테스트", () => {
  let service: StatService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [StatService],
    }).compile();

    service = module.get<StatService>(StatService);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe("getTopThreeTagsByUser 메서드", () => {
    it("메서드 정상 요청", async () => {
      const year = 2023;
      const userId = 1;

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { tag: "태그1", id: 1, count: 10 },
          { tag: "태그2", id: 2, count: 9 },
          { tag: "태그3", id: 3, count: 8 },
        ]),
      };

      jest
        .spyOn(Diary, "createQueryBuilder")
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getTopThreeTagsByUser(year, userId);

      expect(result).toEqual({
        first: { rank: 1, tag: "태그1", id: 1, count: 10 },
        second: { rank: 2, tag: "태그2", id: 2, count: 9 },
        third: { rank: 3, tag: "태그3", id: 3, count: 8 },
      });
    });
  });

  describe("getDiariesDateByUser 메서드", () => {
    it("메서드 정상 요청", async () => {
      const year = 2023;
      const userId = 1;

      const result = await service.getDiariesDateByUser(year, userId);

      expect(Object.keys(result).includes("2023-08-01")).toEqual(true);
      expect(Object.keys(result).includes("2023-08-02")).toEqual(true);
      expect(Object.keys(result).includes("2023-08-03")).toEqual(true);
    });
  });
});
