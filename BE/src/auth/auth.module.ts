import "dotenv/config";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_TIME,
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
