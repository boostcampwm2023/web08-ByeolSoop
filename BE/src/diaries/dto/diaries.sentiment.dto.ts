import { sentimentStatus } from "src/utils/enum";

export class SentimentDto {
  positiveRatio: number;
  neutralRatio: number;
  negativeRatio: number;
  sentiment: sentimentStatus;

  constructor(
    positiveRatio: number,
    neutralRatio: number,
    negativeRatio: number,
    sentiment: sentimentStatus,
  ) {
    this.positiveRatio = positiveRatio;
    this.neutralRatio = neutralRatio;
    this.negativeRatio = negativeRatio;
    this.sentiment = sentiment;
  }
}
