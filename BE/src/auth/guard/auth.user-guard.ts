import {
  CanActivate,
  ConflictException,
  ExecutionContext,
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
export class LogoutGuard extends NestAuthGuard("jwt") {
  handleRequest(err, user, info: Error) {
    if (err || !user) {
      // 만료된 액세스 토큰으로 로그아웃 가능하도록 구현
      if (info.message === "jwt expired") {
        return user;
      } else if (info.message === "No auth token") {
        throw new UnauthorizedException("비로그인 상태의 요청입니다.");
      }
      throw err || new UnauthorizedException("유효하지 않은 토큰입니다.");
    }
    return user;
  }
}
