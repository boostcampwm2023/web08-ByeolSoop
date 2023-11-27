import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "src/auth/users.repository";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import * as bcrypt from "bcryptjs";
import { AccessTokenDto } from "./dto/auth-access-token.dto";
import { CreateUserDto } from "./dto/users.dto";
import { User } from "./users.entity";
import { Redis } from "ioredis";
import { InjectRedis } from "@liaoliaots/nestjs-redis";

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
  ): Promise<AccessTokenDto> {
    const { userId, password } = authCredentialsDto;
    const user = await this.usersRepository.getUserByUserId(userId);

    if (!user) {
      throw new NotFoundException("존재하지 않는 아이디입니다.");
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = { userId };
      const accessToken = await this.jwtService.sign(payload, {
        expiresIn: "5m",
      });
      const refreshToken = await this.jwtService.sign(payload, {
        expiresIn: "1h",
      });

      // refresh token의 expire time을 1시간으로 설정
      await this.redisClient.set(userId, refreshToken, "EX", 86400);

      return new AccessTokenDto(accessToken);
    } else {
      throw new NotFoundException("올바르지 않은 비밀번호입니다.");
    }
  }

  async signOut(user: User): Promise<void> {
    await this.redisClient.del(user.userId);
  }

  async reissueAccessToken(user: User): Promise<AccessTokenDto> {
    const { userId } = user;
    const payload = { userId };

    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: "5m",
    });

    return new AccessTokenDto(accessToken);
  }
}
