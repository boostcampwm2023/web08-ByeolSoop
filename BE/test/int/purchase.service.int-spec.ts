import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { PurchaseRepository } from "src/purchase/purchase.repository";
import { PurchaseService } from "src/purchase/purchase.service";
import { premiumStatus } from "src/utils/enum";
import { DataSource, QueryRunner } from "typeorm";

describe("PurchaseService 통합 테스트", () => {
  let purchaseService: PurchaseService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  const userMockData = {
    userId: "PurchaseServiceTest",
    password: "test",
    nickname: "test",
    email: "test@test.com",
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [PurchaseService, PurchaseRepository],
    }).compile();

    purchaseService = module.get<PurchaseService>(PurchaseService);
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await queryRunner.release();
  });

  describe("purchasePremium 메서드", () => {
    it("프리미엄 구매 성공", async () => {
      const user = User.create({
        ...userMockData,
        premium: premiumStatus.FALSE,
        credit: 500,
      });

      await queryRunner.manager.save(user);

      jest.spyOn(user, "save").mockImplementation(async () => {
        return queryRunner.manager.save(user);
      });

      const result = await purchaseService.purchasePremium(user);

      expect(result.credit).toBe(150);
      expect(user.premium).toBe(premiumStatus.TRUE);
    });

    it("크레딧 부족으로 구매 실패", async () => {
      const user = User.create({
        ...userMockData,
        premium: premiumStatus.FALSE,
        credit: 300,
      });
      await queryRunner.manager.save(user);

      jest.spyOn(user, "save").mockImplementation(async () => {
        return queryRunner.manager.save(user);
      });

      await expect(purchaseService.purchasePremium(user)).rejects.toThrow(
        `보유한 별가루가 부족합니다. 현재 ${user.credit} 별가루`,
      );
    });

    it("프리미엄 중복 구매시 실패", async () => {
      const user = User.create({
        ...userMockData,
        premium: premiumStatus.TRUE,
        credit: 500,
      });
      await queryRunner.manager.save(user);

      jest.spyOn(user, "save").mockImplementation(async () => {
        return queryRunner.manager.save(user);
      });

      await expect(purchaseService.purchasePremium(user)).rejects.toThrow(
        "이미 프리미엄 사용자입니다.",
      );
    });
  });
});
