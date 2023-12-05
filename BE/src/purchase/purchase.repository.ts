import { Purchase } from "./purchase.entity";
import { PurchaseDesignDto } from "./dto/purchase.design.dto";
import { User } from "src/auth/users.entity";
import { designEnum, domainEnum } from "src/utils/enum";

export class PurchaseRepository {
  async purchaseDesign(
    user: User,
    domain: domainEnum,
    design: designEnum,
  ): Promise<void> {
    const purchase = await Purchase.create();

    purchase.domain = domain;
    purchase.design = design;
    purchase.user = user;

    purchase.save();
  }
}
