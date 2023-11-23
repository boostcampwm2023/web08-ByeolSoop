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
    if (testUser) {
      await User.remove(testUser);
    }
  });

  it("중복된 아이디에 대한 요청 시 409 Conflict 응답", async () => {
    await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUserId2",
        password: "TestPassword",
        email: "testemail2@naver.com",
        nickname: "TestUser",
      })
      .expect(204);

    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUserId2",
        password: "TestPassword3",
        email: "testemail3@naver.com",
        nickname: "TestUser3",
      })
      .expect(409);

    const testUser = await User.findOne({ where: { userId: "TestUserId2" } });
    if (testUser) {
      await User.remove(testUser);
    }
  });

  it("중복된 이메일에 대한 요청 시 409 Conflict 응답", async () => {
    await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUserId4",
        password: "TestPassword4",
        email: "testemail4@naver.com",
        nickname: "TestUser4",
      })
      .expect(204);

    const postResponse = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "TestUserId5",
        password: "TestPassword5",
        email: "testemail4@naver.com",
        nickname: "TestUser5",
      })
      .expect(409);

    const testUser = await User.findOne({ where: { userId: "TestUserId4" } });
    if (testUser) {
      await User.remove(testUser);
    }
  });
});
