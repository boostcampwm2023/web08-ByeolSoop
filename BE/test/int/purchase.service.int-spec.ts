import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { UsersRepository } from "src/auth/users.repository";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { PurchaseDesignDto } from "src/purchase/dto/purchase.design.dto";
import { PurchaseRepository } from "src/purchase/purchase.repository";
import { PurchaseService } from "src/purchase/purchase.service";
import { premiumStatus } from "src/utils/enum";
import { DataSource, QueryRunner } from "typeorm";
import { clearUserDb } from "src/utils/clearDb";

describe("PurchaseService 통합 테스트", () => {
  let purchaseService: PurchaseService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  let user: User;
  let usersRepository: UsersRepository;

  const userMockData = {
    userId: "PurchaseServiceTest",
    password: "test",
    nickname: "test",
    email: "test@test.com",
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [PurchaseService, PurchaseRepository, UsersRepository],
    }).compile();

    purchaseService = moduleFixture.get<PurchaseService>(PurchaseService);
    dataSource = moduleFixture.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    usersRepository = await moduleFixture.get<UsersRepository>(UsersRepository);
    await clearUserDb(moduleFixture, usersRepository);

    user = new User();
    user.userId = "purchaseTest";
    user.password = "purchaseTest";
    user.nickname = "purchaseTest";
    user.email = "email@email.com";
    await user.save();
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
    await dataSource.destroy();
  });

  describe("purchaseDesign 메서드", () => {
    it("메서드 정상 요청", async () => {
      const purchaseDesignDto = new PurchaseDesignDto();
      purchaseDesignDto.domain = "GROUND";
      purchaseDesignDto.design = "GROUND_GREEN";
      user.credit = 500;
      await user.save();

      await purchaseService.purchaseDesign(user, purchaseDesignDto);
    });

    // 별가루가 부족한 경우 테스트
    // 이미 존재하는 디자인에 대한 경우 테스트
    // 위 두 테스트는 테스트 DB 데이터 삭제 오류의 문제로 테스트 DB 독립화 이후 구현 예정
  });

  describe("getDesignPurchaseList 메서드", () => {
    it("메서드 정상 요청", async () => {
      // 테스트 DB 독립 시 수정 필요
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
