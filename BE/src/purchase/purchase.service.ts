import { Injectable, BadRequestException } from "@nestjs/common";
import { PurchaseDesignDto, PurchaseListDto } from "./dto/purchase.design.dto";
import { User } from "src/auth/users.entity";
import { PurchaseRepository } from "./purchase.repository";
import { Purchase } from "./purchase.entity";
import { designEnum, domainEnum, premiumStatus } from "src/utils/enum";
import { CreditDto } from "./dto/purchase.credit.dto";
import { PremiumDto } from "./dto/purchase.premium.dto";

@Injectable()
export class PurchaseService {
  constructor(private purchaseRepository: PurchaseRepository) {}

  async purchaseDesign(
    user: User,
    purchaseDesignDto: PurchaseDesignDto,
  ): Promise<CreditDto> {
    const DESIGN_PRICE = 500;
    const domain = domainEnum[purchaseDesignDto.domain];
    const design = designEnum[purchaseDesignDto.design];

    if (await this.isDesignAlreadyPurchased(user.userId, design, design)) {
      throw new BadRequestException(`이미 구매한 디자인입니다.`);
    }

    if (user.credit < DESIGN_PRICE) {
      throw new BadRequestException(
        `보유한 별가루가 부족합니다. 현재 ${user.credit} 별가루`,
      );
    }

    user.credit -= DESIGN_PRICE;
    await user.save();

    await this.purchaseRepository.purchaseDesign(user, domain, design);

    return new CreditDto(user.credit);
  }

  private async isDesignAlreadyPurchased(
    userId: string,
    domain: domainEnum,
    design: designEnum,
  ): Promise<boolean> {
    const found = await Purchase.findOne({
      where: { design, domain, user: { userId } },
    });

    return !!found;
  }

  async purchasePremium(user: User): Promise<CreditDto> {
    const PREMIUM_VERSION_PRICE = 350;

    if (user.premium === premiumStatus.TRUE) {
      throw new BadRequestException(`이미 프리미엄 사용자입니다.`);
    }

    if (user.credit < PREMIUM_VERSION_PRICE) {
      throw new BadRequestException(
        `보유한 별가루가 부족합니다. 현재 ${user.credit} 별가루`,
      );
    }

    user.credit -= PREMIUM_VERSION_PRICE;
    user.premium = premiumStatus.TRUE;
    await user.save();

    return new CreditDto(user.credit);
  }

  async getDesignPurchaseList(user: User): Promise<PurchaseListDto> {
    const purchaseList = await this.purchaseRepository.getDesignPurchaseList(
      user.userId,
    );

    const groundPurchase = [];
    purchaseList.forEach((purchase) => {
      if (purchase.domain === "ground") {
        groundPurchase.push(purchase.design);
      }
    });

    const result = {};
    result["ground"] = groundPurchase;
    return result;
  }

  async getPremiumStatus(user: User): Promise<PremiumDto> {
    return new PremiumDto(user.premium);
  }
}
