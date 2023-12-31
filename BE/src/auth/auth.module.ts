import "dotenv/config";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PrivateDiaryGuard } from "./guard/auth.diary-guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { UsersRepository } from "./users.repository";
import { DiariesRepository } from "src/diaries/diaries.repository";
import { KakaoStrategy } from "./strategies/kakao.strategy";
import { NaverOAuthStrategy } from "./strategies/naver.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    KakaoStrategy,
    UsersRepository,
    PrivateDiaryGuard,
    DiariesRepository,
    NaverOAuthStrategy,
  ],
  exports: [PassportModule, UsersRepository],
})
export class AuthModule {}
