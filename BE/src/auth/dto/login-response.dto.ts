export class LoginResponseDto {
  accessToken: string;
  nickname: string;

  constructor(accessToken: string, nickname: string) {
    this.accessToken = accessToken;
    this.nickname = nickname;
  }
}
