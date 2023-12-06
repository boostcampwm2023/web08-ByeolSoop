import "dotenv/config";
import { Injectable, BadRequestException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-naver";
import { User } from "../users.entity";
import { providerEnum } from "src/utils/enum";
import * as bcrypt from "bcryptjs";

@Injectable()
export class NaverOAuthStrategy extends PassportStrategy(Strategy, "naver") {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_PASS,
      callbackURL: `${process.env.BACKEND_URL}/auth/naver/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<User> {
    try {
      const { email, id, nickname } = profile;
      const user = new User();

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(id, salt);

      user.email = email;
      user.userId = id + "*naver";
      user.nickname = nickname;
      user.password = hashedPassword;
      user.provider = providerEnum.NAVER;

      return user;
    } catch (error) {
      throw new BadRequestException(
        `네이버 로그인 중 오류가 발생했습니다 : ${error.message}`,
      );
    }
  }
}
