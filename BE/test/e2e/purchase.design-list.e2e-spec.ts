import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ValidationPipe } from "@nestjs/common";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { clearUserDb } from "src/utils/clearDb";
import { UsersRepository } from "src/auth/users.repository";
import { AuthModule } from "src/auth/auth.module";
import { PurchaseModule } from "src/purchase/purchase.module";
import { User } from "src/auth/users.entity";

describe("[디자인 구매 내역 조회] /purchase/design GET e2e 테스트", () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeORMTestConfig),
        RedisModule.forRoot({
          readyLog: true,
          config: {
            host: "223.130.129.145",
            port: 6379,
          },
        }),
        PurchaseModule,
        AuthModule,
      ],
      providers: [UsersRepository],
    }).compile();

    let usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);

    await clearUserDb(moduleFixture, usersRepository);

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    const signInPost = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "commonUser",
        password: process.env.COMMON_USER_PASS,
      });

    accessToken = signInPost.body.accessToken;

    // 1000 별가루 충전
    const user = await User.findOne({ where: { userId: "commonUser" } });
    user.credit = 1000;
    await user.save();

    // 디자인 구매
    await request(app.getHttpServer())
      .post("/purchase/design")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        domain: "GROUND",
        design: "GROUND_GREEN",
      });

    await request(app.getHttpServer())
      .post("/purchase/design")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        domain: "GROUND",
        design: "GROUND_MOCHA",
      });
  });

  afterAll(async () => {
    await app.close();
  });

  it("정상 요청 시 200 OK 응답", async () => {
    const getResponse = await request(app.getHttpServer())
      .get("/purchase/design")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(getResponse.body).toStrictEqual({
      ground: ["#254117", "#493D26"],
      sky: [],
    });
  });

  it("유효하지 않은 토큰 요청 시 401 Unauthorized 응답", async () => {
    const getResponse = await request(app.getHttpServer())
      .get("/purchase/design")
      .expect(401);
  });
});
