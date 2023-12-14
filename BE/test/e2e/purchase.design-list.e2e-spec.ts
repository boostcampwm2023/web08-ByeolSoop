import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ValidationPipe } from "@nestjs/common";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { UsersRepository } from "src/auth/users.repository";
import { AuthModule } from "src/auth/auth.module";
import { PurchaseModule } from "src/purchase/purchase.module";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

describe("[별숲 상점] /purchase e2e 테스트", () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let transactionalContext: TransactionalTestContext;
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

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();

    const signInPost = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "oldUser",
        password: process.env.OLD_USER_PASS,
      });

    accessToken = signInPost.body.accessToken;
  });

  afterAll(async () => {
    await transactionalContext.finish();
    await app.close();
  });

  describe("[별숲 상점] /purchase/design GET e2e 테스트", () => {
    it("정상 요청 시 200 OK 응답", async () => {
      const getResponse = await request(app.getHttpServer())
        .get("/purchase/design")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(getResponse.body).toStrictEqual({
        ground: ["ground_2d"],
      });
    });

    it("유효하지 않은 토큰 요청 시 401 Unauthorized 응답", async () => {
      const getResponse = await request(app.getHttpServer())
        .get("/purchase/design")
        .expect(401);
    });

    it("중복 구매 시 401 Unauthorized 응답", async () => {
      const postResponse = await request(app.getHttpServer())
        .post("/purchase/design")
        .send({
          domain: "GROUND",
          design: "GROUND_2D",
        })
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(400);

      expect(postResponse.body.message).toBe("이미 구매한 디자인입니다.");
    });
  });

  describe("[별숲 상점] /purchase/premium GET e2e 테스트", () => {
    it("정상 요청 시 200 OK 응답", async () => {
      const getResponse = await request(app.getHttpServer())
        .get("/purchase/premium")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(getResponse.body).toStrictEqual({
        premium: "TRUE",
      });
    });

    it("유효하지 않은 토큰 요청 시 401 Unauthorized 응답", async () => {
      const getResponse = await request(app.getHttpServer())
        .get("/purchase/premium")
        .expect(401);
    });

    it("중복 구매 시 401 Unauthorized 응답", async () => {
      const postResponse = await request(app.getHttpServer())
        .post("/purchase/premium")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(400);

      expect(postResponse.body.message).toBe("이미 프리미엄 사용자입니다.");
    });
  });

  describe("[별숲 상점] /purchase POST e2e 테스트", () => {
    it("디자인 구매 정상 요청 201 Created 응답", async () => {
      const kakaoUser = await request(app.getHttpServer())
        .post("/auth/signin")
        .send({
          userId: "kakaoUser",
          password: process.env.OLD_USER_PASS,
        });

      const kakaoUserAccessToken = kakaoUser.body.accessToken;

      const postResponse = await request(app.getHttpServer())
        .post("/purchase/design")
        .send({
          domain: "GROUND",
          design: "GROUND_2D",
        })
        .set("Authorization", `Bearer ${kakaoUserAccessToken}`)
        .expect(200);

      expect(postResponse.body).toStrictEqual({
        credit: 500,
      });
    });

    it("프리미엄 구매 정상 요청 201 Created 응답", async () => {
      const naverUser = await request(app.getHttpServer())
        .post("/auth/signin")
        .send({
          userId: "naverUser",
          password: process.env.OLD_USER_PASS,
        });

      const naverUserAccessToken = naverUser.body.accessToken;

      const postResponse = await request(app.getHttpServer())
        .post("/purchase/premium")
        .send({})
        .set("Authorization", `Bearer ${naverUserAccessToken}`)
        .expect(200);

      expect(postResponse.body).toStrictEqual({
        credit: 150,
      });
    });

    it("별가루 부족한 경우 400 Bad Request 응답", async () => {
      const newUser = await request(app.getHttpServer())
        .post("/auth/signin")
        .send({
          userId: "newUser",
          password: process.env.OLD_USER_PASS,
        });

      const newUserAccessToken = newUser.body.accessToken;

      {
        const postResponse = await request(app.getHttpServer())
          .post("/purchase/design")
          .send({
            domain: "GROUND",
            design: "GROUND_2D",
          })
          .set("Authorization", `Bearer ${newUserAccessToken}`)
          .expect(400);

        expect(postResponse.body.message).toBe(
          "보유한 별가루가 부족합니다. 현재 0 별가루",
        );
      }

      {
        const postResponse = await request(app.getHttpServer())
          .post("/purchase/premium")
          .set("Authorization", `Bearer ${newUserAccessToken}`)
          .expect(400);

        expect(postResponse.body.message).toBe(
          "보유한 별가루가 부족합니다. 현재 0 별가루",
        );
      }
    });
  });
});
