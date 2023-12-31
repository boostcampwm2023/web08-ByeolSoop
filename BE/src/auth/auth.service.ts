import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "src/auth/users.repository";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import * as bcrypt from "bcryptjs";
import { LoginResponseDto } from "./dto/login-response.dto";
import { CreateUserDto } from "./dto/users.dto";
import { User } from "./users.entity";
import { Redis } from "ioredis";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Request } from "express";
import { providerEnum } from "src/utils/enum";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
    request: Request,
  ): Promise<LoginResponseDto> {
    const { userId, password } = authCredentialsDto;
    const user = await this.usersRepository.getUserByUserId(userId);
    const requestIp = request.headers["x-forwarded-for"]
      ? (request.headers["x-forwarded-for"] as string)
      : request.ip;
    if (!user) {
      throw new NotFoundException("존재하지 않는 아이디입니다.");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new NotFoundException("올바르지 않은 비밀번호입니다.");
    }

    const { nickname } = user;
    const accessToken = await this.createUserTokens(userId, requestIp);
    return new LoginResponseDto(accessToken, nickname);
  }

  async signOut(userId: string): Promise<void> {
    await this.redisClient.del(userId);
  }

  async reissueAccessToken(request: Request): Promise<LoginResponseDto> {
    const expiredAccessToken = request.headers.authorization.split(" ")[1];
    const requestIp = request.headers["x-forwarded-for"]
      ? (request.headers["x-forwarded-for"] as string)
      : request.ip;

    // 만료된 액세스 토큰을 직접 디코딩
    const base64Payload = expiredAccessToken.split(".")[1];
    const payload = Buffer.from(base64Payload, "base64");
    const expiredResult = JSON.parse(payload.toString());

    const userId = expiredResult.userId;

    const { nickname } = await User.findOne({
      where: { userId },
    });
    const accessToken = await this.createUserTokens(userId, requestIp);
    return new LoginResponseDto(accessToken, nickname);
  }

  async naverSignIn(user: User, request: Request): Promise<LoginResponseDto> {
    const { userId, nickname } = user;
    const provider = providerEnum.NAVER;
    const requestIp = request.headers["x-forwarded-for"]
      ? (request.headers["x-forwarded-for"] as string)
      : request.ip;

    if (!(await User.findOne({ where: { userId, provider } }))) {
      await user.save();
    }

    const accessToken = await this.createUserTokens(userId, requestIp);
    return new LoginResponseDto(accessToken, nickname);
  }

  async kakaoSignIn(user: User, request: Request): Promise<LoginResponseDto> {
    const { userId, nickname } = user;
    const provider = providerEnum.KAKAO;
    const requestIp = request.headers["x-forwarded-for"]
      ? (request.headers["x-forwarded-for"] as string)
      : request.ip;

    if (!(await User.findOne({ where: { userId, provider } }))) {
      await user.save();
    }

    const accessToken = await this.createUserTokens(userId, requestIp);
    return new LoginResponseDto(accessToken, nickname);
  }

  private async createUserTokens(
    userId: string,
    requestIp: string,
  ): Promise<string> {
    const accessTokenPayload = { userId };
    const accessToken = await this.jwtService.sign(accessTokenPayload, {
      expiresIn: "1h",
    });

    const refreshTokenPayload = {
      requestIp,
      accessToken,
    };
    const refreshToken = await this.jwtService.sign(refreshTokenPayload, {
      expiresIn: "24h",
    });

    // 86000s = 24h
    await this.redisClient.set(userId, refreshToken, "EX", 86400);

    return accessToken;
  }

  extractJwtToken(accessToken: string) {
    const jwtPayload = jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
    ) as jwt.JwtPayload;

    return jwtPayload;
  }

  async getRefreshTokenFromRedis(key: string): Promise<string> {
    return this.redisClient.get(key);
  }
}
