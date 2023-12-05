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

describe("[연도별, 날짜별 일기 작성 조회] /stat/diaries/:year GET e2e 테스트", () => {
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
        StatModule,
        AuthModule,
        DiariesModule,
      ],
    }).compile();

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

    for (let i = 1; i <= 3; i++) {
      await request(app.getHttpServer())
        .post("/diaries")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          title: "stat test",
          content: "나는 행복해.",
          point: "1.5,5.5,10.55",
          date: `2023-08-0${i}`,
          tags: ["tagTest"],
          shapeUuid: "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
        });
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it("정상 요청 시 200 OK 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .get("/stat/diaries/2023")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(Object.keys(postResponse.body).includes("2023-08-01")).toEqual(true);
    expect(Object.keys(postResponse.body).includes("2023-08-02")).toEqual(true);
    expect(Object.keys(postResponse.body).includes("2023-08-03")).toEqual(true);
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
