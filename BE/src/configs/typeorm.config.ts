import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeORMConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "your_username",
  password: "your_password",
  database: "your_database_name",
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: true,
};
