import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ValidationPipe } from "@nestjs/common";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { ShapesModule } from "src/shapes/shapes.module";

describe("[전체 모양 조회] /shapes GET e2e 테스트", () => {
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
        ShapesModule,
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
  });

  afterAll(async () => {
    await app.close();
  });

  it("정상 요청 시 200 OK 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .get("/shapes")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(postResponse.body).toEqual([
      "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      "d4ffa969-a299-4e15-a700-dccd6ef89f25",
      "acbb06cb-a6bf-4f3b-9f30-f59ad5c03c90",
    ]);
  });

  it("일반 유저 정상 요청 시 200 OK 응답", async () => {
    const signInPost = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "userId",
        password: "password",
      });

    accessToken = signInPost.body.accessToken;

    const postResponse = await request(app.getHttpServer())
      .get("/shapes")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(postResponse.body).toEqual([
      "0c99bbc6-e404-464b-a310-5bf0fa0f0fa7",
      "d4ffa969-a299-4e15-a700-dccd6ef89f25",
      "acbb06cb-a6bf-4f3b-9f30-f59ad5c03c90",
    ]);
  });

  it("액세스 토큰 없이 요청 시 401 Unauthorized 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .get("/shapes")
      .expect(401);

    expect(postResponse.body).toEqual({
      error: "Unauthorized",
      message: "비로그인 상태의 요청입니다.",
      statusCode: 401,
    });
  });
});
