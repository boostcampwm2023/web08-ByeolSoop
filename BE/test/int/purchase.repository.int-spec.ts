import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { Purchase } from "src/purchase/purchase.entity";
import { PurchaseRepository } from "src/purchase/purchase.repository";
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
