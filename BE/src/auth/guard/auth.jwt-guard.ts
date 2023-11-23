import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard as NestAuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends NestAuthGuard("jwt") {
  handleRequest(err, user, info: Error) {
    if (err || !user) {
      if (info.message === "No auth token") {
        throw new UnauthorizedException("비로그인 상태의 요청입니다.");
      } else if (info.message === "jwt expired") {
        throw new UnauthorizedException("토큰이 만료되었습니다.");
      } else if (info.message === "invalid token") {
        throw new UnauthorizedException("유효하지 않은 토큰입니다.");
      }
      throw err || new UnauthorizedException("Unauthorized");
    }
    return user;
  }
}
