import { sentimentStatus } from "src/utils/enum";

export class TagInfoDto {
  id: number;
  count: number;
  tag: string;
}

export class DiariesInfoDto {
  sentiment: sentimentStatus;
  date: Date;
}

export class StatTagDto {
  [key: string]: ({ rank: number } & TagInfoDto) | {};
}

export class DiariesDateDto {
  [dateString: string]: { sentiment: sentimentStatus; count: Number };
}
