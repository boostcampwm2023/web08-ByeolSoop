import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard as NestAuthGuard } from "@nestjs/passport";
import { access } from "fs";
import * as jwt from "jsonwebtoken";
import { Redis } from "ioredis";
import { InjectRedis } from "@liaoliaots/nestjs-redis";

@Injectable()
export class JwtAuthGuard extends NestAuthGuard("jwt") {
  constructor(@InjectRedis() protected readonly redisClient: Redis) {
    super();
  }

  handleRequest(err, user, info: Error) {
    if (info && !user) {
      if (info.message === "No auth token") {
        throw new UnauthorizedException("비로그인 상태의 요청입니다.");
      } else if (info.message === "jwt expired") {
        throw new UnauthorizedException("토큰이 만료되었습니다.");
      }
      throw err || new UnauthorizedException("유효하지 않은 토큰입니다.");
    }

    if (err && !user) {
      if (err.message === "no refresh token") {
        throw new ForbiddenException("로그인하지 않은 사용자입니다.");
      } else if (err.message === "refresh expired") {
        throw new ForbiddenException("리프레쉬 토큰이 만료되었습니다.");
      }
      console.log(err.message);
      throw new ForbiddenException("유효하지 않은 리프레쉬 토큰입니다.");
    }
    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    if (!result) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const requestIp = request.ip;
    const accessToken = request.headers.authorization.split(" ")[1];
    console.log(accessToken);

    const refreshToken = await this.redisClient.get(request.user.userId);

    const refreshTokenBody = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET,
    ) as jwt.JwtPayload;

    if (requestIp !== refreshTokenBody.requestIp) {
      return false;
    }
    if (accessToken !== refreshTokenBody.accessToken) {
      return false;
    }

    return true;
  }
}
