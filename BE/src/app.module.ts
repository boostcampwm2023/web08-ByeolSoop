import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./configs/typeorm.config";

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig)],
})
export class AppModule {}
