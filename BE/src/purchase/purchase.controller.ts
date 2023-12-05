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

  @Get("/design")
  @HttpCode(200)
  async getDesignPurchaseList(@GetUser() user: User): Promise<PurchaseListDto> {
    return await this.purchaseService.getDesignPurchaseList(user);
  }
}
