import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./configs/typeorm.config";
import { UsersModule } from "./users/users.module";
import { DiariesModule } from "./diaries/diaries.module";
import { AuthModule } from "./auth/auth.module";
import { IntroduceModule } from "./introduce/introduce.module";
import { ShapesModule } from "./shapes/shapes.module";
import { ShapesRepository } from "./shapes/shapes.repository";
import { UsersRepository } from "./users/users.repository";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
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
      }));

    await this.shapesRepository.createDefaultShapes(commonUser);
  }
}
