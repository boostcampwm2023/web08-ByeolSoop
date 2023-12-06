import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { UsersRepository } from "src/auth/users.repository";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { PurchaseDesignDto } from "src/purchase/dto/purchase.design.dto";
import { Purchase } from "src/purchase/purchase.entity";
import { PurchaseRepository } from "src/purchase/purchase.repository";
import { PurchaseService } from "src/purchase/purchase.service";
import { clearUserDb } from "src/utils/clearDb";
import { DataSource } from "typeorm";

describe("PurchaseService 통합 테스트", () => {
  let purchaseService: PurchaseService;
  let user: User;
  let usersRepository: UsersRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [PurchaseService, PurchaseRepository, UsersRepository],
    }).compile();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    purchaseService = moduleFixture.get<PurchaseService>(PurchaseService);

    usersRepository = await moduleFixture.get<UsersRepository>(UsersRepository);
    await clearUserDb(moduleFixture, usersRepository);

    user = new User();
    user.userId = "purchaseTest";
    user.password = "purchaseTest";
    user.nickname = "purchaseTest";
    user.email = "email@email.com";
    await user.save();
  });

  afterAll(async () => {
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
});
