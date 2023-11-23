import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { Shape } from "./shapes.entity";
import { ShapesController } from "./shapes.controller";
import { ShapesService } from "./shapes.service";
import { ShapesRepository } from "./shapes.repository";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Shape]), UsersModule, AuthModule],
  controllers: [ShapesController],
  providers: [ShapesService, ShapesRepository],
  exports: [ShapesRepository],
})
export class ShapesModule {}
