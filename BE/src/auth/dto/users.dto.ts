import {
  IsString,
  Length,
  MaxLength,
  Matches,
  IsNotEmpty,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "아이디는 비어있지 않아야 합니다." })
  @IsString({ message: "아이디는 문자열이어야 합니다." })
  @Matches(/^[A-Za-z0-9-]{5,20}$/, {
    message: "생성 규칙에 맞지 않는 아이디입니다.",
  })
  userId: string;

  @IsNotEmpty({ message: "이메일은 비어있지 않아야 합니다." })
  @IsString({ message: "이메일은 문자열이어야 합니다." })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "적절하지 않은 이메일 양식입니다.",
  })
  email: string;

  @IsNotEmpty({ message: "비밀번호는 비어있지 않아야 합니다." })
  @IsString({ message: "비밀번호는 문자열이어야 합니다." })
  @Matches(/^[A-Za-z0-9!@#$%^&*()+=-~]{5,20}$/, {
    message: "생성 규칙에 맞지 않는 비밀번호 입니다.",
  })
  password: string;

  @IsNotEmpty({ message: "닉네임은 비어있지 않아야 합니다." })
  @IsString({ message: "닉네임은 문자열이어야 합니다." })
  @MaxLength(20, { message: "닉네임은 20자 이하여야 합니다." })
  nickname: string;
}
