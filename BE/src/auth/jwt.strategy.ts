import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/auth/users.entity";
import { UsersRepository } from "src/auth/users.repository";
import { Redis } from "ioredis";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UsersRepository,
    @InjectRedis() private readonly redisClient: Redis,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any): Promise<User> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    if (!this.isValidPayload(payload)) {
      throw new UnauthorizedException();
    }

    const { userId } = payload;
    const user: User = await this.userRepository.getUserByUserId(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const refreshToken = await this.redisClient.get(userId);

    if (!refreshToken) {
      throw new ForbiddenException("no refresh token");
    }

    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      throw new ForbiddenException("refresh expired");
    }

    return user;
  }

  isValidPayload(payload: any) {
    if (typeof payload !== "object") return false;
    if (!payload.hasOwnProperty("userId")) return false;

    return true;
  }
}
