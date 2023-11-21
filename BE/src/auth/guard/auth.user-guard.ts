import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ConflictException,
} from "@nestjs/common";
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
