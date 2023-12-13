import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { Purchase } from "src/purchase/purchase.entity";
import { PurchaseRepository } from "src/purchase/purchase.repository";
import { designEnum, domainEnum } from "src/utils/enum";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

describe("PurchaseRepository 통합 테스트", () => {
  let purchaseRepository: PurchaseRepository;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [PurchaseRepository],
    }).compile();

    purchaseRepository =
      moduleFixture.get<PurchaseRepository>(PurchaseRepository);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();
  });

  afterEach(async () => {
    await transactionalContext.finish();
  });

  describe("purchaseDesign 메서드", () => {
    it("신규 유저 메서드 정상 요청", async () => {
      const userId = "newUser";
      const newUser = await User.findOne({ where: { userId } });

      await purchaseRepository.purchaseDesign(
        newUser,
        domainEnum.GROUND,
        designEnum.GROUND_2D,
      );
      const result = await Purchase.find({ where: { user: { userId } } });
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        domain: "ground",
        design: "ground_2d",
        user: { id: 3 },
      });
    });
  });

  describe("getDesignPurchaseList 메서드", () => {
    it("기존 유저 메서드 정상 요청", async () => {
      const result = await purchaseRepository.getDesignPurchaseList("oldUser");

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 1,
        domain: "ground",
        design: "ground_2d",
        user: { id: 2 },
      });
    });

    it("신규 유저 메서드 정상 요청", async () => {
      const result = await purchaseRepository.getDesignPurchaseList("newUser");
      expect(result).toEqual([]);
    });
  });
});
