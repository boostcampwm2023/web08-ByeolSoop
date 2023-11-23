import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { typeORMConfig } from "src/configs/typeorm.config";
import { User } from "src/auth/users.entity";

describe("[회원가입] /auth/signup POST 통합 테스트", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(typeORMTestConfig), AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("정상 요청 시 204 Created 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUserId",
        password: "TestPassword",
        email: "testemail@naver.com",
        nickname: "TestUser",
      })
      .expect(204);

    const testUser = await User.findOne({ where: { userId: "TestUserId" } });
    await User.remove(testUser);
  });
});
