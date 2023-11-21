import { IsUUID } from "class-validator";
import { sentimentStatus } from "src/utils/enum";

export class ReadDiaryDto {
  @IsUUID()
  uuid: string;
}

export class ReadDiaryResponseDto {
  userId: string;
  title: string;
  content: string;
  date: Date;
  tags: string[];
  emotion: {
    position: number;
    neutral: number;
    negative: number;
    sentiment: sentimentStatus;
  };
  coordinate: {
    x: number;
    y: number;
    z: number;
  };
  shape_uuid: string;
}
