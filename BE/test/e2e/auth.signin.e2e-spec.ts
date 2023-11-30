import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ValidationPipe } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { RedisModule } from "@liaoliaots/nestjs-redis";

describe("[로그인] /auth/signin POST e2e 테스트", () => {
  let app: INestApplication;

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
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
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

  it("형식에 맞지 않은 아이디에 대한 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: undefined,
        password: "password!",
      })
      .expect(400);

    expect(postResponse.body.message).toContain(
      "유저 아이디는 비어있지 않아야 합니다.",
    );
  });

  it("형식에 맞지 않은 아이디에 대한 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "",
        password: "password!",
      })
      .expect(400);

    expect(postResponse.body.message).toContain(
      "유저 아이디는 비어있지 않아야 합니다.",
    );
    expect(postResponse.body.message).toContain(
      "적절하지 않은 유저 아이디 양식입니다.",
    );
  });

  it("형식에 맞지 않은 아이디에 대한 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "abcd",
        password: "password!",
      })
      .expect(400);

    expect(postResponse.body.message).toContain(
      "적절하지 않은 유저 아이디 양식입니다.",
    );
  });

  it("형식에 맞지 않은 아이디에 대한 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "123456789012345678901",
        password: "password!",
      })
      .expect(400);

    expect(postResponse.body.message).toContain(
      "적절하지 않은 유저 아이디 양식입니다.",
    );
  });

  it("형식에 맞지 않은 아이디에 대한 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "abcde-?!",
        password: "password!",
      })
      .expect(400);

    expect(postResponse.body.message).toContain(
      "적절하지 않은 유저 아이디 양식입니다.",
    );
  });

  it("형식에 맞지 않은 아이디에 대한 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: 123456,
        password: "password!",
      })
      .expect(400);

    expect(postResponse.body.message).toContain(
      "유저 아이디는 문자열이어야 합니다.",
    );
  });

  it("형식에 맞지 않은 비밀번호에 대한 요청 시 400 Bad Request 응답", async () => {
    const postResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "commonUser",
        password: "incorrect?!",
      })
      .expect(400);

    expect(postResponse.body.message).toContain(
      "적절하지 않은 비밀번호 양식입니다.",
    );
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
