import "dotenv/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeORMConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: false,
  timezone: "+09:00",
};

export const typeORMTestConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.TEST_DB_NAME,
  entities: ["src/**/*.entity{.ts,.js}"],
  synchronize: true,
  timezone: "+09:00",
};
