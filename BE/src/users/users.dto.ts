import { IsString, IsNumber, IsEnum } from "class-validator";
import { premiumStatus } from "src/utils/enum";

export class CreateUserDto {
  @IsString()
  userId: string;

  @IsString()
  password: string;

  @IsString()
  nickname: string;
}

export class LoginUserDto {
  @IsString()
  userId: string;

  @IsString()
  password: string;
}
