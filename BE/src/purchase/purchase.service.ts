import { Injectable, BadRequestException } from "@nestjs/common";
import { PurchaseDesignDto } from "./dto/purchase.design.dto";
import { User } from "src/auth/users.entity";
import { PurchaseRepository } from "./purchase.repository";
import { Purchase } from "./purchase.entity";
import { designEnum, domainEnum, premiumStatus } from "src/utils/enum";
import { CreditDto } from "./dto/purchase.credit.dto";

@Injectable()
export class PurchaseService {
  constructor(private purchaseRepository: PurchaseRepository) {}

  async purchaseDesign(
    user: User,
    purchaseDesignDto: PurchaseDesignDto,
  ): Promise<void> {
    const domain = domainEnum[purchaseDesignDto.domain];
    const design = designEnum[purchaseDesignDto.design];

    if (user.credit < 500) {
      throw new BadRequestException(
        `보유한 별가루가 부족합니다. 현재 ${user.credit} 별가루`,
      );
    }

    if (
      Purchase.findOne({
        where: {
          user: { userId: user.userId },
          domain: domain,
          design: design,
        },
      })
    ) {
      throw new BadRequestException(`이미 구매한 디자인입니다.`);
    }

    user.credit -= 500;
    user.save();

    await this.purchaseRepository.purchaseDesign(user, domain, design);
  }

  async purchasePremium(user: User): Promise<CreditDto> {
    const PREMIUM_VERSION_PRICE = 350;

    if (user.premium === premiumStatus.TRUE) {
      throw new BadRequestException(`이미 구매한 디자인입니다.`);
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
}
