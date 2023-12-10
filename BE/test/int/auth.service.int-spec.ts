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

describe("AuthService 통합 테스트", () => {
  let authService: AuthService;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;

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
        userId: "oldUser",
        password: "oldUser",
      };
      const request = { ip: "111.111.111.111" } as Request;

      const result = await authService.signIn(authCredentialsDto, request);

      expect(result).toBeInstanceOf(LoginResponseDto);
      expect(result.nickname).toBe("기존유저");
      expect(result.premium).toBe("TRUE");
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
      const request = {
        ip: "111.111.111.111",
        headers: { authorization: "" },
      } as Request;

      const { accessToken } = await authService.signIn(
        authCredentialsDto,
        request,
      );

      request.headers.authorization = `Bearer ${accessToken}`;
      const result = await authService.reissueAccessToken(request);

      expect(result).toBeInstanceOf(LoginResponseDto);
    });
  });

  describe("naverSignIn 메서드", () => {
    it("메서드 정상 요청", async () => {
      const user = await User.findOne({ where: { userId: "naverUser" } });
      const request = { ip: "111.111.111.111" } as Request;

      const result = await authService.naverSignIn(user, request);
      expect(result).toBeInstanceOf(LoginResponseDto);
      expect(result.nickname).toBe("네이버유저");
      expect(result.premium).toBe("FALSE");
    });
  });

  describe("kakaoSignIn 메서드", () => {
    it("메서드 정상 요청", async () => {
      const user = await User.findOne({ where: { userId: "kakaoUser" } });
      const request = { ip: "111.111.111.111" } as Request;

      const result = await authService.naverSignIn(user, request);
      expect(result).toBeInstanceOf(LoginResponseDto);
      expect(result.nickname).toBe("카카오유저");
      expect(result.premium).toBe("TRUE");
    });
  });
});
