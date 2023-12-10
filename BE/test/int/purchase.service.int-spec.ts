import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { UsersRepository } from "src/auth/users.repository";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { PurchaseDesignDto } from "src/purchase/dto/purchase.design.dto";
import { PurchaseRepository } from "src/purchase/purchase.repository";
import { PurchaseService } from "src/purchase/purchase.service";
import { premiumStatus } from "src/utils/enum";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

describe("PurchaseService 통합 테스트", () => {
  let purchaseService: PurchaseService;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;

  const userMockData = {
    userId: "PurchaseServiceTest",
    password: "PurchaseServiceTest",
    nickname: "PurchaseServiceTest",
    email: "test@test.com",
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [PurchaseService, PurchaseRepository, UsersRepository],
    }).compile();

    purchaseService = moduleFixture.get<PurchaseService>(PurchaseService);
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

  //   // 별가루가 부족한 경우 테스트
  //   // 이미 존재하는 디자인에 대한 경우 테스트
  //   // 위 두 테스트는 테스트 DB 데이터 삭제 오류의 문제로 테스트 DB 독립화 이후 구현 예정

  describe("purchaseDesign & getDesignPurchaseList 메서드", () => {
    it("메서드 정상 요청", async () => {
      // 테스트 DB 독립 시 수정 필요
      const user = User.create({
        ...userMockData,
        premium: premiumStatus.FALSE,
        credit: 500,
      });

      await user.save();

      const purchaseDesignDto = new PurchaseDesignDto();
      purchaseDesignDto.domain = "GROUND";
      purchaseDesignDto.design = "GROUND_GREEN";

      const { credit } = await purchaseService.purchaseDesign(
        user,
        purchaseDesignDto,
      );
      expect(credit).toBe(0);

      const result = await purchaseService.getDesignPurchaseList(user);
      expect(result).toStrictEqual({
        ground: ["#254117"],
        sky: [],
      });
    });
  });

  describe("purchasePremium 메서드", () => {
    it("프리미엄 구매 성공", async () => {
      const user = User.create({
        ...userMockData,
        premium: premiumStatus.FALSE,
        credit: 500,
      });

      await user.save();

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
      await user.save();

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
      await user.save();

      await expect(purchaseService.purchasePremium(user)).rejects.toThrow(
        "이미 프리미엄 사용자입니다.",
      );
    });
  });
});
