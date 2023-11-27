import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard as NestAuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends NestAuthGuard("jwt") {
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
      throw new ForbiddenException("유효하지 않은 리프레쉬 토큰입니다.");
    }
    return user;
  }
}
