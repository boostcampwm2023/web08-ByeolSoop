import { IsString, IsNumber, IsEnum, MaxLength } from "class-validator";
import { premiumStatus } from "src/utils/enum";

export class CreateUserDto {
  @IsString()
  @MaxLength(20)
  userId: string;

  @IsString()
  @MaxLength(20)
  password: string;

  @IsString()
  @MaxLength(20)
  nickname: string;
}

export class LoginUserDto {
  @IsString()
  userId: string;

  @IsString()
  password: string;
}
