import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { Diary } from "src/diaries/diaries.entity";
import { DiariesModule } from "src/diaries/diaries.module";
import { DiariesRepository } from "src/diaries/diaries.repository";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { UsersRepository } from "src/auth/users.repository";
import { JwtService } from "@nestjs/jwt";
import { clearUserDb } from "src/utils/clearDb";
import { CreateUserDto } from "src/auth/dto/users.dto";
import { AuthCredentialsDto } from "src/auth/dto/auth-credential.dto";
import { Request } from "express";
import { AccessTokenDto } from "src/auth/dto/auth-access-token.dto";
import { NotFoundException } from "@nestjs/common";
import { RedisClient } from "ioredis/built/connectors/SentinelConnector/types";

describe("AuthService 통합 테스트", () => {
  let authService: AuthService;
  let usersRepository: UsersRepository;
  let jwtService: JwtService;
  let redisClient: RedisClient;

  //   jest.mock("rxjs", () => ({
  //     lastValueFrom: jest.fn().mockResolvedValue({
  //       data: {
  //         document: {
  //           confidence: {
  //             positive: 0.1,
  //             neutral: 0.2,
  //             negative: 0.7,
  //           },
  //           sentiment: "negative",
  //         },
  //       },
  //     }),
  //   }));

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeORMTestConfig),
        AuthModule,
        RedisModule.forRoot({
          readyLog: true,
          config: {
            host: "223.130.129.145",
            port: 6379,
          },
        }),
      ],
      providers: [AuthService, UsersRepository, JwtService],
    }).compile();
    authService = await moduleFixture.get<AuthService>(AuthService);
    usersRepository = await moduleFixture.get<UsersRepository>(UsersRepository);
    jwtService = await moduleFixture.get<JwtService>(JwtService);

    await clearUserDb(moduleFixture, usersRepository);
  });

  beforeEach(async () => {});

  afterEach(async () => {
    await jest.clearAllMocks();
  });
  describe("signUp 메서드", () => {
    it("메서드 정상 요청", async () => {
      const createUserDto = new CreateUserDto();
      createUserDto.userId = "ValidUser123";
      createUserDto.email = "valid.email@test.com";
      createUserDto.password = "ValidPass123!";
      createUserDto.nickname = "ValidNickname";

      const result = await authService.signUp(createUserDto);

      expect(result).toBeInstanceOf(User);
      expect(result.userId).toBe("ValidUser123");
    });
  });

  describe("signIn 메서드", () => {
    it("메서드 정상 요청", async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        userId: "commonUser",
        password: process.env.COMMON_USER_PASS,
      };
      const request = { ip: "111.111.111.111" } as Request;

      const result = await authService.signIn(authCredentialsDto, request);

      expect(result).toBeInstanceOf(AccessTokenDto);
    });

    it("존재하지 않는 아이디로 요청 시 실패", async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        userId: "notFoundUser",
        password: "notFoundUser",
      };
      const request = { ip: "111.111.111.111" } as Request;

      try {
        await authService.signIn(authCredentialsDto, request);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it("올바르지 않은 비밀번호로 요청 시 실패", async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        userId: "commonUser",
        password: "commonUser",
      };
      const request = { ip: "111.111.111.111" } as Request;

      try {
        await authService.signIn(authCredentialsDto, request);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe("signOut 메서드", () => {
    it("메서드 정상 요청", async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        userId: "commonUser",
        password: process.env.COMMON_USER_PASS,
      };
      const request = { ip: "111.111.111.111" } as Request;

      const user = await User.findOne({ where: { userId: "commonUser" } });

      await authService.signIn(authCredentialsDto, request);
      await authService.signOut(user);
    });
  });

  describe("reissueAccessToken 메서드", () => {
    it("메서드 정상 요청", async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        userId: "commonUser",
        password: process.env.COMMON_USER_PASS,
      };
      const user = await User.findOne({ where: { userId: "commonUser" } });
      const request = { ip: "111.111.111.111" } as Request;

      await authService.signIn(authCredentialsDto, request);
      const result = await authService.reissueAccessToken(user, request);

      expect(result).toBeInstanceOf(AccessTokenDto);
    });
  });
});
