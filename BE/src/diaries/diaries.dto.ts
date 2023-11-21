import { IsString, IsDate, Matches, IsUUID, IsArray } from "class-validator";

export class CreateDiaryDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @Matches(RegExp("^-?d+(.d+)?,-?d+(.d+)?,-?d+(.d+)?$"), {
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

export class ReadDiaryDto {
  @IsUUID()
  uuid: string;
}

export class UpdateDiaryDto {
  @IsUUID()
  uuid: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @Matches(RegExp("^-?d+(.d+)?,-?d+(.d+)?,-?d+(.d+)?$"), {
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
