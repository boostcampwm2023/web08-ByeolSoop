import "dotenv/config";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-kakao";
import { providerEnum } from "src/utils/enum";
import { User } from "../users.entity";
import * as bcrypt from "bcryptjs";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: `${process.env.FRONTEND_URL}/auth/kakao/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      const { _json } = profile;
      const { id, kakao_account, properties } = _json;

      const user = new User();

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(id.toString(), salt);

      user.email = kakao_account.email;
      user.userId = id.toString() + "*kakao";
      user.nickname = properties.nickname;
      user.password = hashedPassword;
      user.provider = providerEnum.KAKAO;

      console.log(user);
      done(null, user);
    } catch (error) {
      done(
        new BadRequestException(
          `카카오 로그인 중 오류가 발생했습니다 : ${error.message}`,
        ),
      );
    }
  }
}
