import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ValidationPipe } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMTestConfig } from "src/configs/typeorm.test.config";
import { User } from "src/auth/users.entity";
import { UsersRepository } from "src/auth/users.repository";
import { RedisModule } from "@liaoliaots/nestjs-redis";

describe("[액세스 토큰 재발급] /auth/reissue POST 통합 테스트", () => {
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
      providers: [UsersRepository],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        userId: "SignoutTestUserId",
        password: "SignoutTestPassword",
        email: "signouttestemail@naver.com",
        nickname: "SignoutTestUser",
      })
      .expect(204);
  });

  afterAll(async () => {
    const usersRepository = new UsersRepository();

    const testUser = await usersRepository.getUserByUserId("SignoutTestUserId");
    if (testUser) {
      await User.remove(testUser);
    }

    await app.close();
  });

  it("올바른 토큰으로 요청 시 201 Created 응답", async () => {
    const signInResponse = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "SignoutTestUserId",
        password: "SignoutTestPassword",
      })
      .expect(201);

    expect(signInResponse.body).toHaveProperty("accessToken");

    const { accessToken } = signInResponse.body;

    await request(app.getHttpServer())
      .post("/auth/reissue")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(201);
  });

  it("유효하지 않은 액세스 토큰이 포함된 상태로 로그아웃 요청 시 401 Unauthorized 응답", async () => {
    await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "SignoutTestUserId",
        password: "SignoutTestPassword",
      })
      .expect(201);

    const invalidAccessToken = "1234";
    const postResponse = await request(app.getHttpServer())
      .post("/auth/reissue")
      .set("Authorization", `Bearer ${invalidAccessToken}`)
      .expect(401);

    expect(postResponse.body).toEqual({
      error: "Unauthorized",
      message: "유효하지 않은 토큰입니다.",
      statusCode: 401,
    });
  });

  it("토큰이 존재하지 않은 상태로 로그아웃 요청 시 401 Unauthorized 응답", async () => {
    await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        userId: "SignoutTestUserId",
        password: "SignoutTestPassword",
      })
      .expect(201);

    const postResponse = await request(app.getHttpServer())
      .post("/auth/reissue")
      .expect(401);

    expect(postResponse.body).toEqual({
      error: "Unauthorized",
      message: "비로그인 상태의 요청입니다.",
      statusCode: 401,
    });
  });
});
