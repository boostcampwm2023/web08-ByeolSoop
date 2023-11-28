import "dotenv/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./configs/typeorm.config";
import { DiariesModule } from "./diaries/diaries.module";
import { AuthModule } from "./auth/auth.module";
import { IntroduceModule } from "./introduce/introduce.module";
import { ShapesModule } from "./shapes/shapes.module";
import { ShapesRepository } from "./shapes/shapes.repository";
import { UsersRepository } from "./auth/users.repository";
import { typeORMTestConfig } from "./configs/typeorm.test.config";
import { RedisModule } from "@liaoliaots/nestjs-redis";

@Module({
  imports: [
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === "test" ? typeORMTestConfig : typeORMConfig,
    ),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: "223.130.129.145",
        port: 6379,
      },
    }),
    DiariesModule,
    AuthModule,
    IntroduceModule,
    ShapesModule,
  ],
  providers: [ShapesRepository, UsersRepository],
})
export class AppModule {
  constructor(
    private shapesRepository: ShapesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async onModuleInit() {
    const commonUser =
      (await this.usersRepository.getUserByUserId("commonUser")) ||
      (await this.usersRepository.createUser({
        userId: "commonUser",
        password: process.env.COMMON_USER_PASS,
        nickname: "commonUser",
        email: "byeolsoop08@naver.com",
      }));

    await this.shapesRepository.createDefaultShapes(commonUser);
  }
}
