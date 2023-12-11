import { RedisModule } from "@liaoliaots/nestjs-redis";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/users.entity";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { UsersRepository } from "src/auth/users.repository";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/auth/dto/users.dto";
import { AuthCredentialsDto } from "src/auth/dto/auth-credential.dto";
import { Request } from "express";
import { LoginResponseDto } from "src/auth/dto/login-response.dto";
import { NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";
import { premiumStatus, providerEnum } from "src/utils/enum";
import * as bcrypt from "bcryptjs";

describe("AuthService 통합 테스트", () => {
  let authService: AuthService;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;
  const ip: string = "111.111.111.111";

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
    authService = moduleFixture.get<AuthService>(AuthService);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();
  });

  afterEach(async () => {
    await transactionalContext.finish();
    await jest.restoreAllMocks();
  });

  async function performLoginTest(
    result: LoginResponseDto,
    expectedUserId: string,
    expectedNickname: string,
    expectedPremium: premiumStatus,
    expectedRequestIp: string = "111.111.111.111",
  ) {
    const { userId } = authService.extractJwtToken(result.accessToken);
    const refreshToken = await authService.getRefreshTokenFromRedis(userId);
    const { requestIp, accessToken } =
      authService.extractJwtToken(refreshToken);

    expect(result).toBeInstanceOf(LoginResponseDto);
    expect(result.nickname).toBe(expectedNickname);
    expect(result.premium).toBe(expectedPremium);

    expect(userId).toBe(expectedUserId);
    expect(requestIp).toBe(expectedRequestIp);
    expect(accessToken).toEqual(result.accessToken);
  }

  describe("signUp 메서드", () => {
    it("메서드 정상 요청", async () => {
      const createUserDto = new CreateUserDto();
      createUserDto.userId = "ValidUser123";
      createUserDto.email = "valid.email@test.com";
      createUserDto.password = "ValidPass123!";
      createUserDto.nickname = "ValidNickname";

      const result = await authService.signUp(createUserDto);

      expect(result).toBeInstanceOf(User);
      expect(result).toMatchObject({
        userId: "ValidUser123",
        email: "valid.email@test.com",
        provider: providerEnum.BYEOLSOOP,
        credit: 0,
        premium: premiumStatus.FALSE,
      });

      const isPasswordMatch = await bcrypt.compare(
        createUserDto.password,
        result.password,
      );
      expect(isPasswordMatch).toEqual(true);
    });
  });

  describe("기존 유저 signIn 메서드", () => {
    it("메서드 정상 요청", async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        userId: "oldUser",
        password: "oldUser",
      };
      const request = { ip } as Request;

      const result = await authService.signIn(authCredentialsDto, request);
      performLoginTest(
        result,
        authCredentialsDto.userId,
        "기존유저",
        premiumStatus.TRUE,
      );
    });

    it("존재하지 않는 아이디로 요청 시 실패", async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        userId: "notFoundUser",
        password: "notFoundUser",
      };
      const request = { ip } as Request;

      try {
        await authService.signIn(authCredentialsDto, request);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe("존재하지 않는 아이디입니다.");
      }
    });

    it("올바르지 않은 비밀번호로 요청 시 실패", async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        userId: "commonUser",
        password: "commonUser",
      };
      const request = { ip } as Request;

      try {
        await authService.signIn(authCredentialsDto, request);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe("올바르지 않은 비밀번호입니다.");
      }
    });
  });

  describe("기존유저 signOut 메서드", () => {
    it("메서드 정상 요청", async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        userId: "oldUser",
        password: "oldUser",
      };
      const request = { ip: "111.111.111.111" } as Request;

      await authService.signIn(authCredentialsDto, request);
      {
        const refreshToken = await authService.getRefreshTokenFromRedis(
          authCredentialsDto.userId,
        );
        expect(refreshToken).not.toBeNull();
      }

      await authService.signOut(authCredentialsDto.userId);
      {
        const refreshToken = await authService.getRefreshTokenFromRedis(
          authCredentialsDto.userId,
        );
        expect(refreshToken).toBeNull();
      }
    });
  });

  describe("기존유저 reissueAccessToken 메서드", () => {
    it("메서드 정상 요청", async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        userId: "oldUser",
        password: "oldUser",
      };
      const request = {
        ip,
        headers: { authorization: "" },
      } as Request;

      const { accessToken } = await authService.signIn(
        authCredentialsDto,
        request,
      );

      request.headers.authorization = `Bearer ${accessToken}`;

      const result = await authService.reissueAccessToken(request);
      performLoginTest(
        result,
        authCredentialsDto.userId,
        "기존유저",
        premiumStatus.TRUE,
      );
    });
  });

  describe("naverSignIn 메서드", () => {
    it("메서드 정상 요청", async () => {
      const userId = "naverUser";
      const user = await User.findOne({ where: { userId } });
      const request = { ip } as Request;

      const result = await authService.naverSignIn(user, request);
      performLoginTest(result, userId, "네이버유저", premiumStatus.FALSE);
    });
  });

  describe("kakaoSignIn 메서드", () => {
    it("메서드 정상 요청", async () => {
      const userId = "kakaoUser";
      const user = await User.findOne({ where: { userId } });
      const request = { ip } as Request;

      const result = await authService.naverSignIn(user, request);
      performLoginTest(result, userId, "카카오유저", premiumStatus.TRUE);
    });
  });
});
