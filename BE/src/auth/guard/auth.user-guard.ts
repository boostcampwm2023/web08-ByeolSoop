import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard as NestAuthGuard } from "@nestjs/passport";
import * as jwt from "jsonwebtoken";

@Injectable()
export class NoDuplicateLoginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers["authorization"];

    if (!authorizationHeader) return true;

    const [type, accessToken] = authorizationHeader.split(" ");

    if (type !== "Bearer") return true;

    try {
      jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (error) {
      return true;
    }

    throw new ConflictException("로그인 상태에서 다시 로그인할 수 없습니다.");
  }
}

@Injectable()
export class ExpiredOrNotGuard extends NestAuthGuard("jwt") {
  handleRequest(err, user, info: Error) {
    if (info && !user) {
      if (info.message === "jwt expired") {
        return user;
      } else if (info.message === "No auth token") {
        throw new UnauthorizedException("비로그인 상태의 요청입니다.");
      }
      throw err || new UnauthorizedException("유효하지 않은 토큰입니다.");
    }

    if (err && !user) {
      if (err.message === "no refresh token") {
        throw new ForbiddenException("로그인하지 않은 사용자입니다.");
      } else if (err.message === "refresh expired") {
        throw new ForbiddenException("리프레쉬 토큰이 만료되었습니다.");
      }
      throw new ForbiddenException("유효하지 않은 리프레쉬 토큰입니다.");
    }

    return user;
  }
}
