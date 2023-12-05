import { Injectable, BadRequestException } from "@nestjs/common";
import { PurchaseDesignDto, PurchaseListDto } from "./dto/purchase.design.dto";
import { User } from "src/auth/users.entity";
import { PurchaseRepository } from "./purchase.repository";
import { Purchase } from "./purchase.entity";
import { designEnum, domainEnum } from "src/utils/enum";

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
      await Purchase.findOne({
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

  async getDesignPurchaseList(user: User): Promise<PurchaseListDto> {
    const purchaseList =
      await this.purchaseRepository.getDesignPurchaseList(user);

    const groundPurchase = [];
    const skyPurchase = [];
    await purchaseList.forEach((purchase) => {
      if (purchase.domain === "ground") {
        groundPurchase.push(purchase.design);
      }
      if (purchase.domain === "sky") {
        skyPurchase.push(purchase.design);
      }
    });

    const result = {};
    result["ground"] = groundPurchase;
    result["sky"] = skyPurchase;
    return result;
  }
}
