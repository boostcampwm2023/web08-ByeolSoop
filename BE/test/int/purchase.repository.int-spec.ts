import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { Purchase } from "src/purchase/purchase.entity";
import { PurchaseRepository } from "src/purchase/purchase.repository";

describe("PurchaseRepository 통합 테스트", () => {
  let purchaseRepository: PurchaseRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [PurchaseRepository],
    }).compile();

    purchaseRepository = module.get<PurchaseRepository>(PurchaseRepository);
  });

  afterEach(async () => {
    await jest.restoreAllMocks();
  });

  describe("getDesignPurchaseList 메서드", () => {
    it("메서드 정상 요청", async () => {
      const user = await User.findOne({ where: { userId: "commonUser" } });

      const purchaseList = await Purchase.find({
        where: { user: { userId: user.userId } },
      });
      const result = await purchaseRepository.getDesignPurchaseList(user);

      expect(result).toStrictEqual(purchaseList);
    });
  });
});
