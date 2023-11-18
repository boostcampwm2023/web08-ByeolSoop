import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./configs/typeorm.config";
import { UsersModule } from "./users/users.module";
import { DiariesModule } from "./diaries/diaries.module";
import { IntroduceModule } from "./introduce/introduce.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
    DiariesModule,
    IntroduceModule,
  ],
})
export class AppModule {}
