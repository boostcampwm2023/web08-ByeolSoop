import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateLineDto {
  @IsUUID("4", { message: "별자리선 uuid1 값이 uuid 양식이어야 합니다." })
  @IsNotEmpty({ message: "별자리선 uuid1는 비어있지 않아야 합니다." })
  uuid1: string;

  @IsUUID("4", { message: "별자리선 uuid2 값이 uuid 양식이어야 합니다." })
  @IsNotEmpty({ message: "별자리선 uuid2는 비어있지 않아야 합니다." })
  uuid2: string;
}
