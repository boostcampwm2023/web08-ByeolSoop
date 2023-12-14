import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ValidationPipe } from "@nestjs/common";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { AuthModule } from "src/auth/auth.module";
import { StatModule } from "src/stat/stat.module";
import { DiariesModule } from "src/diaries/diaries.module";
import { DataSource } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

describe("[연도별, 날짜별 일기 작성 조회] /stat/diaries/:year GET e2e 테스트", () => {
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
        StatModule,
        AuthModule,
        DiariesModule,
      ],
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

  describe("[별숲 현황] /stat/diaries/:year GET e2e 테스트", () => {
    it("정상 요청 시 200 OK 응답", async () => {
      const postResponse = await request(app.getHttpServer())
        .get("/stat/diaries/2023")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      const expectedResult = {
        "2023-01-03": { sentiment: "positive", count: 1 },
        "2023-01-06": { sentiment: "neutral", count: 1 },
        "2023-02-22": { sentiment: "neutral", count: 1 },
        "2023-03-03": { sentiment: "negative", count: 1 },
        "2023-03-17": { sentiment: "positive", count: 1 },
        "2023-05-20": { sentiment: "negative", count: 1 },
        "2023-06-06": { sentiment: "negative", count: 1 },
        "2023-08-01": { sentiment: "positive", count: 1 },
        "2023-09-04": { sentiment: "neutral", count: 1 },
        "2023-09-23": { sentiment: "positive", count: 1 },
        "2023-10-01": { sentiment: "negative", count: 1 },
        "2023-10-10": { sentiment: "negative", count: 1 },
        "2023-10-29": { sentiment: "positive", count: 1 },
        "2023-11-01": { sentiment: "neutral", count: 1 },
        "2023-12-25": { sentiment: "neutral", count: 1 },
      };

      expect(postResponse.body).toEqual(expectedResult);
    });

    it("액세스 토큰 없이 요청 시 401 Unauthorized 응답", async () => {
      const postResponse = await request(app.getHttpServer())
        .get("/stat/diaries/2023")
        .expect(401);

      expect(postResponse.body).toEqual({
        error: "Unauthorized",
        message: "비로그인 상태의 요청입니다.",
        statusCode: 401,
      });
    });
  });

  describe("[별숲 현황] /stat/tags-rank/:year GET e2e 테스트", () => {
    it("정상 요청 시 200 OK 응답", async () => {
      const postResponse = await request(app.getHttpServer())
        .get("/stat/tags-rank/2023")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      const expectedResult = {
        first: { rank: 1, tag: "Old", id: 1, count: 15 },
        second: { rank: 2, tag: "중립", id: 8, count: 6 },
        third: { rank: 3, tag: "긍정", id: 3, count: 5 },
      };

      expect(postResponse.body).toEqual(expectedResult);
    });

    it("액세스 토큰 없이 요청 시 401 Unauthorized 응답", async () => {
      const postResponse = await request(app.getHttpServer())
        .get("/stat/tags-rank/2023")
        .expect(401);

      expect(postResponse.body).toEqual({
        error: "Unauthorized",
        message: "비로그인 상태의 요청입니다.",
        statusCode: 401,
      });
    });
  });

  describe("[별숲 현황] /stat/shapes-rank/:year GET e2e 테스트", () => {
    it("정상 요청 시 200 OK 응답", async () => {
      const postResponse = await request(app.getHttpServer())
        .get("/stat/shapes-rank/2023")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      const expectedResult = {
        first: {
          rank: 1,
          uuid: "eaa0f81e-c6a8-4446-8c5a-44ea1a50bee8",
          count: 6,
        },
        second: {
          rank: 2,
          uuid: "43cb83db-8089-447c-a146-bfa07336528b",
          count: 6,
        },
        third: {
          rank: 3,
          uuid: "7774e2c6-f5b4-47f6-887d-63a6230b4a30",
          count: 3,
        },
      };

      expect(postResponse.body).toEqual(expectedResult);
    });

    it("액세스 토큰 없이 요청 시 401 Unauthorized 응답", async () => {
      const postResponse = await request(app.getHttpServer())
        .get("/stat/shapes-rank/2023")
        .expect(401);

      expect(postResponse.body).toEqual({
        error: "Unauthorized",
        message: "비로그인 상태의 요청입니다.",
        statusCode: 401,
      });
    });
  });
});
