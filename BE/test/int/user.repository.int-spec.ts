import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { AuthModule } from "src/auth/auth.module";
import { UsersRepository } from "src/auth/users.repository";
import { CreateUserDto } from "src/auth/dto/users.dto";
import { ConflictException } from "@nestjs/common";
import { User } from "src/auth/users.entity";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";
import { premiumStatus, providerEnum } from "src/utils/enum";

describe("UsersRepository 통합 테스트", () => {
  let usersRepository: UsersRepository;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig)],
      providers: [UsersRepository],
    }).compile();

    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();
  });

  afterEach(async () => {
    await transactionalContext.finish();
  });

  describe("createUser 메서드", () => {
    it("메서드 정상 요청", async () => {
      const createUserDto = new CreateUserDto();
      createUserDto.userId = "ValidUser123";
      createUserDto.email = "valid.email@test.com";
      createUserDto.password = "ValidPass123!";
      createUserDto.nickname = "ValidNickname";

      const result = await usersRepository.createUser(createUserDto);
      expect(result).toBeInstanceOf(User);
      expect(result).toMatchObject({
        userId: "ValidUser123",
        email: "valid.email@test.com",
        provider: providerEnum.BYEOLSOOP,
        credit: 0,
        premium: premiumStatus.FALSE,
      });
    });

    it("중복된 아이디로 요청 시 실패", async () => {
      const createUserDto = new CreateUserDto();
      createUserDto.userId = "commonUser";
      createUserDto.email = "valid2.email@test.com";
      createUserDto.password = "ValidPass123!";
      createUserDto.nickname = "ValidNickname";

      try {
        await usersRepository.createUser(createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe("중복된 아이디입니다.");
      }
    });
  });

  describe("getUserByUserId 메서드", () => {
    it("commonUser 메서드 정상 요청", async () => {
      const userId = "commonUser";

      const result = await usersRepository.getUserByUserId(userId);

      expect(result).toBeInstanceOf(User);
      expect(result).toMatchObject({
        userId: "commonUser",
        email: "byeolsoop08@naver.com",
        provider: providerEnum.BYEOLSOOP,
        credit: 0,
        premium: premiumStatus.FALSE,
      });
    });

    it("네이버유저 메서드 정상 요청", async () => {
      const userId = "naverUser";

      const result = await usersRepository.getUserByUserId(userId);

      expect(result).toBeInstanceOf(User);
      expect(result).toMatchObject({
        userId: "naverUser",
        email: "naverUser@naver.com",
        provider: providerEnum.NAVER,
        credit: 500,
        premium: premiumStatus.FALSE,
      });
    });

    it("카카오유저 메서드 정상 요청", async () => {
      const userId = "kakaoUser";

      const result = await usersRepository.getUserByUserId(userId);

      expect(result).toBeInstanceOf(User);
      expect(result).toMatchObject({
        userId: "kakaoUser",
        email: "kakaoUser@kakao.com",
        provider: providerEnum.KAKAO,
        credit: 1000,
        premium: premiumStatus.TRUE,
      });
    });

    it("존재하지 않는 사용자 id 조회", async () => {
      const userId = "notFoundUser";

      const result = await usersRepository.getUserByUserId(userId);
      expect(result).toBeNull();
    });
  });
});
