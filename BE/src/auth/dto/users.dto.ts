import { IsString, Length, MaxLength, Matches } from "class-validator";

export class CreateUserDto {
  @IsString()
  @Matches(/^[A-Za-z0-9-]{5,20}$/)
  userId: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "적절하지 않은 이메일 양식입니다.",
  })
  email: string;

  @IsString()
  @Matches(/^[A-Za-z0-9!@#$%^&*()+=-~]{5,20}$/)
  password: string;

  @IsString()
  @MaxLength(21)
  nickname: string;
}

export class LoginUserDto {
  @IsString()
  @Length(5, 20)
  userId: string;

  @IsString()
  @Length(5, 20)
  password: string;
}