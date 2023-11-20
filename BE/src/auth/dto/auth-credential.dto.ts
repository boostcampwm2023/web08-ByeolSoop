import { IsString, MaxLength } from "class-validator";

export class AuthCredentialsDto {
  @IsString()
  @MaxLength(20)
  userId: string;

  @IsString()
  @MaxLength(20)
  password: string;
}
