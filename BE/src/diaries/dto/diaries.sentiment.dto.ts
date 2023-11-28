import { sentimentStatus } from "src/utils/enum";

export class SentimentDto {
  positiveRatio: number;
  neutralRatio: number;
  negativeRatio: number;
  sentiment: sentimentStatus;
}
