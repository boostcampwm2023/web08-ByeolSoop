import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Purchase } from "./purchase.entity";
import { PurchaseController } from "./purchase.controller";
import { PurchaseService } from "./purchase.service";
import { PurchaseRepository } from "./purchase.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Purchase])],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseRepository],
  exports: [PurchaseRepository],
})
export class PurchaseModule {}
