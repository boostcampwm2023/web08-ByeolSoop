import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { ValidationPipe } from "@nestjs/common";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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
      .get("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("정상 요청 시 200 OK 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .get("/diaries")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  });

  it("액세스 토큰 없이 요청 시 401 Unauthorized 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .get("/diaries")
      .expect(401);
  });
});
