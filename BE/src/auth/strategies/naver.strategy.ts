import { Injectable, BadRequestException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Profile, Strategy } from "passport-naver-v2";
import { User } from "../users.entity";
import { providerEnum } from "src/utils/enum";

@Injectable()
export class NaverOAuthStrategy extends PassportStrategy(Strategy, "naver") {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_PASS,
      callbackURL: `${process.env.BACKEND_URL}/auth/naver/callback`,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    try {
      const { email, id, nickname } = profile;
      const user = new User();

      user.email = email;
      user.userId = id + "*naver";
      user.nickname = nickname;
      user.password = "naver";
      user.provider = providerEnum.NAVER;

      return user;
    } catch (error) {
      throw new BadRequestException("네이버 로그인 중 오류가 발생했습니다.");
    }
  }
}
