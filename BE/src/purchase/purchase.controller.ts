import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  HttpCode,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/auth.jwt-guard";
import { PurchaseService } from "./purchase.service";
import { PurchaseDesignDto, PurchaseListDto } from "./dto/purchase.design.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/users.entity";
import { CreditDto } from "./dto/purchase.credit.dto";
import { PremiumDto } from "./dto/purchase.premium.dto";

@Controller("purchase")
@UseGuards(JwtAuthGuard)
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @Get("/credit")
  @HttpCode(200)
  async getCreditBalanceByUser(@GetUser() user: User): Promise<CreditDto> {
    return new CreditDto(user.credit);
  }

  @Post("/design")
  @HttpCode(200)
  async purchaseDesign(
    @GetUser() user: User,
    @Body() purchaseDesignDto: PurchaseDesignDto,
  ): Promise<CreditDto> {
    return this.purchaseService.purchaseDesign(user, purchaseDesignDto);
  }

  @Get("/design")
  @HttpCode(200)
  async getDesignPurchaseList(@GetUser() user: User): Promise<PurchaseListDto> {
    return await this.purchaseService.getDesignPurchaseList(user);
  }

  @Post("/premium")
  @HttpCode(200)
  async purchasePremium(@GetUser() user: User): Promise<CreditDto> {
    return this.purchaseService.purchasePremium(user);
  }

  @Get("/premium")
  @HttpCode(200)
  async getPremiumStatus(@GetUser() user: User): Promise<PremiumDto> {
    return this.purchaseService.getPremiumStatus(user);
  }
}
