import { premiumStatus } from "src/utils/enum";

export class PremiumDto {
  premium: premiumStatus;

  constructor(premium: premiumStatus) {
    this.premium = premium;
  }
}
