import { premiumStatus } from "src/utils/enum";

export class LoginResponseDto {
  accessToken: string;
  nickname: string;
  premium: premiumStatus;

  constructor(accessToken: string, nickname: string, premium: premiumStatus) {
    this.accessToken = accessToken;
    this.nickname = nickname;
    this.premium = premium;
  }
}
