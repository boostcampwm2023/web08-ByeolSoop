import { IsNotEmpty, IsString, Matches } from "class-validator";

export class AuthCredentialsDto {
  @IsNotEmpty({ message: "유저 아이디는 비어있지 않아야 합니다." })
  @IsString({ message: "유저 아이디는 문자열이어야 합니다." })
  @Matches(/^[A-Za-z0-9\-_]{5,20}$/, {
    message: "적절하지 않은 유저 아이디 양식입니다.",
  })
  userId: string;

  @IsNotEmpty({ message: "비밀번호는 비어있지 않아야 합니다." })
  @IsString({ message: "비밀번호는 문자열이어야 합니다." })
  @Matches(/^[A-Za-z0-9!@#$%^&*()+=\-~]{5,20}$/, {
    message: "적절하지 않은 비밀번호 양식입니다.",
  })
  password: string;
}
