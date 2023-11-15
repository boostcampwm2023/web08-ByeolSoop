import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./configs/typeorm.config";
import { UsersModule } from "./users/users.module";
import { DiariesModule } from "./diaries/diaries.module";

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), UsersModule, DiariesModule],
})
export class AppModule {}
