import { IsString, MaxLength } from "class-validator";

export class AuthCredentialsDto {
  @IsString()
  @MaxLength(20)
  userId: string;

  @IsString()
  @MaxLength(20)
  password: string;
}

export class AccessTokenDto {
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
