import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { UsersRepository } from "src/auth/users.repository";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { PurchaseDesignDto } from "src/purchase/dto/purchase.design.dto";
import { PurchaseRepository } from "src/purchase/purchase.repository";
import { PurchaseService } from "src/purchase/purchase.service";
import { designEnum, domainEnum, premiumStatus } from "src/utils/enum";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

describe("PurchaseService 통합 테스트", () => {
  let purchaseService: PurchaseService;
  let purchaseDesignDto: PurchaseDesignDto;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [PurchaseService, PurchaseRepository, UsersRepository],
    }).compile();

    purchaseService = moduleFixture.get<PurchaseService>(PurchaseService);
    dataSource = moduleFixture.get<DataSource>(DataSource);

    purchaseDesignDto = new PurchaseDesignDto();
    purchaseDesignDto.domain = domainEnum.GROUND;
    purchaseDesignDto.design = designEnum.GROUND_2D;
  });

  beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();
  });

  afterEach(async () => {
    await transactionalContext.finish();
  });

  describe("purchaseDesign & getDesignPurchaseList 메서드", () => {
    it("네이버유저 메서드 정상 요청", async () => {
      const naverUser = await User.findOne({ where: { userId: "naverUser" } });
      {
        const result = await purchaseService.getDesignPurchaseList(naverUser);
        expect(result).toStrictEqual({
          ground: [],
        });
      }

      const { credit } = await purchaseService.purchaseDesign(
        naverUser,
        purchaseDesignDto,
      );
      expect(credit).toBe(0);

      {
        const result = await purchaseService.getDesignPurchaseList(naverUser);
        expect(result).toStrictEqual({
          ground: ["ground_2d"],
        });
      }
    });

    it("크레딧이 없는 신규유저 요청", async () => {
      const newUser = await User.findOne({ where: { userId: "newUser" } });

      const result = await purchaseService.getDesignPurchaseList(newUser);
      expect(result).toStrictEqual({
        ground: [],
      });

      await expect(
        purchaseService.purchaseDesign(newUser, purchaseDesignDto),
      ).rejects.toThrow(`보유한 별가루가 부족합니다. 현재 0 별가루`);
    });

    it("이미 ground_2d 디자인을 구매한 기존유저 요청", async () => {
      const oldUser = await User.findOne({ where: { userId: "oldUser" } });

      const result = await purchaseService.getDesignPurchaseList(oldUser);
      expect(result).toStrictEqual({
        ground: ["ground_2d"],
      });

      await expect(
        purchaseService.purchaseDesign(oldUser, purchaseDesignDto),
      ).rejects.toThrow(`이미 구매한 디자인입니다.`);
    });
  });

  describe("purchasePremium & getPremiumStatus 메서드", () => {
    it("네이버유저 프리미엄 구매 성공", async () => {
      const naverUser = await User.findOne({ where: { userId: "naverUser" } });
      {
        const { premium } = await purchaseService.getPremiumStatus(naverUser);
        expect(premium).toBe(premiumStatus.FALSE);
      }

      const { credit } = await purchaseService.purchasePremium(naverUser);
      expect(credit).toBe(150);
      {
        const { premium } = await purchaseService.getPremiumStatus(naverUser);
        expect(premium).toBe(premiumStatus.TRUE);
      }
    });

    it("크레딧이 없는 신규유저 요청", async () => {
      const newUser = await User.findOne({ where: { userId: "newUser" } });

      await expect(purchaseService.purchasePremium(newUser)).rejects.toThrow(
        `보유한 별가루가 부족합니다. 현재 0 별가루`,
      );
    });

    it("이미 프리미엄 사용자인 카카오유저 요청", async () => {
      const kakaoUser = await User.findOne({ where: { userId: "kakaoUser" } });
      {
        const { premium } = await purchaseService.getPremiumStatus(kakaoUser);
        expect(premium).toBe(premiumStatus.TRUE);
      }

      await expect(purchaseService.purchasePremium(kakaoUser)).rejects.toThrow(
        "이미 프리미엄 사용자입니다.",
      );
    });
  });
});
