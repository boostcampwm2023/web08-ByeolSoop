import { Controller, Post, UseGuards, Body, HttpCode } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/auth.jwt-guard";
import { PurchaseService } from "./purchase.service";
import { PurchaseDesignDto } from "./dto/purchase.design.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/users.entity";
import { CreditDto } from "./dto/purchase.credit.dto";

@Controller("purchase")
@UseGuards(JwtAuthGuard)
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @Post("/design")
  @HttpCode(204)
  async purchaseDesign(
    @GetUser() user: User,
    @Body() purchaseDesignDto: PurchaseDesignDto,
  ): Promise<void> {
    await this.purchaseService.purchaseDesign(user, purchaseDesignDto);
  }

  @Post("/premium")
  async purchasePremium(@GetUser() user: User): Promise<CreditDto> {
    return this.purchaseService.purchasePremium(user);
  }
}
