import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { PurchaseRepository } from "src/purchase/purchase.repository";
import { PurchaseService } from "src/purchase/purchase.service";

describe("PurchaseService 통합 테스트", () => {
  let purchaseService: PurchaseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [PurchaseService, PurchaseRepository],
    }).compile();

    purchaseService = module.get<PurchaseService>(PurchaseService);
  });

  describe("getDesignPurchaseList 메서드", () => {
    it("메서드 정상 요청", async () => {
      const user = await User.findOne({ where: { userId: "commonUser" } });

      // 테스트 DB 독립 시 수정 필요
      const result = await purchaseService.getDesignPurchaseList(user);

      expect(result).toStrictEqual({
        ground: ["#254117", "#493D26"],
        sky: [],
      });
    });
  });
});
