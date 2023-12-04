import "dotenv/config";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-kakao";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: "",
      callbackURL: `${process.env.BACKEND_URL}/auth/kakao/callback`,
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
      console.log(_json);
      const user = {
        kakaoId: _json.id,
        nickname: _json.properties.nickname,
        email: _json.kakao_account.email,
      };
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
