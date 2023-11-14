import { IsString, IsNumber, IsEnum } from "class-validator";
import { premiumStatus } from "src/utils/enum";

export class CreateUserDto {
  @IsString()
  userID: string;

  @IsString()
  password: string;

  @IsString()
  nickname: string;

  @IsNumber()
  credit: number;

  @IsEnum(premiumStatus)
  premium: premiumStatus;
}
