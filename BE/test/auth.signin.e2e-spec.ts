import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { ValidationPipe } from "@nestjs/common";

describe("/auth/signin (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });

  it("정상 요청 시 201 Created 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "commonUser",
        password: process.env.COMMON_USER_PASS,
      })
      .expect(201);

    expect(postResponse.body).toHaveProperty("accessToken");
  });

  it("존재하지 않는 아이디에 대한 요청 시 404 Not Found 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "nonExistingUserId",
        password: "password!",
      })
      .expect(404);

    expect(postResponse.body).toEqual({
      error: "Not Found",
      message: "존재하지 않는 아이디입니다.",
      statusCode: 404,
    });
  });

  it("올바르지 않은 비밀번호에 대한 요청 시 404 Not Found 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "commonUser",
        password: "incorrectPassword",
      })
      .expect(404);

    expect(postResponse.body).toEqual({
      error: "Not Found",
      message: "올바르지 않은 비밀번호입니다.",
      statusCode: 404,
    });
  });

  it("만료되지 않은 액세스 토큰이 포함된 상태로 로그인 요청 시 409 Conflict 응답", async () => {
    const loginResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "commonUser",
        password: process.env.COMMON_USER_PASS,
      });

    const postResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .set("Authorization", `Bearer ${loginResponse.body.accessToken}`)
      .expect(409);

    expect(postResponse.body).toEqual({
      error: "Conflict",
      message: "로그인 상태에서 다시 로그인할 수 없습니다.",
      statusCode: 409,
    });
  });
});
