import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/users.entity";
import { UsersRepository } from "src/users/users.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UsersRepository) {
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
    return user;
  }

  isValidPayload(payload: any) {
    if (typeof payload !== "object") return false;
    if (!payload.hasOwnProperty("userId")) return false;

    return true;
  }
}
