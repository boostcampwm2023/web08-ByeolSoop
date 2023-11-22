import { IsNotEmpty, IsUUID } from "class-validator";
import { sentimentStatus } from "src/utils/enum";

export class ReadDiaryDto {
  @IsUUID("4", { message: "일기 uuid 값이 uuid 양식이어야 합니다." })
  @IsNotEmpty({ message: "일기 uuid는 비어있지 않아야 합니다." })
  uuid: string;
}

export class ReadDiaryResponseDto {
  userId: string;
  uuid: string;
  title: string;
  content: string;
  date: Date;
  tags: string[];
  emotion: {
    positive: number;
    neutral: number;
    negative: number;
    sentiment: sentimentStatus;
  };
  coordinate: {
    x: number;
    y: number;
    z: number;
  };
  shapeUuid: string;
}
