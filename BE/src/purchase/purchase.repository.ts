import { Purchase } from "./purchase.entity";
import { User } from "src/auth/users.entity";
import { designEnum, domainEnum } from "src/utils/enum";

export class PurchaseRepository {
  async purchaseDesign(
    user: User,
    domain: domainEnum,
    design: designEnum,
  ): Promise<void> {
    const purchase = Purchase.create();

    purchase.domain = domain;
    purchase.design = design;
    purchase.user = user;

    await purchase.save();
  }

  async getDesignPurchaseList(userId: string): Promise<Purchase[]> {
    return Purchase.find({ where: { user: { userId } } });
  }
}
