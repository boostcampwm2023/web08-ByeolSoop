import {
  IsString,
  IsDate,
  Matches,
  IsUUID,
  IsArray,
  IsNotEmpty,
  IsDateString,
} from "class-validator";

export class CreateDiaryDto {
  @IsNotEmpty({ message: "제목은 비어있지 않아야 합니다." })
  @IsString({ message: "제목은 문자열이어야 합니다." })
  title: string;

  @IsString({ message: "내용은 문자열이어야 합니다." })
  content: string;

  @IsNotEmpty({ message: "좌표는 비어있지 않아야 합니다." })
  @IsString({ message: "좌표는 문자열이어야 합니다." })
  @Matches(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, {
    message: "적절하지 않은 좌표 양식입니다.",
  })
  point: string;

  @IsDateString()
  @IsNotEmpty({ message: "날짜는 비어있지 않아야 합니다." })
  date: Date;

  @IsArray({ message: "태그는 배열의 형태여야 합니다." })
  tags: string[];

  @IsUUID("4", { message: "모양 uuid 값이 uuid 양식이어야 합니다." })
  @IsNotEmpty({ message: "모양 uuid는 비어있지 않아야 합니다." })
  shapeUuid: string;
}

export class UpdateDiaryDto {
  @IsUUID()
  uuid: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @Matches(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, {
    message: "적절하지 않은 포인트 양식입니다",
  })
  point: string;

  @IsDate()
  date: Date;

  @IsArray()
  tags: string[];

  @IsUUID()
  shapeUuid: string;
}

export class DeleteDiaryDto {
  @IsUUID()
  uuid: string;
}

export class DiaryUuidDto {
  uuid: string;
}
